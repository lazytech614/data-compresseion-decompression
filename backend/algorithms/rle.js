function compress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");
  let output = "";
  let count = 1;
  for (let i = 1; i <= input.length; i++) {
    if (input[i] === input[i - 1]) {
      count++;
    } else {
      output += input[i - 1] + count;
      count = 1;
    }
  }
  // Convert output string to Buffer
  return {
    compressedBuffer: Buffer.from(output, "utf-8"),
    metadata: {}, // RLE doesn’t need extra metadata
  };
}

function decompress(inputBuffer) {
  const input = inputBuffer.toString("utf-8");
  let output = "";
  // Each pair: character + count (assuming single‐digit count for simplicity).
  // In a robust implementation, you’d parse more carefully (e.g., multi‐digit counts).
  let i = 0;
  while (i < input.length) {
    const char = input[i++];
    let numStr = "";
    while (i < input.length && /[0-9]/.test(input[i])) {
      numStr += input[i++];
    }
    const count = parseInt(numStr, 10);
    output += char.repeat(count);
  }
  return { decompressedBuffer: Buffer.from(output, "utf-8") };
}

export { compress, decompress };
