import { Class } from '../sqlite/models';
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from './superbaseClient.online';

export class ClassesOnline {
    static async fetchSince(timestamp: string): Promise<Class[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('classes')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching classes: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<Class>(row))
    }

    static async upsert(rows: Class[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('classes')
            .upsert(payload,
                { onConflict: 'id' }
            );

        if (error) throw new Error(`Supabase error inserting assessments: ${error.message}`);
    }
}
