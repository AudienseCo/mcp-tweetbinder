/**
 * Type definitions for TweetBinder API responses
 */

// Example type for a tweet
export type Tweet = {
    id: string;
    text: string;
    created_at: string;
    username: string;
    name: string;
    profile_image_url: string;
    retweet_count: number;
    favorite_count: number;
    reply_count: number;
    quote_count: number;
};

// Example hashtag analysis response
export type HashtagAnalysisResponse = {
    status: string;
    search_metadata: {
        total_tweets: number;
        period: {
            start: string;
            end: string;
        }
    };
    tweets: Tweet[];
    metrics: {
        total_impressions: number;
        total_potential_reach: number;
        total_contributors: number;
        total_tweets: number;
        average_tweets_per_contributor: number;
    };
};

// Example user analysis response
export type UserAnalysisResponse = {
    status: string;
    search_metadata: {
        total_tweets: number;
        period: {
            start: string;
            end: string;
        }
    };
    user_info: {
        username: string;
        name: string;
        followers_count: number;
        following_count: number;
        tweet_count: number;
        profile_image_url: string;
    };
    tweets: Tweet[];
}; 