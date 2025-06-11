# Data Compression & Decompression Portal

A web application built with Next.js (App Router) and Node.js/Express for processing file compression and decompression using various algorithms (e.g., Huffman coding, LZW, etc.). Users can upload a file, select an algorithm, and download the processed output.

---

## 🚀 Features

* **Compress & Decompress** files in-browser
* Multiple algorithm support (Huffman, LZW, ...)
* Real-time display of compression statistics (size before/after, ratio, time taken)
* Huffman-specific metadata input for decompression
* Download processed file directly from UI
* Built with Next.js 13 (App Router), React, and Tailwind CSS

---

## 📋 Prerequisites

* Node.js v16+ and npm or yarn
* Git
* A modern browser (Chrome, Firefox, Edge)

---

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/lazytech614/data-compression-decompression.git
   cd data-compression-decompression
   ```

2. **Install dependencies**

   ```bash
   # with npm
   npm install
   # or with yarn
   yarn install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root and add any required variables:

   ```bash
   # Example (if using an external API)
   API_BASE_URL=http://localhost:5000/api
   ```

4. **Run the development servers**

   * **Frontend (Next.js)**

     ```bash
     npm run dev
     ```

   * **Backend (Express API)**

     ```bash
     cd server
     npm install
     npm run dev
     ```

5. **Open in browser**

   Frontend: [http://localhost:3000](http://localhost:3000)

   Backend: [http://localhost:5000/api](http://localhost:5000/api)

---

## 📂 Project Structure

```text
├── app/                         # Next.js App Router pages
│   ├── page.tsx                 # Home page (Compression/Decompression form)
│   └── result/                  # Result route
│       └── page.tsx             # Result display page
├── components/
│   ├── global/
│   │   ├── file-uploader.tsx    # File upload input
│   │   ├── algorithm-selector.tsx
│   │   ├── stats-display.tsx
│   │   └── download-button.tsx
├── server/                      # Express backend
│   ├── routes/
│   │   ├── compress.js
│   │   └── decompress.js
│   ├── controllers/
│   └── index.js                 # Express entrypoint
├── utils/
│   └── api.ts                   # Frontend API wrappers (postCompression, etc.)
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── next.config.js
├── package.json
└── README.md
```

---

## 🔧 API Endpoints (Backend)

| Route             | Method | Description                          |
| ----------------- | ------ | ------------------------------------ |
| `/api/compress`   | POST   | Compresses an uploaded file          |
| `/api/decompress` | POST   | Decompresses an uploaded file        |
| `/api/algorithms` | GET    | Returns list of supported algorithms |

### Example: `/api/compress`

* **Request**: multipart/form-data with keys: `file`, `algorithm`
* **Response**:

  ```json
  {
    "fileName": "input.txt",
    "compressedBase64": "<base64 string>",
    "stats": { "originalSize": 1024, "compressedSize": 512, "ratio": 0.5 },
    "metadata": { /* optional, e.g., Huffman table */ }
  }
  ```

---

## ⚙️ Scripts

* `npm run dev` — Start Next.js dev server
* `npm run build` — Build Next.js app for production
* `npm run start` — Start Next.js production server
* `cd server && npm run dev` — Start Express backend in dev mode

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-new-algo`
3. Commit your changes: \`git commit -m "Add new compression algorithm"\`\`
4. Push to the branch: `git push origin feature/my-new-algo`
5. Open a Pull Request

Please adhere to the existing code style and include tests for new functionality.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
