function compress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");

  if (input.length === 0) {
    return {
      compressedBuffer: Buffer.alloc(0),
      metadata: {},
    };
  }

  let output = "";
  let i = 0;

  while (i < input.length) {
    let count = 1;
    let currentChar = input[i];

    // Count consecutive identical characters
    while (i + count < input.length && input[i + count] === currentChar) {
      count++;
    }

    if (count >= 3) {
      // Use RLE encoding: #<char><count>
      output += "#" + currentChar + count;
    } else {
      // Output characters as-is (no compression benefit)
      output += currentChar.repeat(count);
    }

    i += count;
  }

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
    if (input[i] === "#") {
      // RLE encoded sequence
      i++; // Skip the #
      const char = input[i++];

      // Get the count
      let numStr = "";
      while (i < input.length && /[0-9]/.test(input[i])) {
        numStr += input[i++];
      }

      const count = parseInt(numStr, 10);
      output += char.repeat(count);
    } else {
      // Regular character
      output += input[i++];
    }
  }

  return { decompressedBuffer: Buffer.from(output, "utf-8") };
}

export { compress, decompress };
