#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createReport } from "./tweetbinderClient.js";

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
    "Creates a new report that analyzes Twitter/X data based on a search query. The report provides statistics and tweet data.",
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

        if (!data) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Failed to create Twitter report. Please check your query and try again.",
                    },
                ],
            };
        }

        if (data.error || !data.resourceId) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error creating Twitter report: ${data.error || data.message || "Unknown error"}`,
                    },
                ],
            };
        }

        return {
            content: [
                {
                    type: "text",
                    text: `Twitter report created successfully!
                    
Report ID: ${data.resourceId}

Status: ${data.status}

Your report is being processed. To check the status of your report, use the 'get-report-status' tool with this Report ID.
Once the report is complete, you can retrieve the statistics using the 'get-report-stats' tool.

Note: Processing may take a few minutes depending on the size of your query.`,
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