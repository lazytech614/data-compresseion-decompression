function compress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");

  if (input.length === 0) {
    return {
      compressedBuffer: Buffer.alloc(0),
      metadata: {},
    };
  }

  let output = "";
  let count = 1;
  let currentChar = input[0];

  for (let i = 1; i < input.length; i++) {
    if (input[i] === currentChar) {
      count++;
    } else {
      // Output the run: character followed by count
      output += currentChar + count;
      currentChar = input[i];
      count = 1;
    }
  }

  // Don't forget the last run
  output += currentChar + count;

  return {
    compressedBuffer: Buffer.from(output, "utf-8"),
    metadata: {},
  };
}

function decompress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");

  if (input.length === 0) {
    return { decompressedBuffer: Buffer.alloc(0) };
  }

  let output = "";
  let i = 0;

  while (i < input.length) {
    // Get the character
    const char = input[i++];

    // Get the count (may be multi-digit)
    let numStr = "";
    while (i < input.length && /[0-9]/.test(input[i])) {
      numStr += input[i++];
    }

    // Parse count and repeat character
    const count = parseInt(numStr, 10);
    if (isNaN(count)) {
      throw new Error("Invalid RLE format: missing count");
    }

    output += char.repeat(count);
  }

  return { decompressedBuffer: Buffer.from(output, "utf-8") };
}

export { compress, decompress };
