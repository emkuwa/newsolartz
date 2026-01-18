const fs = require("fs");

const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_API_KEY;

// Example query (utabadilisha kulingana na unavyotaka)
const SEARCH_QUERIES = [
  "solar company Tanzania",
  "solar installer Tanzania",
  "solar technician Tanzania",
  "solar fundi Tanzania",
  "solar panels shop Tanzania",
  "solar inverter shop Tanzania",
  "solar battery supplier Tanzania",
  "renewable energy shop Tanzania",

  "solar company Zanzibar",
  "solar installer Zanzibar",
  "solar fundi Zanzibar",
  "solar shop Zanzibar",

  "solar installer Dar es Salaam",
  "solar fundi Dar es Salaam",
  "solar panels shop Dar es Salaam",

  "solar installer Arusha",
  "solar fundi Arusha",
  "solar shop Arusha",

  "solar installer Mwanza",
  "solar fundi Mwanza",
  "solar shop Mwanza",

  "solar installer Mbeya",
  "solar fundi Mbeya",
  "solar shop Mbeya",

  "solar installer Dodoma",
  "solar fundi Dodoma",

  "solar installer Tanga",
  "solar installer Morogoro",
  "solar installer Iringa",
  "solar installer Moshi",
  "solar installer Songea"
];

async function fetchFromScrapingBee(query) {
  const url = `https://app.scrapingbee.com/api/v1/?api_key=${SCRAPINGBEE_KEY}&search=${encodeURIComponent(query)}&nb_results=10`;

  const response = await fetch(url);
  const data = await response.json();
  return data;
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
