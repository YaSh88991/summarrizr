# Summarrizr – Server

This is the **backend** for [Summarrizr](https://summarrizr-ai.onrender.com), an AI-powered summarization platform. The server exposes RESTful APIs for summarizing YouTube videos, PDFs, DOCX, PPTX, Excel, and plain text using OpenAI GPT.

---

## 🚀 Features

- REST API endpoints for summarizing:
  - YouTube videos (transcript extraction + summary)
  - PDF, DOCX, PPTX, XLSX, and TXT files (file upload)
  - Plain text (direct input)
- Handles large files by chunking and combining summaries
- Secure file upload and cleanup
- CORS enabled for frontend integration
- Environment variable support for API keys and config

---

## 🛠️ Tech Stack

- **Node.js** & **Express**
- **OpenAI API** (via [openai](https://www.npmjs.com/package/openai))
- **LangChain** for YouTube transcript loading
- **Multer** for file uploads
- **officeparser** for document parsing
- **dotenv** for environment variables

---

## ⚙️ Environment Variables

Create a `.env` file in this folder with:

```
OPENAI_API_KEY=your_openai_key_here
PORT=5000
```

---

## 📦 Scripts

- `npm start` – Start the server (`index.js`)

---

## 🧪 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. The API will be available at [http://localhost:5000](http://localhost:5000)

4. **Test the API is running:**  
   Open your browser or use a tool like Postman to visit:  
   [http://localhost:5000/test/ping](http://localhost:5000/test/ping)  
   You should see a JSON response:  
   ```json
   { "message": "pong" }
   ```

---

## 📑 API Endpoints

- `POST /api/summarize/video` – Summarize a YouTube video (JSON: `{ url }`)
- `POST /api/summarize/text` – Summarize plain text (JSON: `{ text }`)
- `POST /api/summarize/pdf` – Summarize a PDF file (multipart/form-data)
- `POST /api/summarize/docs` – Summarize a DOCX file (multipart/form-data)
- `POST /api/summarize/pptx` – Summarize a PPTX file (multipart/form-data)
- `POST /api/summarize/excel` – Summarize an Excel file (multipart/form-data)

---

## 📄 License

This project is licensed under the MIT License.


---


For questions or feedback, [open an issue](https://github.com/YaSh88991/summarrizr/issues) or [contact the developer](mailto:vermayash88991@gmail.com).