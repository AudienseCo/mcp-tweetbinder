import fetch from "node-fetch";
import { TWEETBINDER_API_BASE, TWEETBINDER_API_KEY } from "./config.js";

/**
 * Makes a request to the TweetBinder API.
 * Uses the API key for authentication.
 */
async function makeTweetBinderRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
    const url = new URL(`${TWEETBINDER_API_BASE}${endpoint}`);
    
    // Add API key to parameters
    const searchParams = new URLSearchParams({
        ...params,
        key: TWEETBINDER_API_KEY
    });
    
    url.search = searchParams.toString();

    try {
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
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
 * Example function: Get a hashtag analysis from TweetBinder
 * This is a dummy implementation for demonstration purposes
 */
export async function getHashtagAnalysis(hashtag: string): Promise<any | null> {
    return makeTweetBinderRequest<any>("/search/hashtag", { q: hashtag });
}

/**
 * Example function: Get user analysis from TweetBinder
 * This is a dummy implementation for demonstration purposes
 */
export async function getUserAnalysis(username: string): Promise<any | null> {
    return makeTweetBinderRequest<any>("/search/user", { q: username });
} 