import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import type { Assessment } from "../sqlite/models";
import { Supabase } from "./superbaseClient.online";

export class AssessmentsOnline {
    static async fetchSince(timestamp: string): Promise<Assessment[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('assessments')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching assessments: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<Assessment>(row));
    }

    static async upsert(rows: Assessment[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('assessments')
            .upsert(payload, {
                onConflict: 'id',
            });

        if (error) throw new Error(`Supabase error inserting assessments: ${error.message}`);
    }
}
