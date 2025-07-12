
import { appToDb, dbToApp } from '../../../electron/util/caseTransform';
import { Grade } from '../sqlite/models';
import { Supabase } from './superbaseClient.online';

export class GradesOnline {
    static async fetchSince(lastSynced: string): Promise<Grade[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from("grades")
            .select("*")
            .gte("updated_at", lastSynced);

        if (error) throw new Error(`Supabase error fetching grades: ${error.message}`);

        if (!data) return [];

        return data.map(row => dbToApp<Grade>(row));
    }

    static async upsert(grades: Grade[]) {
        if (!grades.length) return;

        const client = Supabase.getClient();
        const plain = grades.map(g => appToDb(g));

        const { error } = await client
            .from("grades")
            .upsert(plain, { onConflict: 'id' });

        if (error) throw new Error(`Supabase error inserting grades: ${error.message}`);
    }
}
