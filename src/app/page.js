"use client";

import { useState } from "react";
import axios from "axios";
import { UploadCloud, Loader2 } from "lucide-react";
import { ADDITIONAL_PROMPT } from "@/constants/prompt";

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
      const base64Data = reader.result; // Contains the full data URL
      try {
        // First API call: Send fileData and prompt to extract resume contents
        const payload = {
          fileData: base64Data, // API will extract the base64 part if needed
          text: "extract the contents of this resume and create a detailed document about this person",
          // Optionally, you can also send custom model and mimeType here:
          // model: 'models/gemini-2.0-flash',
          // mimeType: 'application/pdf'
        };

        const { data } = await axios.post("/api/generate", payload);
        const extractedResume = data.result;

        // Optionally, if you have additional prompt to combine with the extracted data,
        // make a second API call using only text (no fileData)
        if (ADDITIONAL_PROMPT || customPrompt) {
          const additionalPayload = {
            text:
              ADDITIONAL_PROMPT +
              " here is my resume data: " +
              extractedResume +
              " " +
              customPrompt,
          };
          const { data: additionalData } = await axios.post(
            "/api/generate",
            additionalPayload
          );
          const htmlText = additionalData.result;
          setResponseContent(extractHTMLContent(htmlText));
        } else {
          setResponseContent(extractedResume);
        }
        setUploadStatus("Upload successful!");
      } catch (err) {
        console.error("Error uploading file:", err);
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
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Upload and Extract PDF"
              )}
            </button>
            {uploadStatus && (
              <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>
            )}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
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
          <iframe
            className="w-full h-full border-none rounded-lg shadow-md"
            srcDoc={responseContent}
          ></iframe>
        ) : (
          <p className="text-gray-500">No file uploaded</p>
        )}
      </div>
    </div>
  );
}
