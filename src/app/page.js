"use client";

import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ADDITIONAL_PROMPT } from "@/constants/prompt";
import html2pdf from "html2pdf.js";

const genAI = new GoogleGenerativeAI('AIzaSyCQLyuYI0gTkV8w-b4_wv-qdwbLweOAwsI');
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-pro-exp-02-05' });

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [responseContent, setResponseContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");

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
          'extract the contents of this resume and create a detailed document about this person',
        ]);
        const resp = result.response.candidates[0].content.parts[0].text;

        const resultHtml = await model.generateContent(ADDITIONAL_PROMPT + "here is my resume data" + resp + customPrompt)

        const htmlText = resultHtml.response.candidates[0].content.parts[0].text;
        setResponseContent(extractHTMLContent(htmlText));
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

  const handleDownloadPDF = () => {
    if (!responseContent) return;
  
    // Find the iframe element
    const iframe = document.querySelector("iframe");
    if (!iframe) return;
  
    // Clone the iframe document into a new element
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const element = document.createElement("div");
    element.innerHTML = iframeDocument.documentElement.outerHTML; // Preserve full HTML including styles
  
    // Use html2pdf to convert the full iframe content
    html2pdf()
      .set({
        margin: 10,
        filename: "download.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 }, // Improve rendering quality
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };
  

  return (
    <div className="w-full h-screen grid grid-cols-[30%_70%] bg-gray-50">
      <div className="h-screen bg-white shadow-lg flex flex-col items-center justify-center p-6 border-r border-gray-300 rounded-lg">
        <label
          htmlFor="file-upload"
          className="w-full h-56 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition-all"
        >
          <UploadCloud className="w-12 h-12 text-gray-500" />
          <p className="text-gray-600 mt-2">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-500">PDF files only</p>
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
            <p className="mt-4 text-sm text-gray-700">Uploaded: {file.name}</p>
            <textarea
              className="mt-4 p-2 w-full border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter custom prompt (optional)"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            ></textarea>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Upload and Extract PDF"}
            </button>
            {uploadStatus && (
              <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </>
        )}
      </div>

      <div className="h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        {loading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
            <p className="text-gray-600 mt-2">Processing file...</p>
          </div>
        ) : responseContent ? (
          <>
            <iframe className="w-full h-full border-none rounded-lg shadow-md" srcDoc={responseContent}></iframe>
            <button
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={handleDownloadPDF}
            >
              Download as PDF
            </button>
          </>
        ) : (
          <p className="text-gray-500">No file uploaded</p>
        )}
      </div>
    </div>
  );
}
