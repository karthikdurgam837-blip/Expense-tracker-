# InsightSpend: AI Expense Tracker

**Created by D Karthikeya**

InsightSpend is a professional, full-stack personal finance application designed to turn raw transaction data into meaningful financial intelligence. Built with React, Express, and Google Gemini AI, it helps users track, categorize, and visualize their spending with an automated "Simulation Mode" for data science analysis.

## 🚀 Key Features

- **AI Financial Insights**: Uses Google Gemini to detect spending patterns and provide personalized advice.
- **Dynamic Dashboards**: Interactive charts (Recharts) for category distribution and monthly trends.
- **Simulation Engine**: One-click generation of a month's worth of synthetic data for testing and analysis.
- **Responsive Management**: Full CRUD capabilities for income and expenses with real-time balance calculations.
- **Glass-Morphism UI**: A high-end, minimal interface optimized for both desktop and mobile.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express (serving as the application orchestrator).
- **AI**: Google Generative AI (Gemini 3 Flash).
- **Visualization**: Recharts, Lucide Icons.
- **Utilities**: date-fns, clsx, tailwind-merge.

## 📂 Project Structure

- `src/components/`: Reusable UI components.
- `src/lib/`: Custom utility functions for formatting and styling.
- `src/types.ts`: Centralized TypeScript definitions.
- `server.ts`: Full-stack entry point managing Vite middleware.

## 📖 How to Run

1. Ensure `GEMINI_API_KEY` is set in your environment.
2. Run `npm run dev` to start the integrated server.
3. Use the "Simulation Mode" button on the dashboard to populate initial data.

## 📊 Data Science Insights

The app performs:
- **Aggregation**: Grouping by category and time.
- **Trend Analysis**: Daily and weekly spending velocity.
- **Categorization**: Automated mapping of transactions to financial sectors.
