import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { CourseAssignment } from "../sqlite/models";
import { Supabase } from './superbaseClient.online'

export class CourseAssignmentsOnline {
    static async fetchSince(timestamp: string): Promise<CourseAssignment[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('course_assignments')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching course_assignments: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<CourseAssignment>(row))
    }

    static async upsert(rows: CourseAssignment[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('course_assignments')
            .upsert(payload, {
                onConflict: ['staff_id', 'subject_id', 'class_id'].join(','),
            });

        if (error) throw new Error(`Supabase error inserting course_assignments: ${error.message}`);
    }
}
