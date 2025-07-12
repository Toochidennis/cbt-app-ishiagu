import type { Result } from '../sqlite/models';
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from './superbaseClient.online';

export class ResultsOnline {
    static async fetchSince(timestamp: string): Promise<Result[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('results')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching results: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<Result>(row));
    }

    static async upsert(rows: Result[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('results')
            .upsert(payload, {
                onConflict: 'id'
            });

        if (error) throw new Error(`Supabase error inserting results: ${error.message}`);
    }
}
