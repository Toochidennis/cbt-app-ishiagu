import { Supabase } from "./superbaseClient.online";

export class CourseRegistrationsOnline {
    static async fetchSince(timestamp: string) {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('course_registrations')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw error;
        return data;
    }

    static async upsert(rows: any[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const { error } = await client
            .from('course_registrations')
            .upsert(rows, {
                onConflict: 'student_id,subject_id,term,year',
            });

        if (error) throw error;
    }
}
