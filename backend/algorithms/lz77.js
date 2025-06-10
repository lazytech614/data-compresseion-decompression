//TODO: Later update this algo
import zlib from "zlib";

function compress(inputBuffer) {
  const compressedBuffer = zlib.deflateSync(inputBuffer);
  return { compressedBuffer, metadata: {} };
}

function decompress(inputBuffer) {
  const decompressedBuffer = zlib.inflateSync(inputBuffer);
  return { decompressedBuffer };
}

export { compress, decompress };
