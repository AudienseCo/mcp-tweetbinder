import fetch from "node-fetch";
import { TWEETBINDER_API_BASE, TWEETBINDER_API_TOKEN } from "./config.js";
import { CreateReportRequest, CreateReportResponse } from "./types.js";

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