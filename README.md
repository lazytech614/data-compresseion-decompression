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
![Dashboard](https://postimg.cc/cgBfBG1R)
![Dashboard](https://github.com/lazytech614/data-compresseion-decompression/tree/main/assets/dashboard_2.png)
*Main dashboard showing compression statistics, file type distribution, and recent jobs*

### Performance Analytics
![Analytics](https://github.com/lazytech614/data-compresseion-decompression/tree/main/assets/analytics_1.png)
![Analytics](https://github.com/lazytech614/data-compresseion-decompression/tree/main/assets/analytics_2.png)
*Detailed performance analytics comparing different compression algorithms*

### Learning Resources
![Learning Resources](https://github.com/lazytech614/data-compresseion-decompression/tree/main/assets/learning_resources.png)
*Various learning resources to know more about diffrent algorithms*

### Algorithm Details
![Algorithm Details](https://github.com/lazytech614/data-compresseion-decompression/tree/main/assets/algorithm_details.png)
*Some key points about famous and widely used algorithms*

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
- **User Authentication**: Secure login with Clerk authentication

### 🔍 Advanced Features
- **Algorithm Comparison**: Side-by-side performance analysis
- **Batch Processing**: Handle multiple files simultaneously
- **Metadata Preservation**: Maintain file integrity during compression
- **Optimization Settings**: Fine-tune compression parameters
- **Data Persistence**: Store compression history with NeonDB

## 🏗️ Architecture

CompressFlow is built using modern web technologies with a clean separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js 13)  │◄──►│   (Express)     │◄──►│   (NeonDB)      │
│                 │    │                 │    │                 │
│ • React UI      │    │ • API Routes    │    │ • PostgreSQL    │
│ • Tailwind CSS  │    │ • File Handler  │    │ • User Data     │
│ • Clerk Auth    │    │ • Statistics    │    │ • History       │
│ • Charts/Viz    │    │ • Algorithms    │    │ • Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🖥️ How to Set Up Locally

### Prerequisites
Make sure you have the following installed on your system:
- **Node.js v16+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Modern web browser** (Chrome, Firefox, Edge)

### Step-by-Step Setup Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/lazytech614/data-compresseion-decompression.git
cd data-compresseion-decompression
```

#### 2. Set Up the Frontend

**Install Frontend Dependencies:**
```bash
# In the root directory
npm install
# or
yarn install
```

**Create Frontend Environment File:**
```bash
# Create .env.local in the root directory
touch .env.local
```

**Configure Frontend Environment Variables:**
Add the following to your `.env.local` file:
```bash
# API Configuration
NEXT_PUBLIC_API_BASE="http://localhost:5000"

# Clerk Authentication (Create account at https://clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key_here"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key_here"

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/auth/callback"
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL="/auth/callback"

# Database Configuration (Create database at https://neon.tech)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
```

#### 3. Set Up the Backend

**Navigate to Server Directory:**
```bash
cd server
```

**Install Backend Dependencies:**
```bash
npm install
# or
yarn install
```

**Create Backend Environment File:**
```bash
# Create .env in the server directory
touch .env
```

**Configure Backend Environment Variables:**
Add the following to your `server/.env` file:
```bash
# Server Configuration
PORT="5000"
FRONTEND_URL="http://localhost:3000"
```

**Create Uploads Directory:**
```bash
# In the server directory, create an uploads folder
mkdir uploads
```

#### 4. Set Up External Services

**Set Up Clerk Authentication:**
1. Go to [Clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your publishable key and secret key
4. Update the Clerk environment variables in `.env.local`

**Set Up NeonDB Database:**
1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new database project
3. Copy the connection string from your dashboard
4. Update the `DATABASE_URL` in `.env.local`

#### 5. Start the Development Servers

**Terminal 1 - Start the Backend Server:**
```bash
# From the server directory
cd server
npm run dev

# You should see:
# Server running on http://localhost:5000
```

**Terminal 2 - Start the Frontend Server:**
```bash
# From the root directory (open a new terminal)
npm run dev

# You should see:
# Next.js ready on http://localhost:3000
```

#### 6. Verify the Setup

1. **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
2. **Backend API**: Check [http://localhost:5000/api](http://localhost:5000/api) for API status
3. **Authentication**: Try creating an account and logging in
4. **File Upload**: Test uploading a file and compressing it

### 🔧 Troubleshooting

**Common Issues and Solutions:**

1. **Port Already in Use:**
   ```bash
   # Kill process on port 3000 or 5000
   npx kill-port 3000
   npx kill-port 5000
   ```

2. **Module Not Found Errors:**
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database Connection Error:**
   - Verify your NeonDB connection string is correct
   - Check if your IP is whitelisted in NeonDB dashboard
   - Ensure the database URL includes `?sslmode=require`

4. **Clerk Authentication Issues:**
   - Verify your Clerk keys are correct
   - Check if your domain is configured in Clerk dashboard
   - Ensure redirect URLs match your configuration

5. **File Upload Issues:**
   - Ensure the `uploads` folder exists in the server directory
   - Check file permissions for the uploads folder
   - Verify the file size doesn't exceed limits

### 📦 Project Structure Deep Dive

```
data-compression-decompression/
│
├── 📱 Frontend (Next.js 13 App Router)
│   ├── app/
│   │   ├── page.tsx                 # Home page with upload interface
│   │   ├── dashboard/
│   │   │   └── page.tsx            # Analytics dashboard
│   │   ├── visualize/
│   │   │   └── page.tsx            # Performance visualization
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── page.tsx        # Clerk auth callback
│   │   ├── result/
│   │   │   └── page.tsx            # Compression results
│   │   ├── layout.tsx              # Root layout with Clerk
│   │   └── globals.css             # Global styles with Tailwind
│   │
│   ├── components/
│   │   ├── global/
│   │   │   ├── file-uploader.tsx       # Drag & drop file upload
│   │   │   ├── algorithm-selector.tsx  # Algorithm picker
│   │   │   ├── stats-display.tsx       # Compression statistics
│   │   │   ├── download-button.tsx     # File download component
│   │   │   └── progress-bar.tsx        # Progress indicator
│   │   │
│   │   ├── ui/                         # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── toast.tsx
│   │   │
│   │   └── charts/                     # Data visualization
│   │       ├── compression-chart.tsx
│   │       ├── performance-chart.tsx
│   │       └── analytics-dashboard.tsx
│   │
│   ├── utils/
│   │   ├── api.ts                      # API client functions
│   │   ├── compression.ts              # Compression utilities
│   │   ├── analytics.ts                # Analytics helpers
│   │   └── auth.ts                     # Authentication utilities
│   │
│   ├── lib/
│   │   ├── db.ts                       # Database connection
│   │   └── clerk.ts                    # Clerk configuration
│   │
│   ├── .env.local                      # Frontend environment variables
│   ├── next.config.js                  # Next.js configuration
│   ├── tailwind.config.js              # Tailwind CSS config
│   └── package.json                    # Frontend dependencies
│
├── 🔧 Backend (Express API)
│   ├── server/
│   │   ├── routes/
│   │   │   ├── compress.js             # Compression endpoints
│   │   │   ├── decompress.js           # Decompression endpoints
│   │   │   ├── analytics.js            # Analytics endpoints
│   │   │   └── auth.js                 # Authentication routes
│   │   │
│   │   ├── controllers/
│   │   │   ├── compressionController.js
│   │   │   ├── analyticsController.js
│   │   │   └── fileController.js
│   │   │
│   │   ├── algorithms/
│   │   │   ├── huffman.js              # Huffman coding implementation
│   │   │   ├── lz77.js                 # LZ77 algorithm
│   │   │   ├── lzw.js                  # LZW algorithm
│   │   │   └── deflate.js              # DEFLATE algorithm
│   │   │
│   │   ├── middleware/
│   │   │   ├── upload.js               # Multer file upload
│   │   │   ├── validation.js           # Request validation
│   │   │   ├── auth.js                 # Authentication middleware
│   │   │   └── rateLimit.js            # Rate limiting
│   │   │
│   │   ├── models/
│   │   │   ├── User.js                 # User model
│   │   │   ├── CompressionJob.js       # Compression job model
│   │   │   └── Analytics.js            # Analytics model
│   │   │
│   │   ├── uploads/                    # File upload directory (create this!)
│   │   ├── .env                        # Backend environment variables
│   │   ├── index.js                    # Express app entry point
│   │   └── package.json                # Backend dependencies
│   │
└── 📚 Documentation
    ├── README.md                       # This file
    ├── API.md                          # API documentation
    ├── CONTRIBUTING.md                 # Contribution guidelines
    └── LICENSE                         # MIT License
```

## 🔌 API Documentation

### Authentication
All API endpoints require authentication via Clerk JWT tokens passed in the Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

### Compression Endpoint
```http
POST /api/compress
Content-Type: multipart/form-data
Authorization: Bearer <token>

Parameters:
- file: File to compress (required)
- algorithm: Compression algorithm ('huffman', 'lz77', 'lzw', 'deflate')
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
    "compressedBase64": "base64-encoded-compressed-data",
    "metadata": {
      "processingTime": 45,
      "memoryUsed": "2.1MB",
      "huffmanTable": { /* for Huffman algorithm */ }
    },
    "jobId": "unique-job-identifier"
  }
}
```

### Decompression Endpoint
```http
POST /api/decompress
Content-Type: multipart/form-data
Authorization: Bearer <token>

Parameters:
- file: Compressed file (required)
- algorithm: Original compression algorithm (required)
- metadata: Compression metadata (required for some algorithms)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileName": "decompressed_example.txt",
    "originalSize": 512,
    "decompressedSize": 1024,
    "algorithm": "huffman",
    "decompressedBase64": "base64-encoded-decompressed-data",
    "metadata": {
      "processingTime": 32,
      "memoryUsed": "1.8MB"
    }
  }
}
```

### Analytics Endpoints
```http
GET /api/analytics/dashboard?period=30d
GET /api/analytics/performance?algorithm=huffman
GET /api/analytics/history?limit=50
```

### Supported Algorithms Endpoint
```http
GET /api/algorithms

Response:
{
  "algorithms": [
    {
      "id": "huffman",
      "name": "Huffman Coding",
      "description": "Entropy-based compression",
      "bestFor": ["text", "code"],
      "avgRatio": 0.65
    },
    // ... more algorithms
  ]
}
```

## 🧮 Supported Algorithms

| Algorithm | Type | Best For | Compression Ratio | Speed | Memory Usage |
|-----------|------|----------|-------------------|-------|--------------|
| **Huffman Coding** | Entropy | Text files, source code | High (0.60-0.80) | Fast | Low |
| **LZ77** | Dictionary | General purpose files | Medium (0.45-0.65) | Medium | Medium |
| **LZW** | Dictionary | Images, binaries | Medium-High (0.50-0.70) | Fast | Medium |
| **DEFLATE** | Hybrid | Web content, archives | High (0.55-0.75) | Medium | Medium |

### Algorithm Performance Comparison

```
Compression Ratio (Higher is better)
████████████████████████████████████████ Huffman (0.65)
██████████████████████████████████ DEFLATE (0.62)
███████████████████████████████ LZW (0.58)
███████████████████████████ LZ77 (0.52)

Processing Speed (Higher is better)
████████████████████████████████████████ LZW (52ms avg)
██████████████████████████████████ LZ77 (48ms avg)
███████████████████████████████ DEFLATE (41ms avg)
███████████████████████ Huffman (35ms avg)

Memory Efficiency (Lower is better)
███████████████████████ Huffman (1.2MB avg)
███████████████████████████ LZ77 (1.8MB avg)
██████████████████████████████ LZW (2.1MB avg)
████████████████████████████████████ DEFLATE (2.4MB avg)
```

## 🎨 Key Components

### File Uploader Component
```typescript
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string[];
  maxSize: number;
  disabled?: boolean;
  multiple?: boolean;
}

// Features:
// - Drag & drop functionality
// - File type validation
// - Size limit enforcement
// - Progress indication
// - Error handling
```

### Algorithm Selector Component
```typescript
interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selected: string;
  onSelect: (algorithm: string) => void;
  showRecommendations?: boolean;
  fileType?: string;
}

// Features:
// - Algorithm comparison
// - Smart recommendations based on file type
// - Performance metrics display
// - Custom settings per algorithm
```

### Statistics Display Component
```typescript
interface StatsDisplayProps {
  originalSize: number;
  compressedSize: number;
  processingTime: number;
  algorithm: string;
  compressionRatio: number;
  memoryUsed: string;
  showComparison?: boolean;
}

// Features:
// - Real-time statistics
// - Visual compression ratio
// - Performance metrics
// - Historical comparison
```

### Authentication Integration
```typescript
// Clerk authentication wrapper
import { useAuth } from '@clerk/nextjs';

export function ProtectedComponent() {
  const { isLoaded, userId, signOut } = useAuth();
  
  if (!isLoaded) return <LoadingSpinner />;
  if (!userId) return <SignInPrompt />;
  
  return <CompressFlowApp />;
}
```

## 📈 Performance Metrics & Analytics

CompressFlow tracks comprehensive performance metrics:

### Core Metrics
- **Compression Efficiency**: Ratio of size reduction across different file types
- **Processing Speed**: Time taken for compression/decompression operations
- **Memory Usage**: RAM consumption during processing operations
- **Success Rate**: Percentage of successful operations vs. failures
- **Throughput**: Files processed per minute/hour

### Advanced Analytics
- **File Type Analysis**: Performance breakdown by file extension and MIME type
- **Algorithm Comparison**: Side-by-side performance analysis
- **User Behavior**: Most used algorithms, average file sizes, peak usage times
- **System Performance**: CPU usage, memory consumption, disk I/O
- **Error Tracking**: Failure reasons, recovery success rates

### Data Visualization
- Interactive charts showing compression trends
- Real-time performance dashboards
- Historical data analysis (7, 30, 90 days)
- Algorithm efficiency comparisons
- User usage patterns

## 🛠️ Development

### Available Scripts

```bash
# Frontend Development
npm run dev              # Start Next.js development server
npm run build            # Build Next.js app for production
npm run start            # Start Next.js production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Backend Development
cd server
npm run dev              # Start Express server with nodemon
npm run start            # Start Express server in production
npm run test             # Run backend tests
npm run test:watch       # Run tests in watch mode

# Full Stack
npm run dev:all          # Start both frontend and backend
npm run build:all        # Build both frontend and backend
npm run test:all         # Run all tests (frontend + backend)

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:reset         # Reset database (development only)

# Linting & Formatting
npm run lint:fix         # Fix linting issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Development Workflow

1. **Start Development Environment:**
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   npm run dev
   
   # Terminal 3: Database (if needed)
   npm run db:migrate
   ```

2. **Make Changes:**
   - Frontend changes auto-reload at `http://localhost:3000`
   - Backend changes auto-reload at `http://localhost:5000`
   - Database schema changes require migration

3. **Testing:**
   ```bash
   # Run tests before committing
   npm run test:all
   npm run lint
   npm run type-check
   ```

### Adding New Algorithms

1. **Create Algorithm Implementation:**
   ```javascript
   // server/algorithms/my-algorithm.js
   class MyAlgorithm {
     constructor(options = {}) {
       this.options = options;
     }
     
     compress(data) {
       // Implementation here
       return {
         compressedData: compressed,
         metadata: { /* algorithm-specific data */ }
       };
     }
     
     decompress(compressedData, metadata) {
       // Implementation here
       return decompressedData;
     }
     
     getInfo() {
       return {
         id: 'my-algorithm',
         name: 'My Algorithm',
         description: 'Description of the algorithm',
         bestFor: ['file-type1', 'file-type2'],
         avgRatio: 0.6,
         avgSpeed: 45
       };
     }
   }
   
   module.exports = MyAlgorithm;
   ```

2. **Register Algorithm:**
   ```javascript
   // server/routes/compress.js
   const MyAlgorithm = require('../algorithms/my-algorithm');
   
   const algorithms = {
     'huffman': HuffmanAlgorithm,
     'lz77': LZ77Algorithm,
     'lzw': LZWAlgorithm,
     'my-algorithm': MyAlgorithm  // Add here
   };
   ```

3. **Update Frontend:**
   ```typescript
   // Update algorithm selector component
   const SUPPORTED_ALGORITHMS = [
     // ... existing algorithms
     {
       id: 'my-algorithm',
       name: 'My Algorithm',
       description: 'Description',
       icon: '🔧'
     }
   ];
   ```

4. **Add Tests:**
   ```javascript
   // tests/algorithms/my-algorithm.test.js
   describe('MyAlgorithm', () => {
     test('should compress data correctly', () => {
       // Test implementation
     });
     
     test('should decompress data correctly', () => {
       // Test implementation
     });
   });
   ```

### Code Style Guidelines

- **TypeScript**: Use TypeScript for all frontend code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Naming Conventions**:
  - Components: PascalCase (`FileUploader`)
  - Functions: camelCase (`compressFile`)
  - Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
  - Files: kebab-case (`file-uploader.tsx`)

### Performance Optimization Tips

1. **File Processing:**
   - Use streaming for large files
   - Implement chunked processing
   - Add progress callbacks

2. **Frontend Optimization:**
   - Lazy load heavy components
   - Use React.memo for expensive renders
   - Implement virtual scrolling for large lists

3. **Backend Optimization:**
   - Use worker threads for CPU-intensive tasks
   - Implement caching for frequently accessed data
   - Add request rate limiting

## 🚦 Testing

### Testing Strategy

CompressFlow uses a comprehensive testing approach:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test API endpoints and database interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Test algorithm efficiency and speed

### Running Tests

```bash
# Unit Tests
npm test                    # Run all unit tests
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Generate coverage report

# Integration Tests
npm run test:integration    # Test API endpoints
npm run test:db            # Test database operations

# E2E Tests
npm run test:e2e           # Run end-to-end tests
npm run test:e2e:headed    # Run E2E tests with browser UI

# Performance Tests
npm run test:performance   # Test algorithm performance
npm run test:load         # Run load testing
```

### Test Structure

```
tests/
├── unit/
│   ├── algorithms/
│   │   ├── huffman.test.js
│   │   ├── lz77.test.js
│   │   └── lzw.test.js
│   ├── components/
│   │   ├── file-uploader.test.tsx
│   │   ├── algorithm-selector.test.tsx
│   │   └── stats-display.test.tsx
│   └── utils/
│       ├── compression.test.ts
│       └── analytics.test.ts
├── integration/
│   ├── api/
│   │   ├── compress.test.js
│   │   ├── decompress.test.js
│   │   └── analytics.test.js
│   └── database/
│       ├── user.test.js
│       └── jobs.test.js
├── e2e/
│   ├── compression-flow.spec.js
│   ├── user-authentication.spec.js
│   └── analytics-dashboard.spec.js
└── performance/
    ├── algorithm-benchmarks.js
    └── load-testing.js
```

### Writing Tests

**Unit Test Example:**
```javascript
// tests/unit/algorithms/huffman.test.js
const HuffmanAlgorithm = require('../../../server/algorithms/huffman');

describe('HuffmanAlgorithm', () => {
  let huffman;
  
  beforeEach(() => {
    huffman = new HuffmanAlgorithm();
  });
  
  test('should compress text data efficiently', () => {
    const testData = 'hello world hello world';
    const result = huffman.compress(Buffer.from(testData));
    
    expect(result.compressedData).toBeDefined();
    expect(result.metadata.huffmanTable).toBeDefined();
    expect(result.compressedData.length).toBeLessThan(testData.length);
  });
  
  test('should decompress data to original form', () => {
    const testData = 'hello world hello world';
    const compressed = huffman.compress(Buffer.from(testData));
    const decompressed = huffman.decompress(
      compressed.compressedData, 
      compressed.metadata
    );
    
    expect(decompressed.toString()).toBe(testData);
  });
});
```

**Integration Test Example:**
```javascript
// tests/integration/api/compress.test.js
const request = require('supertest');
const app = require('../../../server/index');

describe('POST /api/compress', () => {
  test('should compress uploaded file', async () => {
    const response = await request(app)
      .post('/api/compress')
      .attach('file', 'tests/fixtures/sample.txt')
      .field('algorithm', 'huffman')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data.compressedBase64).toBeDefined();
    expect(response.body.data.compressionRatio).toBeGreaterThan(0);
  });
});
```

## 🚢 Deployment

### Environment Setup

**Production Environment Variables:**

Frontend (`.env.local`):
```bash
# API Configuration
NEXT_PUBLIC_API_BASE="https://your-api-domain.com"

# Clerk Authentication (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_your_production_key"
CLERK_SECRET_KEY="sk_live_your_production_secret"

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL="/auth/callback"
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL="/auth/callback"

# Database Configuration (Production Database)
DATABASE_URL="postgresql://username:password@production-host/database?sslmode=require"

# Environment
NODE_ENV=production
```

Backend (`.env`):
```bash
# Server Configuration
PORT="5000"
FRONTEND_URL="https://your-frontend-domain.com"

# Database
DATABASE_URL="postgresql://username:password@production-host/database?sslmode=require"

# Security
JWT_SECRET="your-secure-jwt-secret"
ENCRYPTION_KEY="your-encryption-key"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_PATH="/app/uploads"

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # Max requests per window

# Environment
NODE_ENV=production
```

### Production Build

```bash
# Build the application
npm run build

# Test production build locally
npm run start

# Build backend
cd server
npm run build  # If you have a build process
```

### Deployment Options

#### 1. Vercel (Recommended for Frontend)

**Deploy Frontend to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Vercel Configuration (`vercel.json`):**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_API_BASE": "@next_public_api_base",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "@next_public_clerk_publishable_key",
    "CLERK_SECRET_KEY": "@clerk_secret_key",
    "DATABASE_URL": "@database_url"
  },
  "functions": {
    "app/api/*/route.js": {
      "maxDuration": 30
    }
  }
}
```

#### 2. Railway (Recommended for Backend)

**Deploy Backend to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Railway Configuration (`railway.toml`):**
```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 3

[env]
PORT = "5000"
NODE_ENV = "production"
```

#### 3. Heroku Deployment

**Frontend on Heroku:**
```bash
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NEXT_PUBLIC_API_BASE=https://your-api.herokuapp.com
heroku config:set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
heroku config:set CLERK_SECRET_KEY=your_secret
heroku config:set DATABASE_URL=your_database_url

# Deploy
git push heroku main
```

**Backend on Heroku:**
```bash
# Create Heroku app for backend
heroku create your-api-name

# Add buildpack
heroku buildpacks:add heroku/nodejs

# Set environment variables
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.herokuapp.com

# Deploy
git subtree push --prefix server heroku main
```

#### 4. Docker Deployment

**Dockerfile (Frontend):**
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Dockerfile (Backend):**
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Set permissions
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE=http://backend:5000
      - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - backend

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - FRONTEND_URL=http://frontend:3000
      - NODE_ENV=production
    volumes:
      - ./server/uploads:/app/uploads
    depends_on:
      - database

  database:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=compressflow
      - POSTGRES_USER=compressflow
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### 5. AWS Deployment

**Frontend on AWS Amplify:**
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

**Backend on AWS EC2/ECS:**
```bash
# Create EC2 instance
# Install Docker and Docker Compose
# Deploy using Docker Compose

# Or use ECS with Fargate
aws ecs create-cluster --cluster-name compressflow-cluster
```

### Performance Optimization for Production

#### Frontend Optimizations

**Next.js Configuration (`next.config.js`):**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
```

#### Backend Optimizations

**Production Server Configuration:**
```javascript
// server/index.js (Production optimizations)
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cluster = require('cluster');
const os = require('os');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Cluster mode for production
if (cluster.isMaster && process.env.NODE_ENV === 'production') {
  const numCPUs = os.cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Worker process
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
```

### Monitoring and Logging

#### Production Monitoring Setup

**Logging Configuration:**
```javascript
// server/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'compressflow-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

**Health Check Endpoint:**
```javascript
// server/routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };
  
  try {
    // Check database connection
    await checkDatabaseConnection();
    
    // Check external services
    await checkExternalServices();
    
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Service Unavailable';
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});

module.exports = router;
```

## 🤝 Contributing

We welcome contributions from the community! CompressFlow is an open-source project that thrives on collaboration and community input.

### How to Contribute

#### 1. Getting Started
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/your-username/data-compresseion-decompression.git
cd data-compresseion-decompression

# Add upstream remote
git remote add upstream https://github.com/lazytech614/data-compresseion-decompression.git

# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

#### 2. Development Workflow
```bash
# Keep your fork updated
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# ... code, test, commit ...

# Push to your fork
git push origin feature/amazing-feature

# Create Pull Request on GitHub
```

#### 3. Contribution Guidelines

**Code Quality Standards:**
- Write clean, readable, and maintainable code
- Follow the existing code style and conventions
- Add comprehensive tests for new functionality
- Document your code with clear comments
- Use meaningful commit messages

**Pull Request Process:**
1. Ensure your code passes all tests (`npm run test:all`)
2. Update documentation if needed
3. Add tests for new features
4. Follow the pull request template
5. Respond to review feedback promptly

**Commit Message Convention:**
```bash
# Format: type(scope): description
# Types: feat, fix, docs, style, refactor, test, chore

feat(compression): add new DEFLATE algorithm implementation
fix(upload): resolve file size validation issue
docs(readme): update installation instructions
test(algorithms): add unit tests for LZW algorithm
```

### Areas for Contribution

#### 🔧 Algorithm Development
- **New Compression Algorithms**: Implement additional algorithms like Brotli, LZMA, or Zstandard
- **Algorithm Optimization**: Improve existing algorithm performance
- **Custom Algorithms**: Create specialized algorithms for specific file types

**Example Contribution:**
```javascript
// Contributing a new algorithm
class BrotliAlgorithm {
  constructor(options = {}) {
    this.quality = options.quality || 11;
    this.windowSize = options.windowSize || 22;
  }
  
  compress(data) {
    // Brotli compression implementation
    return {
      compressedData: compressed,
      metadata: {
        quality: this.quality,
        windowSize: this.windowSize
      }
    };
  }
  
  decompress(compressedData, metadata) {
    // Brotli decompression implementation
    return decompressedData;
  }
}
```

#### 📊 Analytics & Visualization
- **New Chart Types**: Add more visualization options
- **Performance Metrics**: Implement additional performance tracking
- **Data Export**: Add export functionality for analytics data
- **Real-time Analytics**: Implement live performance monitoring

#### 🎨 UI/UX Improvements
- **Modern Design**: Implement latest design trends
- **Accessibility**: Improve WCAG compliance
- **Mobile Optimization**: Enhance mobile responsiveness
- **User Experience**: Streamline user workflows

#### 🐛 Bug Fixes & Optimizations
- **Performance Improvements**: Optimize algorithms and UI
- **Memory Management**: Reduce memory usage for large files
- **Error Handling**: Improve error messages and recovery
- **Cross-browser Compatibility**: Fix browser-specific issues

#### 📚 Documentation
- **API Documentation**: Improve API documentation
- **Tutorial Content**: Create step-by-step guides
- **Algorithm Explanations**: Add educational content
- **Video Tutorials**: Create video guides

### Contribution Recognition

We believe in recognizing our contributors:

- **Contributors Page**: Your name and contributions will be featured
- **GitHub Recognition**: Contribution stats and badges
- **Special Mentions**: Outstanding contributions get special recognition
- **Early Access**: Get early access to new features

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

**Our Pledge:**
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Maintain a positive and professional tone

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 LazyTech614

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

### Technology Stack
- **Next.js**: For the amazing React framework with App Router
- **Express.js**: For the robust backend framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Clerk**: For seamless authentication
- **NeonDB**: For the serverless PostgreSQL database
- **Vercel**: For excellent deployment and hosting

### Algorithm Implementations
- **Classical Algorithms**: Based on foundational computer science research
- **Community Contributions**: Thanks to all the developers who contributed algorithms
- **Academic Research**: Inspired by compression theory research

### Design and UX
- **Modern Design Principles**: Following contemporary web design trends
- **Accessibility Guidelines**: Implementing WCAG 2.1 standards
- **User Feedback**: Incorporating user suggestions and feedback

### Open Source Community
- **Contributors**: Everyone who has contributed code, documentation, or feedback
- **Issue Reporters**: Users who help identify and report bugs
- **Feature Requesters**: Community members who suggest new features
- **Testers**: Beta testers who help ensure quality

### Special Thanks
- **LazyTech614**: For creating and maintaining this project
- **Early Contributors**: The first contributors who helped shape the project
- **Community Moderators**: Those who help maintain a positive community

## 📞 Support & Community

### Getting Help

**Community Support:**
- **GitHub Discussions**: [Join our community discussions](https://github.com/lazytech614/data-compresseion-decompression/discussions)
- **GitHub Issues**: [Report bugs or request features](https://github.com/lazytech614/data-compresseion-decompression/issues)
- **Discord Server**: [Join our Discord community](https://discord.gg/compressflow) (Coming Soon)

**Documentation:**
- **API Reference**: [Complete API documentation](https://docs.compressflow.dev)
- **User Guide**: [Step-by-step user guide](https://guide.compressflow.dev)
- **Developer Docs**: [Development documentation](https://dev.compressflow.dev)

**Professional Support:**
- **Consulting**: Available for enterprise implementations
- **Custom Development**: Specialized algorithm development
- **Training**: Team training and workshops

### FAQ

**Q: What file types are supported?**
A: CompressFlow supports all file types. However, compression effectiveness varies by file type and algorithm.

**Q: What's the maximum file size limit?**
A: The default limit is 10MB for the hosted version. Self-hosted instances can configure higher limits.

**Q: Can I use CompressFlow commercially?**
A: Yes! CompressFlow is licensed under MIT License, allowing commercial use.

**Q: How do I add a new compression algorithm?**
A: Follow our [Algorithm Development Guide](ALGORITHM_GUIDE.md) for step-by-step instructions.

**Q: Is my data secure?**
A: Yes, files are processed locally in your browser or on your server. No data is stored permanently.

**Q: Can I deploy CompressFlow on my own servers?**
A: Absolutely! Follow our deployment guide for various hosting options.

## 🎯 Roadmap

### Current Version: 1.0.0
- ✅ Basic compression/decompression functionality
- ✅ Multiple algorithm support (Huffman, LZ77, LZW)
- ✅ User authentication with Clerk
- ✅ Real-time statistics and analytics
- ✅ Responsive web interface
- ✅ File upload and download

### Version 1.1.0 (Q2 2024)
- [ ] **Enhanced Analytics Dashboard**
  - Advanced performance metrics
  - Historical data visualization
  - Export functionality
- [ ] **Batch Processing**
  - Multiple file upload
  - Bulk compression/decompression
  - Progress tracking
- [ ] **Algorithm Improvements**
  - DEFLATE algorithm implementation
  - Performance optimizations
  - Memory usage improvements

### Version 1.2.0 (Q3 2024)
- [ ] **Advanced Features**
  - Custom compression settings
  - Algorithm comparison tool
  - File type recommendations
- [ ] **User Experience**
  - Dark mode support
  - Keyboard shortcuts
  - Improved mobile interface
- [ ] **API Enhancements**
  - RESTful API v2
  - Webhook support
  - Rate limiting improvements

### Version 2.0.0 (Q4 2024)
- [ ] **Cloud Storage Integration**
  - Google Drive integration
  - Dropbox support
  - AWS S3 connectivity
- [ ] **Advanced Algorithms**
  - Brotli compression
  - LZMA implementation
  - Zstandard support
- [ ] **Collaboration Features**
  - Team workspaces
  - Shared compression jobs
  - Real-time collaboration

### Version 2.1.0 (Q1 2025)
- [ ] **Machine Learning Integration**
  - Intelligent algorithm selection
  - Compression prediction
  - Performance optimization
- [ ] **Enterprise Features**
  - SSO integration
  - Advanced security features
  - Audit logging
- [ ] **Mobile Applications**
  - iOS app
  - Android app
  - Cross-platform sync

### Version 2.2.0 (Q2 2025)
- [ ] **Advanced Analytics**
  - Machine learning insights
  - Predictive analytics
  - Custom reporting
- [ ] **Performance Improvements**
  - WebAssembly algorithms
  - Worker thread optimization
  - Edge computing support
- [ ] **Developer Tools**
  - CLI tool
  - Browser extension
  - VS Code extension

### Long-term Vision (2025+)
- **AI-Powered Compression**: Implement neural network-based compression
- **Quantum-Resistant Algorithms**: Prepare for post-quantum cryptography
- **Edge Computing**: Distributed compression processing
- **Serverless Architecture**: Fully serverless backend
- **Global CDN**: Worldwide content delivery network

---

<div align="center">

**Made with ❤️ by [LazyTech614](https://github.com/lazytech614)**

⭐ **If you found this project helpful, please consider giving it a star!** ⭐

[![GitHub Stars](https://img.shields.io/github/stars/lazytech614/data-compresseion-decompression?style=social)](https://github.com/lazytech614/data-compresseion-decompression)
[![GitHub Forks](https://img.shields.io/github/forks/lazytech614/data-compresseion-decompression?style=social)](https://github.com/lazytech614/data-compresseion-decompression)
[![GitHub Issues](https://img.shields.io/github/issues/lazytech614/data-compresseion-decompression?style=social)](https://github.com/lazytech614/data-compresseion-decompression/issues)

### 📧 Contact

- **Email**: [lazytech614@gmail.com](mailto:lazytech614@gmail.com)
- **GitHub**: [@lazytech614](https://github.com/lazytech614)
- **LinkedIn**: [LazyTech614](https://linkedin.com/in/lazytech614)
- **Twitter**: [@LazyTech614](https://twitter.com/LazyTech614)

### 🌟 Show Your Support

If CompressFlow has been helpful to you, consider:
- Giving it a star on GitHub ⭐
- Sharing it with your friends and colleagues 🤝
- Contributing to the project 🛠️
- Reporting bugs and suggesting features 🐛
- Writing about your experience 📝

**Together, we can make file compression more accessible and efficient for everyone!**

</div>