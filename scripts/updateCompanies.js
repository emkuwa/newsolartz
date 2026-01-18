const fs = require("fs");

const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_API_KEY;

// Example query (utabadilisha kulingana na unavyotaka)
const SEARCH_QUERY = "solar companies in Tanzania";

async function fetchFromScrapingBee() {
  const url = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_KEY}&url=https://www.google.com/search?q=${encodeURIComponent(
    SEARCH_QUERY
  )}&render_js=false`;

  const response = await fetch(url);
  const html = await response.text();
  return html;
}

// Dummy transformer (baadaye tutaunganisha na Google AI Studio API)
function transformToCompanies(html) {
  // Kwa sasa tunarudisha mfano tu ili workflow isikufe
  return [
    {
      id: "auto001",
      business_name: "Auto Generated Solar Company",
      category: "Solar Company",
      region: "Tanzania",
      district: "",
      headline_en: "Solar solutions from automation",
      headline_sw: "Suluhisho za jua kutoka mfumo wa kiotomatiki",
      description_en: "This company was generated automatically.",
      description_sw: "Kampuni hii ilitengenezwa na mfumo wa kiotomatiki.",
      services: ["Installation", "Maintenance"],
      products: ["Solar Panels", "Inverters"],
      cta_whatsapp_en: "Chat on WhatsApp",
      cta_whatsapp_sw: "Ongea WhatsApp",
      cta_call_en: "Call Now",
      cta_call_sw: "Piga Simu",
      slug: "auto-generated-solar-company"
    }
  ];
}

async function main() {
  console.log("🔎 Fetching data from ScrapingBee...");
  const rawHtml = await fetchFromScrapingBee();

  console.log("🤖 Transforming data...");
  const companies = transformToCompanies(rawHtml);

  console.log("💾 Saving companies.json...");
  fs.writeFileSync(
    "data/companies.json",
    JSON.stringify(companies, null, 2),
    "utf-8"
  );

  console.log("✅ Update complete!");
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
