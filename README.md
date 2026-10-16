# Basic Chatbot

A Laravel and React chatbot that streams AI responses from Google Gemini. The interface is rendered with Inertia and built with Vite.

## Requirements

- PHP 8.3 or newer
- Composer
- Node.js and npm
- A Google Gemini API key

## Setup

1. Create the local environment file:

   ```bash
   cp .env.example .env
   ```

2. Create the SQLite database file if it does not exist, then configure the Gemini API key in `.env`:

   ```bash
   php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
   ```

   Set `GEMINI_API_KEY` to your key. The default model is `gemini-2.5-flash`; set `GEMINI_MODEL` in `.env` to override it. Keep real API keys in `.env` and do not commit them.

3. Run the project setup script:

   ```bash
   composer run setup
   ```

   This installs PHP and JavaScript dependencies, generates the Laravel application key, runs database migrations, and builds the frontend assets.

## Run the app

Start the Laravel server, queue listener, log viewer, and Vite development server together:

```bash
composer run dev
```

Open [http://localhost:8000](http://localhost:8000). Leave the command running while using the app; press `Ctrl+C` to stop the development processes.

## Useful commands

Build production frontend assets:

```bash
npm run build
```

Run the test suite:

```bash
composer run test
```
