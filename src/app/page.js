"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_URL);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [resultText, setResultText] = useState("");

  const [responseContent, setResponseContent] = useState(null)

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
  };

  function extractHTMLContent(rawText) {
    // Remove the markdown-like markers at the beginning and end
    return rawText.replace("```html", "").replace("```", "");
}
  const handleUpload = () => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file); // This will read the file and return a base64-encoded string
    
    reader.onload = async () => {
      // The result is in the format "data:[<mime type>];base64,<data>"
      // We split by comma to get only the base64 part
      const base64Data = reader.result.split(",")[1];
      
      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: "application/pdf",
            },
          },
          `
          I need an AI-generated resume based on the information from my existing resume, but do not follow its original structure. Instead, analyze my experience, skills, and personality traits to create a resume that highlights the most important sections based on best industry practices.

          Key Instructions:
          Do not replicate the structure of my original resume. Instead, organize the information in a way that best presents my strengths.
          Analyze my professional background to determine the most relevant and impactful sections. Prioritize clarity, conciseness, and effectiveness.
          Ensure a professional tone and format that aligns with industry standards.
          Optimize for ATS (Applicant Tracking System) by using clear headings, keywords, and a structured layout.
          Highlight key achievements rather than just listing responsibilities. Use quantifiable data wherever possible.
          Keep it concise (ideally one page, unless necessary to extend).
          Output Format:
          Return the resume as fully functional HTML and CSS code.
          Ensure a clean, modern, and responsive design that looks great on both desktop and mobile screens.
          Use semantic HTML and follow best practices for accessibility and readability.
          Include proper spacing, fonts, and a visually appealing layout that makes the resume easy to scan.
          Use minimal external dependencies—pure HTML and CSS preferred (avoid JavaScript unless necessary).
          Generate only the HTML and CSS code for a well-structured and ATS-friendly resume. Do not include explanations, markdown formatting, or any additional text—just return plain HTML and CSS.
          `,
        ]);
        const resp = result.response.candidates[0].content.parts[0].text
        setResponseContent(extractHTMLContent(resp))
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
  
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  console.log(file, 'FILLL')

  return (
    <div className="w-full h-screen grid grid-cols-[30%_70%] bg-gray-100">
      {/* Left Panel - File Upload */}
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
            >
              Upload and Extract PDF
            </button>
            {uploadStatus && (
              <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>
            )}
          </>
        )}
      </div>

      {/* Right Panel - Display Result or Iframe Viewer */}
      <div className="h-screen bg-gray-50 flex flex-col justify-center items-center">
        {resultText ? (
          <textarea className="w-full h-full p-4" value={resultText} readOnly />
        ) : (
          <iframe className="w-full h-full border-none" srcDoc={responseContent ? responseContent : ""}></iframe>
        )}
      </div>
    </div>
  );
}
