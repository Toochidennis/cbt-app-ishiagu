import { Supabase } from "./superbaseClient.online";


export class ExamAttemptsOnline {
    static async fetchSince(timestamp: string) {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('exam_attempts')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw error;
        return data;
    }

    static async upsert(rows: any[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const { error } = await client
            .from('exam_attempts')
            .upsert(rows, {
                onConflict: 'exam_schedule_id,student_id',
            });

        if (error) throw error;
    }
}
