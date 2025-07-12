import type { Subject } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from './superbaseClient.online'

export class SubjectsOnline {
    static async fetchSince(timestamp: string): Promise<Subject[]> {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('subjects')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching subjects: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<Subject>(row));
    }

    static async upsert(rows: Subject[]) {
        if (!rows.length) return;
        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('subjects')
            .upsert(payload,
                { onConflict: 'id' }
            );

        if (error) throw new Error(`Supabase error inserting subjects: ${error.message}`);
    }
}
