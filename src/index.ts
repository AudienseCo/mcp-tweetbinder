#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createReport, getReportStatus, getReportStats, getAccountBalances, createTwitterCount, getReportsList, getReportTranscript } from "./tweetbinderClient.js";

// MCP Server instance
const server = new McpServer({
    name: "tweetbinder",
    version: "1.0.0",
});

/**
 * MCP Tool: Create Twitter Report
 * Creates a new report based on a search query for Twitter data
 */
server.tool(
    "create-twitter-report",
    "Creates a new report that analyzes Twitter/X data based on a search query. The report provides statistics and tweet data. Returns raw JSON response.",
    {
        query: z.string().describe("The search query for Twitter data. Can include operators like AND, OR, hashtags, mentions, etc."),
        limit: z.number().optional().describe("Maximum number of tweets to retrieve (up to 50,000)."),
        startDate: z.number().optional().describe("Start date as Unix timestamp (seconds since epoch)."),
        endDate: z.number().optional().describe("End date as Unix timestamp (seconds since epoch)."),
        reportType: z.enum(["7-day", "historical"]).optional().default("7-day").describe("Type of report to create: '7-day' for last week or 'historical' for all time.")
    },
    async ({ query, limit, startDate, endDate, reportType }) => {
        const requestBody = {
            query: {
                raw: query,
                limit: limit,
                startDate: startDate,
                endDate: endDate
            }
        };

        const data = await createReport(requestBody, reportType || "7-day");

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * MCP Tool: Get Report Status
 * Checks the current status of a report
 */
server.tool(
    "get-report-status",
    "Checks the current status of a TweetBinder report. Returns raw JSON response.",
    {
        reportId: z.string().describe("The ID of the report to check.")
    },
    async ({ reportId }) => {
        const data = await getReportStatus(reportId);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * MCP Tool: Get Report Statistics
 * Retrieves detailed statistics for a generated report
 */
server.tool(
    "get-report-stats",
    "Retrieves comprehensive statistics and analytics for a TweetBinder report. The report must be in 'Generated' status to access statistics. Returns raw JSON response.",
    {
        reportId: z.string().describe("The ID of the report to retrieve statistics for.")
    },
    async ({ reportId }) => {
        const data = await getReportStats(reportId);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * MCP Tool: Get Account Balances
 * Retrieves current account balance and quota information
 */
server.tool(
    "get-account-balances",
    "Retrieves information about your account's credit balance, usage, and remaining quota. Returns raw JSON response.",
    {},
    async () => {
        const data = await getAccountBalances();

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * MCP Tool: Create Twitter Count Report
 * Creates a new report that counts tweets matching a search query
 */
server.tool(
    "create-twitter-count",
    "Creates a new report that counts tweets matching a search query. Returns raw JSON response.",
    {
        query: z.string().describe("The search query for Twitter data. Can include operators like AND, OR, hashtags, mentions, etc."),
        reportType: z.enum(["7-day", "historical"]).optional().default("7-day").describe("Type of report to create: '7-day' for last week or 'historical' for all time.")
    },
    async ({ query, reportType }) => {
        const requestBody = {
            query: {
                raw: query
            }
        };

        const data = await createTwitterCount(requestBody, reportType || "7-day");

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * MCP Tool: Get Reports List
 * Retrieves a list of all reports with optional sorting
 */
server.tool(
    "list-reports",
    "Retrieves a list of all your TweetBinder reports. Reports can be sorted by different fields. Returns raw JSON response.",
    {
        order: z.string().optional().describe("Optional sorting parameter in the format 'field|direction'. Example: 'createdAt|-1' for newest first, 'createdAt|1' for oldest first.")
    },
    async ({ order }) => {
        const data = await getReportsList(order);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * MCP Tool: Get Report Content
 * Retrieves the content (tweets or users) of a report
 */
server.tool(
    "get-report-content",
    "Retrieves the content (tweets or users) of a TweetBinder report. The report must be in 'Generated' status. Returns raw JSON response.",
    {
        reportId: z.string().describe("The ID of the report to retrieve content for."),
        contentType: z.enum(["tweets", "users"]).describe("The type of content to retrieve: 'tweets' for tweet IDs or 'users' for user IDs."),
        page: z.number().optional().describe("Page number for pagination. Starts at 1."),
        perPage: z.number().optional().describe("Number of items per page (default varies by endpoint)."),
        sortBy: z.string().optional().describe("Field to sort by (e.g., 'createdAt', 'counts.favorites')."),
        sortDirection: z.enum(["1", "-1"]).optional().describe("Sort direction: '1' for ascending, '-1' for descending."),
        filter: z.string().optional().describe("JSON string with filter criteria. Example: '{\"counts.favorites\":{\"$gt\":10}}'")
    },
    async ({ reportId, contentType, page, perPage, sortBy, sortDirection, filter }) => {
        // Build filters object
        const filters: Record<string, string | number> = {};
        
        if (page !== undefined) {
            filters.page = page;
        }
        
        if (perPage !== undefined) {
            filters.perPage = perPage;
        }
        
        if (sortBy && sortDirection) {
            filters.sort = `${sortBy}|${sortDirection}`;
        }
        
        if (filter) {
            try {
                // Parse the filter string and convert it to the proper format
                const filterObj = JSON.parse(filter);
                Object.entries(filterObj).forEach(([key, value]) => {
                    filters[`filter[${key}]`] = JSON.stringify(value);
                });
            } catch (error) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                error: "Invalid filter JSON string",
                                message: "The filter parameter must be a valid JSON string"
                            }, null, 2),
                        },
                    ],
                };
            }
        }
        
        const data = await getReportTranscript(reportId, contentType, filters);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
);

/**
 * Starts the MCP server and listens for incoming requests.
 */
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("TweetBinder MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
}); 