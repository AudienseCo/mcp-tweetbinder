# TweetBinder MCP Server

This is a Model Context Protocol (MCP) server for the TweetBinder API, allowing Claude and other MCP-compatible AI models to access TweetBinder analytics data.

## Features

- Access TweetBinder analytics directly from Claude
- Analyze hashtags, users, and conversations on Twitter/X
- Get engagement metrics, sentiment analysis, and more
- Create Twitter reports with custom search queries
- Check report generation status
- Retrieve detailed report statistics
- Get account balance and quota information
- Count tweets matching specific queries
- List and manage your TweetBinder reports

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

You need a valid TweetBinder API Bearer Token to use this service. Set it in your environment:

```bash
export TWEETBINDER_API_TOKEN='your-bearer-token-here'
```

## Usage with Claude Desktop

1. Edit your Claude Desktop configuration file:

   - **MacOS:**
     ```bash
     code ~/Library/Application\ Support/Claude/claude_desktop_config.json
     ```
   - **Windows:**
     ```bash
     code %AppData%\Claude\claude_desktop_config.json
     ```

2. Add this configuration:

```json
"mcpServers": {
  "tweetbinder-insights": {
    "command": "node",
    "args": [
      "/absolute/path/to/build/index.js"
    ],
    "env": {
      "TWEETBINDER_API_TOKEN": "your-bearer-token-here"
    }
  }
}
```

3. Restart Claude Desktop

## Available Tools

### `analyze-hashtag`

Retrieves analytics for a specific hashtag.

- **Parameters**:
  - `hashtag` (string): The hashtag to analyze (without the # symbol)
  - `days` (number, optional): Number of days to analyze (default: 7)

- **Response**:
  - Analysis of the hashtag including engagement metrics, top contributors, and more.

### `create-twitter-report`

Creates a new report that analyzes Twitter/X data based on a search query.

- **Parameters**:
  - `query` (string): The search query for Twitter data. Can include operators like AND, OR, hashtags, mentions, etc.
  - `limit` (number, optional): Maximum number of tweets to retrieve (up to 50,000).
  - `startDate` (number, optional): Start date as Unix timestamp (seconds since epoch).
  - `endDate` (number, optional): End date as Unix timestamp (seconds since epoch).
  - `reportType` (enum, optional): Type of report to create: "7-day" for last week or "historical" for all time. Default: "7-day".

- **Response**:
  - Report ID and status information for the created report.
  - Instructions for checking report status and retrieving statistics.

### `create-twitter-count`

Creates a new report that counts tweets matching a search query.

- **Parameters**:
  - `query` (string): The search query for Twitter data. Can include operators like AND, OR, hashtags, mentions, etc.
  - `reportType` (enum, optional): Type of report to create: "7-day" for last week or "historical" for all time. Default: "7-day".

- **Response**:
  - Raw JSON response containing:
    - `status`: The status of the report creation
    - `resourceId`: The ID of the created report
    - `error`/`message`: Any error or status messages

### `list-reports`

Retrieves a list of all your TweetBinder reports with sorting capabilities.

- **Parameters**:
  - `order` (string, optional): Sorting parameter in the format 'field|direction'. Example: 'createdAt|-1' for newest first, 'createdAt|1' for oldest first.

- **Response**:
  - Raw JSON response containing an array of reports with details for each:
    - `id`: Report ID
    - `name`: Report name
    - `status`: Current status (Generated, Waiting, etc.)
    - `createdAt`: Creation timestamp
    - `updatedAt`: Last update timestamp
    - `type`: Report type
    - `source`: Report source
    - `query`: Original search query

**Query Syntax Examples:**
- `#apple`: Tweets containing the hashtag #apple
- `apple lang:en`: English tweets containing "apple"
- `(#apple OR #iphone) -#android`: Tweets with #apple or #iphone but not #android
- `@apple`: Tweets mentioning @apple
- `from:apple`: Tweets posted by user "apple"

**Note:** After creating the count report, use the `get-report-status` tool to check when it's ready, then use `get-report-stats` to get the actual count.

### `get-report-status`

Checks the current status of a TweetBinder report.

- **Parameters**:
  - `reportId` (string): The ID of the report to check.

- **Response**:
  - The current status of the report, which can be one of:
    - **Generated**: The report is complete and ready to use.
    - **Waiting**: The report is still being generated or waiting for tweets to be collected.
    - **Outdated**: The report is being updated with new data and will be available soon.
    - **Deleted**: The report has been deleted and is no longer available.
    - **Archived**: The report has been archived and may be deleted soon.
  - An explanation of what the status means and what actions are available.

**Note:** You must first create a report using the `create-twitter-report` or `create-twitter-count` tool to get a report ID.

### `get-report-stats`

Retrieves comprehensive statistics and analytics for a TweetBinder report.

- **Parameters**:
  - `reportId` (string): The ID of the report to retrieve statistics for.

- **Response**:
  - A formatted summary of the report statistics including:
    - **Overview**: Total tweets, date range, contributors, engagement, media, and links.
    - **Engagement Metrics**: Potential reach, impressions, retweets, and likes.
    - **Sentiment Analysis**: Overall sentiment score and interpretation.
    - **Top Contributors**: Most active users and their tweet counts.
    - **Popular Content**: Most retweeted posts.
    - **Frequently Used Hashtags**: Common hashtags used in the conversation.

**Note:** The report must have "Generated" status before statistics can be retrieved. Use the `get-report-status` tool to check if a report is ready.

### `get-account-balances`

Retrieves information about your account's credit balance, usage, and remaining quota.

- **Parameters**:
  - None

- **Returns**:
  - Raw JSON response containing:
    - `total`: Total credits available
    - `used`: Credits used
    - `available`: Credits currently available
    - `discount`: Any applicable discount
    - `remainingReports`: Number of reports remaining
    - `quota`: Quota information including:
      - `startedAt`: Quota period start date
      - `finishedAt`: Quota period end date
      - `remaining`: Remaining quota
      - `used`: Used quota
      - `total`: Total quota
  - Any error or status messages

## License

Apache 2.0 