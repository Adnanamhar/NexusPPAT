import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Connecting to Supabase at:", supabaseUrl);

  // 1. Create Storage Buckets
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error("Error listing buckets:", bucketError);
  } else {
    console.log("Existing buckets:", buckets.map((b) => b.name));
    const legalBucket = buckets.find((b) => b.name === "legal-documents");
    if (!legalBucket) {
      console.log("Creating bucket 'legal-documents'...");
      const { error: createBucketErr } = await supabase.storage.createBucket("legal-documents", {
        public: true,
      });
      if (createBucketErr) {
        console.error("Failed to create bucket:", createBucketErr);
      } else {
        console.log("Bucket 'legal-documents' created successfully!");
      }
    } else {
      console.log("Bucket 'legal-documents' already exists.");
    }
  }

  // 2. Test reading profiles table
  const { data: profiles, error: profileErr } = await supabase.from("profiles").select("*").limit(1);
  if (profileErr) {
    console.log("Note: profiles table status:", profileErr.message);
  } else {
    console.log("Profiles table is ready! Row count sample:", profiles?.length);
  }
}

main();
