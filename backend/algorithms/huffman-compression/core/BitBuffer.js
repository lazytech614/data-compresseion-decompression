export class BitBuffer {
  constructor() {
    this.buffer = [];
    this.currentByte = 0;
    this.bitCount = 0;
  }

  writeBits(bits) {
    for (const bit of bits) {
      this.currentByte = (this.currentByte << 1) | (bit === "1" ? 1 : 0);
      this.bitCount++;

      if (this.bitCount === 8) {
        this.buffer.push(this.currentByte);
        this.currentByte = 0;
        this.bitCount = 0;
      }
    }
  }

  finalize() {
    if (this.bitCount > 0) {
      // Left-align remaining bits and pad with zeros
      this.currentByte = this.currentByte << (8 - this.bitCount);
      this.buffer.push(this.currentByte);
    }
    return Buffer.from(this.buffer);
  }

  getPaddingBits() {
    return this.bitCount > 0 ? 8 - this.bitCount : 0;
  }

  getSize() {
    return this.buffer.length + (this.bitCount > 0 ? 1 : 0);
  }

  reset() {
    this.buffer = [];
    this.currentByte = 0;
    this.bitCount = 0;
  }
}
