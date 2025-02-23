// pages/api/pdf.js
import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  const { htmlContent, options } = req.body;

  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    const pdf = await page.pdf({
      format: options?.format || "A4",
      margin: options?.margin || undefined,
      printBackground: options?.printBackground || true,
    });

    await browser.close();
    
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}