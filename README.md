# Summarrizr

**Summarrizr** is an AI-powered fullstack web application that generates concise 100-word summaries for YouTube videos, PDFs, PowerPoint presentations, Word documents, Excel spreadsheets, and plain text. Designed for students, professionals, and anyone needing quick, accurate content summarization, Summarrizr leverages OpenAI GPT and modern web technologies to deliver fast, reliable results in a beautiful, responsive interface.

---

## Features

- **AI Summarization:** Generate 100-word summaries using OpenAI GPT for:
  - YouTube videos (by URL)
  - PDF, DOCX, PPTX, XLSX, and TXT files
  - Pasted or uploaded plain text
- **Multi-format Support:** Upload or paste content in various formats for instant summarization.
- **Copy to Clipboard:** Easily copy generated summaries with a single click.
- **Responsive UI:** Seamless experience on desktop, tablet, and mobile devices.
- **Modern Design:** Clean, intuitive interface built with Tailwind CSS and React.
- **Cloud Deployed:** Live and accessible from anywhere.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Multer
- **AI/LLM:** OpenAI GPT (via API), LangChain
- **Deployment:** Render (cloud hosting)
- **Other:** REST API, File Uploads, CORS, Environment Variables

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YaSh88991/summarrizr.git
cd summarrizr
```

### 2. Install dependencies

```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

**Note:** If you encounter errors during installation, try:

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

- **Backend:**  
  Create a `.env` file in the `server` folder with your OpenAI API key and any other required variables.
  ```
  OPENAI_API_KEY=your_openai_key_here
  ```

- **Frontend:**  
  Create a `.env` file in the `client` folder:
  ```
  VITE_API_URL=http://localhost:5000
  ```

### 4. Run the application locally

```bash
# Start backend
cd server
npm run dev

# Start frontend (in a new terminal)
cd ../client
npm run dev
```

---

## 🌐 Live Demo

Try Summarrizr live: [https://summarrizr-ai.onrender.com](https://summarrizr-ai.onrender.com)

---

## 📝 Upcoming Features

- Multi-language support
- User authentication and summary history
- Batch file summarization
- Custom summary length
- Summarize web articles and images
- Export summaries to PDF/Word
- Dark mode

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

---

## 📄 License

This project is licensed under the MIT License.

---

**Enjoy using Summarrizr!**  
For questions or feedback, [open an issue](https://github.com/YaSh88991/summarrizr/issues) or [contact the developer](mailto:vermayash88991@gmail.com).