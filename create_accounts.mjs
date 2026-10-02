import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ruiqdhqkeyptqitcfqfw.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAccounts() {
  const accounts = [
    {
      email: 'notaris.hendrawan@notarispro.id',
      password: 'password123',
      role: 'notaris',
      fullName: 'Dr. Hendrawan, S.H., M.Kn.',
      phone: '081234567890',
      officeName: 'Kantor Notaris Hendrawan',
      skNumber: 'AHU-0019283.AH.02.01'
    },
    {
      email: 'admin@notarispro.id',
      password: 'password123',
      role: 'admin',
      fullName: 'Amanda Rahmawati',
      phone: '081298765432',
      officeName: 'Kantor Notaris Hendrawan'
    },
    {
      email: 'budi.santoso@gmail.com',
      password: 'password123',
      role: 'klien',
      fullName: 'Budi Santoso',
      phone: '081377889900',
      officeName: 'Jakarta Selatan'
    }
  ];

  for (const acc of accounts) {
    console.log(`Creating user: ${acc.email}...`);
    // 1. Create auth user with admin API to bypass email confirmation
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: {
        full_name: acc.fullName,
        role: acc.role
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`User ${acc.email} already exists.`);
        
        // Still try to update profile if it exists
        const { data: existingUsers } = await supabase.from('profiles').select('id').eq('email', acc.email);
        if (existingUsers && existingUsers.length > 0) {
           await supabase.from('profiles').update({
            full_name: acc.fullName,
            role: acc.role,
            role_title: acc.role === 'notaris' ? 'Notaris & PPAT Utama' : acc.role === 'admin' ? 'Admin Kantor & Finance' : 'Klien / Pemohon',
            phone: acc.phone,
            office_name: acc.officeName,
            sk_number: acc.skNumber || null
          }).eq('id', existingUsers[0].id);
        }
        
      } else {
        console.error(`Error creating ${acc.email}:`, authError.message);
      }
      continue;
    }

    if (authData.user) {
      // 2. Insert into profiles table
      const roleTitleMap = {
        notaris: "Notaris & PPAT Utama",
        admin: "Admin Kantor & Finance",
        klien: "Klien / Pemohon",
      };

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        email: acc.email,
        full_name: acc.fullName,
        role: acc.role,
        role_title: roleTitleMap[acc.role],
        phone: acc.phone,
        office_name: acc.officeName,
        sk_number: acc.skNumber || null
      });

      if (profileError) {
        console.error(`Error creating profile for ${acc.email}:`, profileError.message);
      } else {
        console.log(`Successfully created ${acc.email}`);
      }
    }
  }
}

createAccounts();
