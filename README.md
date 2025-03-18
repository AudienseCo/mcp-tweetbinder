# TweetBinder MCP Server

This is a Model Context Protocol (MCP) server for the TweetBinder API, allowing Claude and other MCP-compatible AI models to access TweetBinder analytics data.

## Features

- Access TweetBinder analytics directly from Claude
- Analyze hashtags, users, and conversations on Twitter/X
- Get engagement metrics, sentiment analysis, and more

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

You need a valid TweetBinder API key to use this service. Set it in your environment:

```bash
export TWEETBINDER_API_KEY='your-api-key-here'
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
      "TWEETBINDER_API_KEY": "your-api-key-here"
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

## License

MIT 