import { CourseRegistration } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";

export class CourseRegistrationsOnline {
    static async fetchSince(timestamp: string): Promise<CourseRegistration[]> {
        const client = Supabase.getClient();

        const { data, error } = await client
            .from('course_registrations')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching course_registrations: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<CourseRegistration>(row));
    }

    static async upsert(rows: CourseRegistration[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        //console.log(payload);

        const { error } = await client
            .from('course_registrations')
            .upsert(payload, {
                onConflict: 'id',
            });

        if (error) throw new Error(`Supabase error inserting course_registrations: ${error.message}`);
    }
}
