[README.md](https://github.com/user-attachments/files/30374153/README.md)
# Ai-investment-agent
markdown# AI Investment Research Agent

A web app that takes a company name and returns a structured investment analysis — summary, strengths, weaknesses, opportunities, risks, and an INVEST/PASS call with a confidence score — powered by Gemini.

## Overview

You type a company name, hit Analyze, and within a few seconds you get back a full breakdown: what the company does, its SWOT, and whether the model thinks it's worth investing in (with reasoning). It's built on Next.js with the App Router, TypeScript throughout, and Tailwind for styling.

The project focuses on one complete user flow rather than implementing many incomplete features. The goal was to build a clean, maintainable application with a simple user experience.

## Architecture

```text
Browser (Next.js)
      │
      ▼
POST /api/analyze
      │
      ▼
LangGraph Workflow
      │
      ├── Research Agent
      ├── Risk Agent
      └── Decision Agent
      │
      ▼
Gemini 2.5 Flash
      │
      ▼
Structured JSON Response
      │
      ▼
Frontend Components
```
'''
Browser (page.tsx)
|
v
POST /api/analyze  ---->  Gemini API (gemini-2.5-flash)
|                          |
<--------------------------
|
Renders: Summary, SWOT cards, Decision card
'''
The flow is straightforward on purpose:

1. User types a company name and clicks Analyze (or hits Enter).
2. The frontend POSTs to `/api/analyze`.
3. The route validates the input, builds a prompt asking Gemini to return strict JSON (summary, strengths, weaknesses, opportunities, risks, decision, confidence, reasoning), and parses the response.
4. The result comes back to the frontend and renders through a handful of reusable components.

The application follows a multi-stage workflow. The Research Agent gathers company information, the Risk Agent identifies strengths and weaknesses, and the Decision Agent generates the final recommendation. To reduce API usage, these stages currently execute within a single Gemini request while maintaining a structured output.

I originally planned this as two separate pieces — a "Research Agent" that generates the SWOT, and a separate "Decision Agent" that reads the research and makes the INVEST/PASS call. I built it that way conceptually first, but combined them into a single Gemini call in the actual implementation, mainly to avoid burning through the free-tier rate limit twice per analysis. The prompt still asks for both pieces of output in one structured JSON response, so the separation exists in the data shape even though it's one API call under the hood.

## Features

- Company input with Enter-key support, disabled state while loading
- AI-generated company summary
- SWOT breakdown: strengths, weaknesses, opportunities, risks
- INVEST / PASS decision with a confidence percentage and written reasoning
- Skeleton loading state instead of a plain spinner
- Error state with a retry button (not just a dead-end red message)
- Responsive layout — single column on mobile, grid on desktop
- Componentized UI: `Card`, `BulletList`, `DecisionCard`, `LoadingState`, `ErrorState`

## Tech Stack

- **Next.js 16** (App Router)
- LangChain
- LangGraph
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini API** (`gemini-2.5-flash`) via `@google/generative-ai`
- **Node.js** runtime

## Installation

```bash
git clone <your-repo-url>
cd ai-investment-agent
npm install


```

Create a `.env.local` file in the project root:
GEMINI_API_KEY=your_gemini_api_key_here

Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), type a company name, and click Analyze.

## Demo

1. Enter a company name.
2. Click Analyze.
3. Wait for the AI-generated report.
4. Review the SWOT analysis and investment recommendation.

## Design Decisions (and what actually happened)

A few of these came from running into real problems, not just upfront planning:

**Model choice.** I started with `gemini-1.5-flash`, which immediately 404'd — turns out it's been deprecated. Switched to `gemini-2.0-flash`, which connected fine but returned a 429 with a `limit: 0` quota error. After digging into it, both 1.5 and 2.0 Flash have been pulled from the free tier as of 2026 — the free tier now only covers 2.5 Flash and Flash-Lite. Switched to `gemini-2.5-flash` and it worked immediately.

**Single API call instead of two agents.** As mentioned above, I collapsed the Research Agent and Decision Agent into one prompt/one call. Two calls would be cleaner architecturally and easier to test independently, but doubles API usage against a free-tier quota I'd already hit once.

**Plain `useState`, no state library.** The app is one page with a linear flow: input → loading → result or error. Redux or Zustand would be solving a problem I don't have.

**Tailwind over CSS modules.** Mainly for speed — iterating on responsive breakpoints (`sm:`) and conditional styling (green for INVEST, red for PASS) is faster with utility classes than maintaining separate stylesheets.

**Component split.** `page.tsx` originally had everything inline, including two small helper functions defined at the bottom of the file. I pulled `Card`, `BulletList`, `DecisionCard`, `LoadingState`, and `ErrorState` into their own files in `/components` so the page itself just orchestrates state and data flow, and each piece of UI can be reasoned about on its own.

## What I'd Fix With More Time

- Actually split the Research and Decision agents into two real calls, with the Decision Agent taking the Research Agent's output as input — closer to the original design, now that I understand the rate limit tradeoffs.
- Pull in a real financial data source (something like Alpha Vantage or Finnhub) so the analysis isn't relying purely on Gemini's training data, which has a cutoff and no awareness of current stock price, recent earnings, or news.
- Add retry-with-backoff for the 429 errors instead of just surfacing "Analysis failed" to the user — I hit this rate limit error firsthand during development and currently the UI just shows a generic failure.
- Cache repeated analyses for the same company for a short window, since hitting "Analyze" twice on the same company currently burns two full API calls for an identical-ish result.
- Stream the response token-by-token instead of waiting for the full JSON blob, so the UI feels faster.
- Add a couple of basic tests around the API route's input validation and JSON parsing — right now if Gemini wraps the JSON in markdown fences or returns something slightly malformed, the route just throws.

## Known Limitations

- This is not financial advice. The confidence score is a number an LLM generated based on pattern-matching over text, not a statistically grounded estimate.
- No real-time data — Gemini doesn't know today's stock price or this morning's news.
- The same company can get a different decision on a different run, since LLM outputs aren't fully deterministic.
- No history or persistence — every analysis is a fresh, stateless request.

## Challenges Faced

During development I encountered several issues:

- Gemini model deprecations while testing older Flash models.
- API rate limits on the free tier.
- Parsing JSON reliably from LLM responses.
- Keeping the UI responsive while waiting for long AI responses.

These issues influenced some of the implementation decisions, particularly around using a single API request and adding response validation.
