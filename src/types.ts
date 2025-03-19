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

// Twitter count report response
export type TwitterCountResponse = {
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

// Account balance response
export type AccountBalanceResponse = {
    total: number;
    used: number;
    available: number;
    discount: number;
    remainingReports: number;
    quota: {
        startedAt: string;
        finishedAt: string;
        remaining: number;
        used: number;
        total: number;
    };
    error?: string;
    message?: string;
};

// Report list response
export type ReportListResponse = {
    reports: Array<{
        id: string;
        name: string;
        status: 'Generated' | 'Waiting' | 'Outdated' | 'Deleted' | 'Archived';
        createdAt: number;
        updatedAt: number;
        type: string;
        source: string;
        query?: {
            raw: string;
            [key: string]: any;
        };
        [key: string]: any;
    }>;
    error?: string;
    message?: string;
};

// Tweet object in transcript response
export type TweetObject = {
    _id: string;
    conversationId?: string;
    counts: {
        textLength: number;
        retweets: number;
        totalRetweets: number;
        favorites: number;
        hashtags: number;
        images: number;
        links: number;
        linksAndImages: number;
        mentions: number;
        quotes: number;
        impressions: number;
        totalReplies: number;
        bookmarks: number;
        originals: number;
        clears: number;
        replies: number;
        userValue: number;
        tweetValue: number;
    };
    createdAt: number;
    hashtags: string[];
    images: string[];
    inReplyToId?: string;
    lang?: string;
    links: string[];
    mentions: string[];
    retweeted?: TweetObject;
    user: {
        id: string;
        name: string;
        alias: string;
        picture: string;
        followers: number;
        following: number;
        verified: boolean;
        age: number;
        gender: number;
        value: number;
    };
    sentiment: {
        vote: 'positive' | 'negative' | 'neutral' | 'undefined';
    };
    [key: string]: any;
};

// User object in transcript response
export type UserObject = {
    id: string;
    name: string;
    alias: string;
    picture: string;
    followers: number;
    following: number;
    verified: boolean;
    age: number;
    gender: number;
    value: number;
    [key: string]: any;
};

// Report transcript response
export type ReportTranscriptResponse = {
    items: TweetObject[] | UserObject[];
    pagination: {
        total: number;
        page: number;
        perPage: number;
        totalPages: number;
    };
    error?: string;
    message?: string;
};
