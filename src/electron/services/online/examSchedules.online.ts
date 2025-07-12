import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { ExamSchedule } from "../sqlite/models";
import { Supabase } from "./superbaseClient.online";

export class ExamSchedulesOnline {
    static async fetchSince(timestamp: string): Promise<ExamSchedule[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('exam_schedules')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching exam_schedules: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<ExamSchedule>(row));
    }

    static async upsert(rows: ExamSchedule[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('exam_schedules')
            .upsert(payload, {
                onConflict: 'id',
            });

        if (error) throw new Error(`Supabase error inserting exam_schedules: ${error.message}`);
    }
}
