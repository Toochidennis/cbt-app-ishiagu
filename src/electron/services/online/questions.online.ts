import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import type { Question } from "../sqlite/models";
import { Supabase } from "./superbaseClient.online";

export class QuestionsOnline {
    static async fetchSince(timestamp: string): Promise<Question[]> {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('questions')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching questions: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<Question>(row));
    }

    static async upsert(rows: Question[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('questions')
            .upsert(payload,
                { onConflict: 'id' }
            );

        if (error) throw new Error(`Supabase error inserting questions: ${error.message}`);
    }
}
