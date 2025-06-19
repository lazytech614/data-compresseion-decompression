function compress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");

  // Initialize dictionary with single characters
  const dictionary = new Map();
  let dictSize = 256;

  // Add all possible byte values to dictionary
  for (let i = 0; i < 256; i++) {
    dictionary.set(String.fromCharCode(i), i);
  }

  const compressed = [];
  let current = "";

  for (const char of input) {
    const combined = current + char;

    if (dictionary.has(combined)) {
      current = combined;
    } else {
      // Output code for current string
      compressed.push(dictionary.get(current));

      // Add new string to dictionary
      if (dictSize < 65536) {
        // Limit dictionary size
        dictionary.set(combined, dictSize++);
      }

      current = char;
    }
  }

  // Output code for remaining string
  if (current) {
    compressed.push(dictionary.get(current));
  }

  // Convert codes to buffer (using 16-bit codes)
  const buffer = Buffer.alloc(compressed.length * 2);
  for (let i = 0; i < compressed.length; i++) {
    buffer.writeUInt16BE(compressed[i], i * 2);
  }

  return { compressedBuffer: buffer, metadata: {} };
}

function decompress(inputBuffer) {
  // Read 16-bit codes from buffer
  const codes = [];
  for (let i = 0; i < inputBuffer.length; i += 2) {
    codes.push(inputBuffer.readUInt16BE(i));
  }

  // Initialize dictionary with single characters
  const dictionary = new Map();
  let dictSize = 256;

  for (let i = 0; i < 256; i++) {
    dictionary.set(i, String.fromCharCode(i));
  }

  let decompressed = "";
  let previous = "";

  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    let entry;

    if (dictionary.has(code)) {
      entry = dictionary.get(code);
    } else if (code === dictSize) {
      // Handle special case where code is not yet in dictionary
      entry = previous + previous[0];
    } else {
      throw new Error(`Invalid LZW code: ${code}`);
    }

    decompressed += entry;

    // Add new entry to dictionary
    if (previous && dictSize < 65536) {
      dictionary.set(dictSize++, previous + entry[0]);
    }

    previous = entry;
  }

  return { decompressedBuffer: Buffer.from(decompressed, "utf-8") };
}

export { compress, decompress };
