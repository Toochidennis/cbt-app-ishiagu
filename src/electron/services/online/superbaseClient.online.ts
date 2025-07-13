import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class Supabase {
    private static instance: SupabaseClient;

    static getClient(): SupabaseClient {
        if (!Supabase.instance) {
            Supabase.instance = createClient(
                'https://lvmfvgcmadzkcxlrjoje.supabase.co',
                ''
            )
        }
        return Supabase.instance;
    }
}
