const ADDITIONAL_PROMPT = `I need an AI-generated resume based on the information from my existing resume, but do not follow its original structure. Instead, analyze my experience, skills, and personality traits to create a resume that highlights the most important sections based on best industry practices.
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
`;


export {
    ADDITIONAL_PROMPT
}