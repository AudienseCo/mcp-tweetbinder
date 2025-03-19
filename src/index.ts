#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createReport, getReportStatus, getReportStats } from "./tweetbinderClient.js";

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