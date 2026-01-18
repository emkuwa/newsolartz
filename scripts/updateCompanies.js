import fetch from "node-fetch";
import fs from "fs";

const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_API_KEY;

// Google AI prompt (ile tuliyokubaliana)
const PROMPT = `
You are a data extraction and transformation assistant.

I will give you raw JSON data coming from ScrapingBee Google search results for solar companies in Tanzania.

Your job is to extract real solar companies and convert each company into the following exact JSON structure:

{
  "id": "unique short id",
  "business_name": "",
  "category": "Solar Company",
  "region": "Tanzania",
  "district": "",
  "headline_en": "",
  "headline_sw": "",
  "description_en": "",
  "description_sw": "",
  "services": [],
  "products": [],
  "cta_whatsapp_en": "",
  "cta_whatsapp_sw": "",
  "cta_call_en": "",
  "cta_call_sw": "",
  "slug": ""
}

Rules:
- Only include real solar companies based in Tanzania
- Generate professional headlines and descriptions
- Services and products must be realistic solar services
- Slug must be lowercase, dash-separated from business name
- Return ONLY a JSON array
- No explanations, no markdown, no extra text
`;

async function scrapeSolarCompanies() {
  const query = "solar companies in Tanzania";
  const url = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_KEY}&search=${encodeURIComponent(query)}&render_js=false`;

  const res = await fetch(url);
  const rawData = await res.json();
  return rawData;
}

async function sendToGoogleAI(rawData) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      GOOGLE_AI_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              { text: JSON.stringify(rawData) }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  return JSON.parse(text);
}

async function main() {
  try {
    console.log("🔍 Scraping solar companies...");
    const rawData = await scrapeSolarCompanies();

    console.log("🤖 Sending data to Google AI...");
    const companies = await sendToGoogleAI(rawData);

    console.log("💾 Saving companies.json...");
    fs.writeFileSync("data/companies.json", JSON.stringify(companies, null, 2));

    console.log("✅ companies.json updated successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
