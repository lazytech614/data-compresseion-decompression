function buildFrequencyTable(input) {
  const freq = new Map();
  for (const char of input) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  return freq;
}

function buildCumulativeTable(freqTable) {
  const total = Array.from(freqTable.values()).reduce(
    (sum, freq) => sum + freq,
    0
  );
  const cumulative = new Map();
  let cumSum = 0;

  for (const [char, freq] of freqTable) {
    cumulative.set(char, {
      low: cumSum / total,
      high: (cumSum + freq) / total,
      freq: freq,
    });
    cumSum += freq;
  }

  return cumulative;
}

function compress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");

  if (input.length === 0) {
    return { compressedBuffer: Buffer.alloc(0), metadata: { freqTable: {} } };
  }

  const freqTable = buildFrequencyTable(input);
  const cumTable = buildCumulativeTable(freqTable);

  let low = 0.0;
  let high = 1.0;

  // Encode each character
  for (const char of input) {
    const range = high - low;
    const charData = cumTable.get(char);

    high = low + range * charData.high;
    low = low + range * charData.low;
  }

  // Choose a value in the final range
  const finalValue = (low + high) / 2;

  // Convert to binary representation
  // Use sufficient precision to distinguish the value
  const precision = Math.ceil(-Math.log2(high - low)) + 10;
  const scaledValue = Math.floor(finalValue * Math.pow(2, precision));

  // Convert to buffer
  const bytes = [];
  let temp = scaledValue;
  while (temp > 0 || bytes.length === 0) {
    bytes.unshift(temp & 0xff);
    temp = Math.floor(temp / 256);
  }

  const compressedBuffer = Buffer.from(bytes);
  const metadata = {
    freqTable: Object.fromEntries(freqTable),
    precision: precision,
    length: input.length,
  };

  return { compressedBuffer, metadata };
}

function decompress(inputBuffer, metadata) {
  if (metadata.length === 0) {
    return { decompressedBuffer: Buffer.alloc(0) };
  }

  const freqTable = new Map(Object.entries(metadata.freqTable));
  const cumTable = buildCumulativeTable(freqTable);
  const precision = metadata.precision;
  const originalLength = metadata.length;

  // Convert buffer back to scaled value
  let scaledValue = 0;
  for (const byte of inputBuffer) {
    scaledValue = scaledValue * 256 + byte;
  }

  // Convert back to decimal value
  const value = scaledValue / Math.pow(2, precision);

  let decompressed = "";
  let low = 0.0;
  let high = 1.0;

  // Decode characters
  for (let i = 0; i < originalLength; i++) {
    const range = high - low;
    const scaledPos = (value - low) / range;

    // Find which character this position corresponds to
    let foundChar = null;
    for (const [char, data] of cumTable) {
      if (scaledPos >= data.low && scaledPos < data.high) {
        foundChar = char;
        break;
      }
    }

    if (!foundChar) {
      // Handle edge case - find closest match
      let minDist = Infinity;
      for (const [char, data] of cumTable) {
        const dist = Math.min(
          Math.abs(scaledPos - data.low),
          Math.abs(scaledPos - data.high)
        );
        if (dist < minDist) {
          minDist = dist;
          foundChar = char;
        }
      }
    }

    decompressed += foundChar;

    // Update range for next character
    const charData = cumTable.get(foundChar);
    high = low + range * charData.high;
    low = low + range * charData.low;
  }

  return { decompressedBuffer: Buffer.from(decompressed, "utf-8") };
}

export { compress, decompress };
