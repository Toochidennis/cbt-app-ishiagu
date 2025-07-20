export class HelperOnline {
    static async fetchAllMatching<T>(
        client: any,
        table: string,
        conditionFn: (query: any) => any,
        dbToApp: (row: any) => T,
        pageSize = 1000
    ): Promise<T[]> {
        let allData: any[] = [];
        let start = 0;

        while (true) {
            const query = client.from(table).select('*').range(start, start + pageSize - 1);
            const { data, error } = await conditionFn(query);

            if (error) throw new Error(`Error fetching from ${table}: ${error.message}`);
            if (!data?.length) break;

            allData.push(...data);

            if (data.length < pageSize) break;

            start += pageSize;
        }

        return allData.map(dbToApp);
    }

    static async upsertInBatches(
        client: any,
        table: string,
        data: any[],
        onConflict = 'id',
        batchSize = 500
    ): Promise<void> {
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const { error } = await client
                .from(table)
                .upsert(batch, { onConflict });

            if (error) throw new Error(`Error upserting to ${table}: ${error.message}`);
        }
    }
}
