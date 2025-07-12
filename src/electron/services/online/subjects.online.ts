import { Supabase } from './superbaseClient.online'

export class SubjectsOnline {
    static async fetchSince(timestamp: string) {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('subjects')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw error;
        return data;
    }

    static async upsert(rows: any[]) {
        if (!rows.length) return;
        const client = Supabase.getClient();
        const { error } = await client
            .from('subjects')
            .upsert(rows, { onConflict: 'id' });

        if (error) throw error;
    }
}
