const fs = require("fs");
const fetch = require("node-fetch");

const SCRAPINGBEE_KEY = process.env.SCRAPINGBEE_API_KEY;

if (!SCRAPINGBEE_KEY) {
  console.error("❌ SCRAPINGBEE_API_KEY haijawekwa kwenye GitHub Secrets");
  process.exit(1);
}

const SEARCH_QUERIES = [
  "solar company Tanzania",
  "solar installer Tanzania",
  "solar fundi Tanzania",
  "solar panels shop Tanzania",
  "solar inverter shop Tanzania",
  "solar battery supplier Tanzania",

  "solar company Zanzibar",
  "solar installer Zanzibar",
  "solar shop Zanzibar",

  "solar installer Dar es Salaam",
  "solar installer Arusha",
  "solar installer Mwanza",
  "solar installer Mbeya",
  "solar installer Dodoma"
];

// Piga ScrapingBee Google API
async function fetchFromScrapingBee(query) {
  const url = `https://app.scrapingbee.com/api/v1/google?api_key=${SCRAPINGBEE_KEY}&q=${encodeURIComponent(
    query
  )}&gl=tz&hl=en&num=10`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ScrapingBee error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Badilisha Google result → Company Object
function transformToCompany(item) {
  const name = item.title
    .replace(/–.*$/, "")
    .replace(/\|.*$/, "")
    .trim();

  return {
    id: item.domain.replace(/\W/g, ""),
    business_name: name,
    category: "Solar Company",
    region: "Tanzania",
    district: "",
    headline_en: "Solar system design, installation and maintenance",
    headline_sw: "Ubunifu, usimikaji na matengenezo ya mifumo ya nishati ya jua",
    description_en: item.description || "",
    description_sw: "",
    services: ["Installation", "Maintenance", "Consultation"],
    products: ["Solar Panels", "Inverters", "Batteries"],
    website: item.url,
    domain: item.domain,
    cta_whatsapp_en: "Chat on WhatsApp",
    cta_whatsapp_sw: "Ongea WhatsApp",
    cta_call_en: "Call Now",
    cta_call_sw: "Piga Simu",
    slug: name.toLowerCase().replace(/\s+/g, "-")
  };
}

async function main() {
  console.log("🚀 Starting Solar Companies Auto Update…");

  let allCompanies = [];
  const seenDomains = new Set();

  for (const query of SEARCH_QUERIES) {
    console.log(`🔍 Searching: ${query}`);

    const data = await fetchFromScrapingBee(query);

    if (!data.organic_results) continue;

    for (const item of data.organic_results) {
      if (!item.domain) continue;

      // Epuka duplicate
      if (seenDomains.has(item.domain)) continue;
      seenDomains.add(item.domain);

      const company = transformToCompany(item);
      allCompanies.push(company);
    }
  }

  if (allCompanies.length === 0) {
    console.log("⚠️ Hakuna kampuni iliyopatikana.");
    return;
  }

  console.log(`💾 Saving ${allCompanies.length} companies to companies.json`);

  fs.writeFileSync(
    "data/companies.json",
    JSON.stringify(allCompanies, null, 2),
    "utf-8"
  );

  console.log("✅ Update complete. Real companies saved!");
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
