import { CourseRegistration } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";

export class CourseRegistrationsOnline {
    private static table: string = 'course_registrations';

    static async fetchSince(timestamp: string): Promise<CourseRegistration[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<CourseRegistration>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: CourseRegistration[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();

        await HelperOnline.upsertInBatches(
            client,
            this.table,
            rows.map(appToDb),
            'id'
        );
    }
}
