# Summarrizr – Client

This is the **frontend** for [Summarrizr](https://summarrizr-ai.onrender.com), an AI-powered web app that generates concise 100-word summaries for videos, documents, and text using OpenAI GPT.

---

## 🚀 Features

- Upload or paste content (PDF, DOCX, PPTX, XLSX, TXT, YouTube URL, or plain text)
- Responsive, modern UI built with React and Tailwind CSS
- Copy summaries to clipboard with one click
- Seamless integration with the backend API

---

## 🛠️ Tech Stack

- **React** (with Vite)
- **Tailwind CSS** for styling
- **Jest** and **Testing Library** for unit tests
- **Lucide-react** for icons

---

## ⚙️ Environment Variables

Create a `.env` file in this folder with:

```
VITE_API_URL=http://localhost:5000
```

Set `VITE_API_URL` to your backend API URL in production.

---

## 📦 Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm run preview` – Preview the production build
- `npm run lint` – Lint the codebase
- `npm run test` – Run unit tests

---

## 🧪 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## 📝 Testing

Run all tests with:
```bash
npm run test
```

---

## 📄 License

This project is licensed under the MIT License.

---

For questions or feedback, [open an issue](https://github.com/YaSh88991/summarrizr/issues)