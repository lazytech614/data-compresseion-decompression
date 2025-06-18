# 🚀 CompressFlow - Data Compression & Decompression Portal

<div align="center">
  
![CompressFlow Logo](https://img.shields.io/badge/CompressFlow-Data%20Compression-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzIDJMMTMgN0gxOEwxMyAyWiIgZmlsbD0iIzY2NjZGRiIvPgo8L3N2Zz4K)

**A powerful web application for compressing and decompressing files using advanced algorithms with real-time visualization and performance analytics.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-brightgreen?style=for-the-badge)](https://data-compresseion-decompression.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/lazytech614/data-compresseion-decompression?style=for-the-badge)](https://github.com/lazytech614/data-compresseion-decompression)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://github.com/lazytech614/data-compresseion-decompression/assets/placeholder/dashboard.png)
*Main dashboard showing compression statistics, file type distribution, and recent jobs*

### Performance Analytics
![Analytics](https://github.com/lazytech614/data-compresseion-decompression/assets/placeholder/analytics.png)
*Detailed performance analytics comparing different compression algorithms*

### File Upload Interface
![Upload Interface](https://github.com/lazytech614/data-compresseion-decompression/assets/placeholder/upload.png)
*Clean and intuitive file upload interface with algorithm selection*

## ✨ Features

### 🔧 Core Functionality
- **Multi-Algorithm Support**: Huffman Coding, LZ77, LZW, and more
- **Dual Mode Operation**: Compress and decompress files seamlessly
- **Universal File Support**: Works with all file types and formats
- **Real-time Processing**: Instant compression/decompression with live feedback

### 📊 Analytics & Visualization
- **Compression Statistics**: Track compression ratios, space saved, and success rates
- **Performance Metrics**: Monitor CPU usage, processing speed, and efficiency
- **File Type Analysis**: Detailed breakdown of compression effectiveness by file type
- **Historical Data**: View usage analytics over time (7, 30, 90 days)

### 🎯 User Experience
- **Drag & Drop Interface**: Intuitive file upload experience
- **Progress Tracking**: Real-time progress indicators for large files
- **Download Management**: Direct download of processed files
- **Error Handling**: Comprehensive error reporting and recovery

### 🔍 Advanced Features
- **Algorithm Comparison**: Side-by-side performance analysis
- **Batch Processing**: Handle multiple files simultaneously
- **Metadata Preservation**: Maintain file integrity during compression
- **Optimization Settings**: Fine-tune compression parameters

## 🏗️ Architecture

CompressFlow is built using modern web technologies with a clean separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Algorithms    │
│   (Next.js)     │◄──►│   (Express)     │◄──►│   (Native JS)   │
│                 │    │                 │    │                 │
│ • React UI      │    │ • API Routes    │    │ • Huffman       │
│ • Tailwind CSS  │    │ • File Handler  │    │ • LZ77          │
│ • Charts/Viz    │    │ • Statistics    │    │ • LZW           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lazytech614/data-compresseion-decompression.git
   cd data-compresseion-decompression
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   npm install
   
   # Backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment setup**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Configure your environment variables
   nano .env.local
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Frontend (Next.js)
   npm run dev
   
   # Terminal 2: Backend (Express)
   cd server
   npm run dev
   ```

5. **Open in browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000/api](http://localhost:5000/api)

## 📁 Project Structure

```
data-compression-decompression/
│
├── 📱 Frontend (Next.js App Router)
│   ├── app/
│   │   ├── page.tsx                 # Home page
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Analytics dashboard
│   │   ├── visualize/
│   │   │   └── page.tsx            # Performance visualization
│   │   └── globals.css             # Global styles
│   │
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── charts/                 # Chart components
│   │   ├── file-uploader.tsx       # File upload component
│   │   ├── algorithm-selector.tsx  # Algorithm picker
│   │   └── stats-display.tsx       # Statistics display
│   │
│   └── utils/
│       ├── api.ts                  # API utilities
│       ├── compression.ts          # Compression helpers
│       └── analytics.ts            # Analytics functions
│
├── 🔧 Backend (Express API)
│   ├── server/
│   │   ├── routes/
│   │   │   ├── compress.js         # Compression endpoints
│   │   │   ├── decompress.js       # Decompression endpoints
│   │   │   └── analytics.js        # Analytics endpoints
│   │   │
│   │   ├── algorithms/
│   │   │   ├── huffman.js          # Huffman coding
│   │   │   ├── lz77.js             # LZ77 algorithm
│   │   │   └── lzw.js              # LZW algorithm
│   │   │
│   │   ├── middleware/
│   │   │   ├── upload.js           # File upload handling
│   │   │   └── validation.js       # Request validation
│   │   │
│   │   └── index.js                # Express app entry
│   │
│   └── package.json
│
├── 📊 Data & Config
│   ├── public/
│   │   ├── images/                 # Static assets
│   │   └── icons/                  # App icons
│   │
│   ├── .env.local                  # Environment variables
│   ├── next.config.js              # Next.js configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── package.json                # Dependencies
│
└── 📚 Documentation
    ├── README.md                   # Project documentation
    ├── LICENSE                     # MIT License
    └── CONTRIBUTING.md             # Contribution guidelines
```

## 🔌 API Documentation

### Compression Endpoint
```http
POST /api/compress
Content-Type: multipart/form-data

Parameters:
- file: File to compress
- algorithm: Compression algorithm ('huffman', 'lz77', 'lzw')
- options: Algorithm-specific options (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "example.txt",
    "originalSize": 1024,
    "compressedSize": 512,
    "compressionRatio": 0.5,
    "algorithm": "huffman",
    "compressedData": "base64-encoded-data",
    "metadata": {
      "processingTime": 45,
      "memoryUsed": "2.1MB"
    }
  }
}
```

### Decompression Endpoint
```http
POST /api/decompress
Content-Type: multipart/form-data

Parameters:
- file: Compressed file
- algorithm: Original compression algorithm
- metadata: Decompression metadata (if required)
```

### Analytics Endpoint
```http
GET /api/analytics?period=30d

Response: Compression statistics and performance metrics
```

## 🧮 Supported Algorithms

| Algorithm | Type | Best For | Compression Ratio | Speed |
|-----------|------|----------|-------------------|-------|
| **Huffman Coding** | Entropy | Text files, code | High | Fast |
| **LZ77** | Dictionary | General purpose | Medium | Medium |
| **LZW** | Dictionary | Images, binaries | Medium-High | Fast |
| **DEFLATE** | Hybrid | Web content | High | Medium |

### Algorithm Performance Comparison

```
Compression Ratio (Higher is better)
████████████████████████████████████████ Huffman (0.65)
██████████████████████████████████ LZW (0.58)
███████████████████████████ LZ77 (0.52)

Processing Speed (Higher is better)
████████████████████████████████████████ LZW (52ms)
██████████████████████████████████ LZ77 (48ms)
███████████████████████ Huffman (35ms)
```

## 🎨 Key Components

### File Uploader
```typescript
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  maxSize: number;
}
```

### Algorithm Selector
```typescript
interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selected: string;
  onSelect: (algorithm: string) => void;
}
```

### Statistics Display
```typescript
interface StatsDisplayProps {
  originalSize: number;
  compressedSize: number;
  processingTime: number;
  algorithm: string;
}
```

## 📈 Performance Metrics

CompressFlow tracks comprehensive performance metrics:

- **Compression Efficiency**: Ratio of size reduction
- **Processing Speed**: Time taken for compression/decompression
- **Memory Usage**: RAM consumption during processing
- **Success Rate**: Percentage of successful operations
- **File Type Analysis**: Performance breakdown by file type

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run dev:server   # Start backend only
npm run dev:client   # Start frontend only

# Building
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests

# Linting & Formatting
npm run lint         # Lint code
npm run format       # Format code with Prettier
```

### Adding New Algorithms

1. **Create algorithm file** in `server/algorithms/`
2. **Implement interface**:
   ```javascript
   class MyAlgorithm {
     compress(data) { /* implementation */ }
     decompress(data, metadata) { /* implementation */ }
     getMetadata() { /* return algorithm info */ }
   }
   ```
3. **Register algorithm** in `server/routes/compress.js`
4. **Add to frontend selector** in `components/algorithm-selector.tsx`
5. **Update documentation**

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write comprehensive tests for new features
- Document public APIs with JSDoc
- Use semantic commit messages

## 🚦 Testing

### Running Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/
│   ├── algorithms/
│   ├── components/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── compression-flow.spec.js
```

## 🚢 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api-domain.com
MAX_FILE_SIZE=10485760  # 10MB
COMPRESSION_TIMEOUT=30000  # 30 seconds
NODE_ENV=production
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Heroku**
- **Docker** (Dockerfile included)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Areas for Contribution
- 🔧 New compression algorithms
- 📊 Enhanced analytics features
- 🎨 UI/UX improvements
- 🐛 Bug fixes and optimizations
- 📚 Documentation updates
- ⚡ Performance improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Compression Algorithms**: Based on classical computer science algorithms
- **UI Design**: Inspired by modern data visualization principles
- **Performance Optimization**: Thanks to the open-source community
- **Testing**: Comprehensive test suite for reliability

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/lazytech614/data-compresseion-decompression/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lazytech614/data-compresseion-decompression/discussions)
- **Email**: support@compressflow.dev

## 🎯 Roadmap

### Version 2.0 (Coming Soon)
- [ ] Advanced algorithm customization
- [ ] Batch file processing
- [ ] Cloud storage integration
- [ ] Real-time collaboration
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Advanced security features

### Version 2.1
- [ ] Machine learning optimization
- [ ] Custom algorithm builder
- [ ] Enterprise features
- [ ] Advanced reporting

---

<div align="center">

**Made with ❤️ by [LazyTech614](https://github.com/lazytech614)**

⭐ **If you found this project helpful, please consider giving it a star!** ⭐

[![GitHub Stars](https://img.shields.io/github/stars/lazytech614/data-compresseion-decompression?style=social)](https://github.com/lazytech614/data-compresseion-decompression)

</div>