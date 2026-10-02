const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const adminAuthClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  const email = "test-fail-check-" + Date.now() + "@example.com";
  const res = await adminAuthClient.auth.admin.createUser({
    email,
    password: "password123",
    email_confirm: true,
  });
  console.log(JSON.stringify(res, null, 2));
}

run().catch(console.error);
