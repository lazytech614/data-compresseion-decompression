function compress(inputBuffer, windowSize = 255, lookaheadBufferSize = 15) {
  const input = [...inputBuffer];
  const compressed = [];
  let pos = 0;

  while (pos < input.length) {
    let matchLength = 0;
    let matchDistance = 0;

    const start = Math.max(0, pos - windowSize);
    const end = Math.min(pos + lookaheadBufferSize, input.length);

    for (let i = start; i < pos; i++) {
      let length = 0;
      while (length < end - pos && input[i + length] === input[pos + length]) {
        length++;
      }

      if (length > matchLength) {
        matchLength = length;
        matchDistance = pos - i;
      }
    }

    const nextSymbol = matchLength > 0 ? input[pos + matchLength] : input[pos];
    compressed.push([matchDistance, matchLength, nextSymbol]);
    pos += matchLength > 0 ? matchLength + 1 : 1;
  }

  const out = [];
  for (const [distance, length, symbol] of compressed) {
    if (length >= 3) {
      out.push(0x80 | ((length & 0x0f) << 4) | (distance >> 8));
      out.push(distance & 0xff);
      out.push(symbol);
    } else {
      out.push(symbol);
    }
  }

  return { compressedBuffer: Buffer.from(out), metadata: {} };
}

function decompress(compressedBuffer) {
  const input = [...compressedBuffer];
  const output = [];
  let i = 0;

  const MIN_MATCH = 3;

  while (i < input.length) {
    const flag = input[i++];
    for (let bit = 0; bit < 8 && i < input.length; bit++) {
      if (flag & (1 << bit)) {
        output.push(input[i++]);
      } else {
        const b1 = input[i++];
        const b2 = input[i++];
        const offset = ((b1 << 4) | (b2 >> 4)) & 0xfff;
        const length = (b2 & 0xf) + MIN_MATCH;
        const start = output.length - offset;
        for (let j = 0; j < length; j++) {
          output.push(output[start + j]);
        }
      }
    }
  }

  return { decompressedBuffer: Buffer.from(output) };
}

export { compress, decompress };
