import type { ExamAttempt } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";


export class ExamAttemptsOnline {
    static async fetchSince(timestamp: string): Promise<ExamAttempt[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('exam_attempts')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching exam_attempts: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<ExamAttempt>(row));
    }

    static async upsert(rows: ExamAttempt[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('exam_attempts')
            .upsert(payload, {
                onConflict: 'id',
            });

        if (error) throw new Error(`Supabase error inserting exam_attempts: ${error.message}`);
    }
}
