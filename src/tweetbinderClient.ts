import fetch from "node-fetch";
import { TWEETBINDER_API_BASE, TWEETBINDER_API_TOKEN } from "./config.js";
import { CreateReportRequest, CreateReportResponse, ReportStatusResponse, ReportStatsResponse, AccountBalanceResponse, TwitterCountResponse, ReportListResponse } from "./types.js";

/**
 * Makes a request to the TweetBinder API.
 * Uses Bearer token authentication in the Authorization header.
 */
async function makeTweetBinderRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    const url = new URL(`${TWEETBINDER_API_BASE}${endpoint}`);
    
    // Add query parameters if any
    if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params);
        url.search = searchParams.toString();
    }

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TWEETBINDER_API_TOKEN}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Request error ${response.status} for ${endpoint}:`, await response.text());
            return null;
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error(`Request error for ${endpoint}:`, error);
        return null;
    }
}

/**
 * Makes a POST request to the TweetBinder API.
 * Uses Bearer token authentication in the Authorization header.
 */
async function makeTweetBinderPostRequest<T>(endpoint: string, body: any): Promise<T | null> {
    const url = new URL(`${TWEETBINDER_API_BASE}${endpoint}`);

    try {
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TWEETBINDER_API_TOKEN}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            console.error(`Request error ${response.status} for ${endpoint}:`, await response.text());
            return null;
        }

        return (await response.json()) as T;
    } catch (error) {
        console.error(`Request error for ${endpoint}:`, error);
        return null;
    }
}

/**
 * Creates a new Twitter report with the specified query
 * @param query The search query and parameters
 * @param type The report type: '7-day' or 'historical'
 * @returns Response with the resource ID for the created report
 */
export async function createReport(
    query: CreateReportRequest, 
    type: "7-day" | "historical" = "7-day"
): Promise<CreateReportResponse | null> {
    return makeTweetBinderPostRequest<CreateReportResponse>(`/reports/twitter/${type}`, query);
}

/**
 * Gets the current status of a report
 * @param reportId The ID of the report to check
 * @returns The status of the report (Generated, Waiting, Outdated, Deleted, or Archived)
 */
export async function getReportStatus(reportId: string): Promise<ReportStatusResponse | null> {
    return makeTweetBinderRequest<ReportStatusResponse>(`/reports/${reportId}`);
}

/**
 * Gets the statistics of a report
 * @param reportId The ID of the report
 * @returns Detailed statistics about tweets, engagement, users, etc.
 */
export async function getReportStats(reportId: string): Promise<ReportStatsResponse | null> {
    return makeTweetBinderRequest<ReportStatsResponse>(`/reports/${reportId}/stats`);
}

/**
 * Gets the current account balances and quota information
 * @returns Information about account credits, usage, and remaining quota
 */
export async function getAccountBalances(): Promise<AccountBalanceResponse | null> {
    return makeTweetBinderRequest<AccountBalanceResponse>('/me/balances');
}

/**
 * Creates a new Twitter count report with the specified query
 * @param query The search query and parameters
 * @param type The report type: '7-day' or 'historical'
 * @returns Response with the resource ID for the created count report
 */
export async function createTwitterCount(
    query: CreateReportRequest, 
    type: "7-day" | "historical" = "7-day"
): Promise<TwitterCountResponse | null> {
    return makeTweetBinderPostRequest<TwitterCountResponse>(`/reports/twitter-count/${type}`, query);
}

/**
 * Gets a list of all reports with optional sorting
 * @param order Optional sorting parameter in the format of "field|direction" (e.g., "createdAt|-1")
 * @returns List of reports sorted according to the order parameter
 */
export async function getReportsList(order?: string): Promise<ReportListResponse | null> {
    const params: Record<string, string> = {};
    if (order) {
        params.order = order;
    }
    return makeTweetBinderRequest<ReportListResponse>('/reports', params);
}