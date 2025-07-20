import { appToDb, dbToApp } from "../../util/caseTransform";
import { CourseAssignment } from "../sqlite/models";
import { Supabase } from './superbaseClient.online'
import { HelperOnline } from "./helper.online";

export class CourseAssignmentsOnline {
    private static table: string = 'course_assignments';

    static async fetchSince(timestamp: string): Promise<CourseAssignment[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<CourseAssignment>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        )
    }

    static async upsert(rows: CourseAssignment[]) {
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
