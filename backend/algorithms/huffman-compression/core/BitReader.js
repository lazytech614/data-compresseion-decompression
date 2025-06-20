export class BitReader {
  constructor(buffer, paddingBits = 0) {
    this.buffer = buffer;
    this.byteIndex = 0;
    this.bitIndex = 0;
    this.paddingBits = paddingBits;
    this.totalBits = buffer.length * 8 - paddingBits;
    this.bitsRead = 0;
  }

  readBit() {
    if (this.bitsRead >= this.totalBits) {
      return null; // End of valid data
    }

    if (this.byteIndex >= this.buffer.length) {
      return null;
    }

    const byte = this.buffer[this.byteIndex];
    const bit = (byte >> (7 - this.bitIndex)) & 1;

    this.bitIndex++;
    this.bitsRead++;

    if (this.bitIndex === 8) {
      this.bitIndex = 0;
      this.byteIndex++;
    }

    return bit.toString();
  }

  hasMoreBits() {
    return this.bitsRead < this.totalBits;
  }

  getProgress() {
    return this.totalBits > 0 ? (this.bitsRead / this.totalBits) * 100 : 100;
  }

  getRemainingBits() {
    return Math.max(0, this.totalBits - this.bitsRead);
  }

  reset() {
    this.byteIndex = 0;
    this.bitIndex = 0;
    this.bitsRead = 0;
  }
}
