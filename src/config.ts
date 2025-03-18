export const TWEETBINDER_API_BASE = "https://api.tweetbinder.com";

// Bearer token for TweetBinder API authentication
export const TWEETBINDER_API_TOKEN = process.env.TWEETBINDER_API_TOKEN || "";

if (!TWEETBINDER_API_TOKEN) {
    console.error("Missing TweetBinder API token. Check your environment variables.");
} 