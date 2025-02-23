"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownPreviewer() {
    const [prompt, setPrompt] = useState("");
    const [markdownContent, setMarkdownContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        setMarkdownContent(""); // Clear previous content
        setIsGenerating(true);

        const eventSource = new EventSource(
            `/api/generate?text=${encodeURIComponent(prompt)}`
        );

        eventSource.onmessage = (event) => {
            if (event.data === "[DONE]") {
                eventSource.close();
                setIsGenerating(false);
            } else {
                try {
                    const parsedData = JSON.parse(event.data);
                    setMarkdownContent((prev) => prev + parsedData.text); // Append chunks correctly
                } catch (e) {
                    console.error("Error parsing event data:", e);
                }
            }
        };

        eventSource.onerror = (error) => {
            console.error("Error in streaming:", error);
            eventSource.close();
            setIsGenerating(false);
        };
    };

    const components = {
      h1: ({ node, ...props }) => (
        <h1 className="text-4xl font-bold text-gray-900 my-3" {...props} />
      ),
      h2: ({ node, ...props }) => (
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-1 mb-3" {...props} />
      ),
      h3: ({ node, ...props }) => (
        <h3 className="text-xl font-medium text-gray-800 my-2" {...props} />
      ),
      h4: ({ node, ...props }) => (
        <h4 className="text-lg font-medium text-gray-700 my-2" {...props} />
      ),
      h5: ({ node, ...props }) => (
        <h5 className="text-base font-medium text-gray-700 my-1" {...props} />
      ),
      h6: ({ node, ...props }) => (
        <h6 className="text-sm font-medium text-gray-600 my-1" {...props} />
      ),
      p: ({ node, ...props }) => (
        <p className="text-base text-gray-800 leading-relaxed mb-3" {...props} />
      ),
      a: ({ node, ...props }) => (
        <a className="text-blue-600 hover:underline" {...props} />
      ),
      img: ({ node, ...props }) => (
        <img className="my-4 rounded shadow-md" {...props} alt={props.alt || "Image"} />
      ),
      ul: ({ node, ordered, ...props }) => (
        <ul className="list-disc ml-6 mb-3" {...props} />
      ),
      ol: ({ node, ordered, ...props }) => (
        <ol className="list-decimal ml-6 mb-3" {...props} />
      ),
      li: ({ node, ...props }) => (
        <li className="mb-1" {...props} />
      ),
      blockquote: ({ node, ...props }) => (
        <blockquote
          className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4"
          {...props}
        />
      ),
      code: ({ node, inline, className, children, ...props }) => {
        return inline ? (
          <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded font-mono text-sm" {...props}>
            {children}
          </code>
        ) : (
          <pre className="bg-gray-800 text-white p-4 rounded mb-4 overflow-x-auto" {...props}>
            <code className="font-mono">{children}</code>
          </pre>
        );
      },
      hr: ({ node, ...props }) => (
        <hr className="my-6 border-t border-gray-300" {...props} />
      ),
      table: ({ node, ...props }) => (
        <table className="w-full my-4 border-collapse" {...props} />
      ),
      thead: ({ node, ...props }) => (
        <thead className="bg-gray-200" {...props} />
      ),
      tbody: ({ node, ...props }) => (
        <tbody className="bg-white" {...props} />
      ),
      tr: ({ node, ...props }) => <tr {...props} />,
      th: ({ node, ...props }) => (
        <th
          className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300"
          {...props}
        />
      ),
      td: ({ node, ...props }) => (
        <td
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300"
          {...props}
        />
      ),
      strong: ({ node, ...props }) => (
        <strong className="font-bold" {...props} />
      ),
      em: ({ node, ...props }) => (
        <em className="italic" {...props} />
      ),
      del: ({ node, ...props }) => (
        <del className="line-through text-gray-500" {...props} />
      ),
      // Add further custom components as needed
    };
    
    return (
        <div className="w-full h-screen grid grid-cols-2 bg-gray-50">
            <div className="p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-6">Prompt</h2>
                <textarea
                    className="w-full h-full border rounded p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your prompt here..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                    className={`mt-4 px-6 py-3 ${
                        isGenerating ? "bg-gray-400" : "bg-green-600"
                    } text-white rounded hover:bg-green-700`}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    {isGenerating ? "Generating..." : "Generate Markdown"}
                </button>
            </div>

            <div className="p-4 flex flex-col">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={components}
                >
                    {markdownContent}
                </ReactMarkdown>
            </div>
        </div>
    );
}
