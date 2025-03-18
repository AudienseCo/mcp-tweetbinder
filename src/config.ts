export const TWEETBINDER_API_BASE = "https://api.tweetbinder.com";

// API key for TweetBinder API authentication
export const TWEETBINDER_API_KEY = process.env.TWEETBINDER_API_KEY || "";

if (!TWEETBINDER_API_KEY) {
    console.error("Missing TweetBinder API key. Check your environment variables.");
} 