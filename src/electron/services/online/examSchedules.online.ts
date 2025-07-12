import { Supabase } from "./superbaseClient.online";

export class ExamSchedulesOnline {
    static async fetchSince(timestamp: string) {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('exam_schedules')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw error;
        return data;
    }

    static async upsert(rows: any[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const { error } = await client
            .from('exam_schedules')
            .upsert(rows, {
                onConflict: 'subject_id,class_id,term,year',
            });

        if (error) throw error;
    }
}
