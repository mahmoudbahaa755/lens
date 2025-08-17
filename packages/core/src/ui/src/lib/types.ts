export type LensConfig = {
    path: string;
};

type EntryHeaders = Record<string, number | string | string[] | undefined>;

export type LogRequest = {
    id: string;
    type: 'request';
    timestamp: number;
    method: string;
    path: string;
    status: number;
    durationMs: number;
    ip: string;
    memoryUsageMb: number;
    request: {
        headers: EntryHeaders;
        body?: string;
    };
    response: {
        headers: EntryHeaders;
        body?: string;
    };
    lens_entry_id: string | null;
};

export type LogQuery = {
    id: string;
    type: 'query';
    timestamp: number;
    query: string;
    durationMs: number;
    lens_entry_id?: string;
};

export type LogEntry = LogRequest | LogQuery;

