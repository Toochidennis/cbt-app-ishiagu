import { Supabase } from './superbaseClient.online'

export class CourseAssignmentsOnline {
    static async fetchSince(timestamp: string) {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('course_assignments')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw error;
        return data;
    }

    static async upsert(rows: any[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const { error } = await client
            .from('course_assignments')
            .upsert(rows, {
                onConflict: 'staff_id,subject_id,class_id',
            });

        if (error) throw error;
    }
}
