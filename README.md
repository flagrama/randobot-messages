# node-discord-bot

Useful for testing out changes to randobot's message responses to make sure you didn't break anything.

## Installation
Requires Node 6.0+ and a Discord bot joined to a server you wish to test the commands in.

In the root directory run
```bash
npm install
```

Rename `auth.json.sample` to `auth.json` and replace the place holder `token` text with your bot's token and the placeholder `serverID` text with your test server's ID (You may need to enable Developer Mode in Discord to retrieve this)

## Running
```bash
node index.js
```
