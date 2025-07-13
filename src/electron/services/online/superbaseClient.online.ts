import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class Supabase {
    private static instance: SupabaseClient;

    static getClient(): SupabaseClient {
        if (!Supabase.instance) {
            Supabase.instance = createClient(
                'https://lvmfvgcmadzkcxlrjoje.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2bWZ2Z2NtYWR6a2N4bHJqb2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MTY5OTEsImV4cCI6MjA2NzI5Mjk5MX0.cWDq8BAY2ApYS4yi_MGQiKDtvBwWF8nRJuQK_kVTfhI'
            )
        }
        return Supabase.instance;
    }
}
