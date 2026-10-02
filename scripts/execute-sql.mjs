import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sql = fs.readFileSync("src/lib/supabase/schema.sql", "utf-8");

async function runSql() {
  console.log("Attempting SQL execution via Supabase endpoint...");
  
  // Try Supabase pgsql / query endpoint
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
    },
  });
  console.log("RPC check status:", res.status);
}

runSql();
