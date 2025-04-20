# MongoDB MCP Server

[![Node.js 18+](https://img.shields.io/badge/node-20%2B-blue.svg)](https://nodejs.org/en/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5%2B-blue.svg)](https://www.typescriptlang.org/)

A Model Context Protocol (MCP) server enabling large language models (LLMs) to communicate directly with MongoDB. It allows natural language to be used for database queries, schema exploration, and data operations.

## ✨ Features

- 🔍 Explore collection structures
- 📊 Query and filter documents
- 📈 Manage indexes
- 📝 Perform insert, update, and delete operations on documents

## Demo Video


https://github.com/user-attachments/assets/6a63d107-0e55-46de-9422-4cf0ecd2e65b


## 🚀 Getting Started

To begin, locate your MongoDB connection string and update your Claude Desktop configuration file:

**MacOS**: `~/Library/Application\ Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mongodb": {
      "command": "npx",
      "args": [
        "mongo-mcp",
        "mongodb+srv://<username>:<password>@<cluster-address>/<database>"
      ]
    }
  }
}
```

### Prerequisites

- Node.js 18+
- npx
- MCP Client (Ex. Claude Desktop App)

### Configure Claude Desktop

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application\ Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

## 📝 Available Tools

The server provides these tools for database interaction:

### Query Tools

- `listCollections`: List available collections
- `getCollectionSchema`: Collection schema
- `findDocument`: Query documents with filtering and projection
- `insertDocument`: Inserts a document into a collection
- `updateDocument`: Update a single document

### Index Tools

- `createIndex`: Create a new index
- `deleteIndex`: Remove an index
- `listIndexes`: List indexes for a collection
