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

// Report statistics response - updated to match actual structure
export type ReportStatsResponse = {
    stats: {
        general: {
            since: number;
            until: number;
            total: number;
            images: number;
            links: number;
            linksAndImages: number;
            impact: number;
            reach: number;
            contributorsValue: number;
            economicValue: number;
            clears: number;
            replies: number;
            retweets: number;
            receivedRetweets: number;
            favorites: number;
            impressions: number;
            quotes: number;
            totalReplies: number;
            bookmarks: number;
            contributors: number;
            originalContributors: number;
            originals: number;
            tweetValueMean: number;
            influence: number;
            engagement: number;
            contributorValueMean: number;
        };
        sentiment: {
            general?: {
                positive: any;
                negative: any;
                neutral: any;
                undefined: any;
            };
            score: number;
            _positive?: any;
            _negative?: any;
            _neutral?: any;
            _undefined?: any;
            _untitled?: any;
        };
        contributorRankings: {
            mostActive: any[];
            mostFavorites: any[];
            mostPopular: any[];
            mostRepliers: any[];
            highestImpact: any[];
            originalTweets: any[];
            retweeters: any[];
            topPolite: any[];
            topTroll: any[];
            topPhotographers: any[];
            verifiedUsers: any[];
            topUsersValue: any[];
            topUserTweetsValue: any[];
            topRetweetEngagers: any[];
            topFavoriteEngagers: any[];
            [key: string]: any[];
        };
        mediaRankings: {
            topPublications: any[];
            mostValuedTweets: any[];
            mostRetweetedTweets: any[];
            mostFavoritedTweets: any[];
            topHashtags: any[];
            topLanguages: any[];
            topSources: any[];
            mostMentioned: any[];
            genderPerContributor: any[];
            mostRetweetedImages: any[];
            mostFavoritedImages: any[];
            mostRetweeted: any[];
            [key: string]: any[];
        };
        influences: {
            sentimentInfluence: any;
            tweetsPerContributor: any;
            contributorInfluence: any;
            tweetValueInfluence: any;
            userValueInfluence: any;
            ageInfluence: any;
            textLengthInfluence: any;
            oldVsNewInfluence: any;
            [key: string]: any;
        };
        timeline: any[];
        binders: any[];
        meta: {
            updatedAt: number;
            id: string;
            name: string;
            search: {
                startedAt: number;
                finishedAt: number;
                source: string;
                type: string;
            };
        };
    };
    error?: string;
    message?: string;
};
