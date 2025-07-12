import { Supabase } from "./superbaseClient.online";

export class QuestionsOnline {
    static async fetchSince(timestamp: string) {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('questions')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw error;
        return data;
    }

    static async upsert(rows: any[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const { error } = await client
            .from('questions')
            .upsert(rows, { onConflict: 'id' });

        if (error) throw error;
    }
}
