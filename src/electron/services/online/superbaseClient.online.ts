import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class Supabase {
    private static instance: SupabaseClient;

    static getClient(): SupabaseClient {
        if (!Supabase.instance) {
            Supabase.instance = createClient(
                'https://lvmfvgcmadzkcxlrjoje.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWZ2Z2NtYWR6a2N4bHJqb2plIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcxNjk5MSwiZXhwIjoyMDY3MjkyOTkxfQ.ryGvmzMmgs9yc3e0g3o3UG0kXrw0VV7Ye6siiT5_dsM'
            )
        }
        return Supabase.instance;
    }
}
