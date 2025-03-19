/**
 * Type definitions for TweetBinder API responses
 */


// Query parameters for creating a report
export type ReportQuery = {
    raw: string;
    limit?: number;
    startDate?: number;
    endDate?: number;
};

// Create report request payload
export type CreateReportRequest = {
    query: ReportQuery;
};

// Create report response
export type CreateReportResponse = {
    status: string;
    resourceId?: string;
    error?: string;
    message?: string;
};

// Report status response
export type ReportStatusResponse = {
    status: 'Generated' | 'Waiting' | 'Outdated' | 'Deleted' | 'Archived';
    message?: string;
    error?: string;
};
