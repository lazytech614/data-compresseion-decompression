// /models/Compression.ts
import mongoose from 'mongoose';

const CompressionSchema = new mongoose.Schema({
  userId: String,
  fileName: String,
  mode: String, // "compress" or "decompress"
  stats: {
    originalSize: Number,
    newSize: Number,
    compressionRatio: Number,
    timeMs: Number,
  },
  metadata: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Compression || mongoose.model('Compression', CompressionSchema);
