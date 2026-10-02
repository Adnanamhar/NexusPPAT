import fs from "fs";

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const projectRef = "ruiqdhqkeyptqitcfqfw";
const sql = fs.readFileSync("src/lib/supabase/schema.sql", "utf-8");

async function run() {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await res.text();
  console.log("Management query status:", res.status, text);
}

run();
