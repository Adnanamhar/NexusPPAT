import postgres from "postgres";
import fs from "fs";

const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sqlFile = fs.readFileSync("src/lib/supabase/schema.sql", "utf-8");

// Try standard supabase pooler / direct connection formats
const hosts = [
  `postgresql://postgres.ruiqdhqkeyptqitcfqfw:${secret}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres.ruiqdhqkeyptqitcfqfw:${secret}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.ruiqdhqkeyptqitcfqfw:${secret}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  `postgresql://postgres:${secret}@db.ruiqdhqkeyptqitcfqfw.supabase.co:5432/postgres`,
  `postgresql://postgres:${secret}@db.ruiqdhqkeyptqitcfqfw.supabase.co:6543/postgres`,
];

async function tryConnect() {
  for (const uri of hosts) {
    try {
      console.log("Trying connection:", uri.replace(secret, "***"));
      const sql = postgres(uri, { timeout: 5, connect_timeout: 5 });
      const res = await sql`SELECT 1 as connected`;
      console.log("SUCCESS! Connected:", res);
      
      console.log("Executing schema SQL...");
      await sql.file("src/lib/supabase/schema.sql");
      console.log("Database schema successfully migrated!");
      await sql.end();
      return true;
    } catch (e) {
      console.log("Connection failed:", e.message);
    }
  }
  return false;
}

tryConnect();
