"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ADDITIONAL_PROMPT } from "@/constants/prompt";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_URL);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [resultText, setResultText] = useState("");
  const [responseContent, setResponseContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setError(null);
  };

  function extractHTMLContent(rawText) {
    return rawText.replace("```html", "").replace("```", "");
  }

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setUploadStatus("Uploading...");
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async () => {
      const base64Data = reader.result.split(",")[1];
      
      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf",
            },
          },
          ADDITIONAL_PROMPT,
        ]);
        const resp = result.response.candidates[0].content.parts[0].text;
        setResponseContent(extractHTMLContent(resp));
        setUploadStatus("Upload successful!");
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Failed to upload file. Please try again.");
        setUploadStatus("");
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setError("Error reading file. Please try again.");
      setLoading(false);
    };
  };

  return (
    <div className="w-full h-screen grid grid-cols-[30%_70%] bg-gray-100">
      <div className="h-screen bg-white shadow-lg flex flex-col items-center justify-center p-6 border-r border-gray-200">
        <label
          htmlFor="file-upload"
          className="w-full h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
        >
          <UploadCloud className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500 mt-2">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-400">PDF files only</p>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <>
            <p className="mt-4 text-sm text-gray-600">Uploaded: {file.name}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload and Extract PDF"}
            </button>
            {uploadStatus && (
              <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </>
        )}
      </div>

      <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
        {loading ? (
          <p className="text-gray-600">Processing file...</p>
        ) : resultText ? (
          <textarea className="w-full h-full p-4" value={resultText} readOnly />
        ) : (
          <iframe className="w-full h-full border-none" srcDoc={responseContent ? responseContent : ""}></iframe>
        )}
      </div>
    </div>
  );
}