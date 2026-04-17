# Expense Tracker: Interview Preparation Guide

This document prepares you to showcase this project for Data/Business Analyst roles.

## ❓ Common Interview Questions

### 1. What was the goal of this project?
**Answer**: To build an "Intelligence-First" financial tracker. Unlike basic loggers, InsightSpend uses data visualization and AI to provide proactive financial feedback, helping users reduce "economic leakages" in their daily habits.

### 2. Why did you choose React over traditional Python for this?
**Answer**: While Python is great for heavy lifting, I wanted to build a "Product" that people can actually use. By building a Full-Stack web app, I demonstrated the ability to deploy data-driven insights into a production-ready interface.

### 3. How do you ensure data quality in your application?
**Answer**: I implemented strict data typing and a centralized cleaning process. On the frontend, forms validate numerical inputs and dates before they ever hit the "state," preventing the "Garbage In, Garbage Out" problem commonly found in financial apps.

### 4. Explain the AI integration logic.
**Answer**: I used Gemini 3 Flash to scan raw JSON strings of transaction data. I carefully prompt the model to act as a "Financial Analyst," ensuring the output is structured as JSON so my app can render specialized UI cards (warning/success/info) dynamically.

### 5. What is "Simulation Mode" and why is it useful?
**Answer**: It's a synthetic data engine. In data science, you rarely have real users at day one. Simulation mode allows me to test the app's scalability and stress-test the dashboards with varied data distributions before going live.

## 💡 Key Metrics to Discuss
- **Conversion**: How raw amount + category becomes a "Balance Meter".
- **Trend Velocity**: Calculating the slope of daily spending to predict "Overdraft Risks".
- **Distribution Entropy**: Analyzing if spending is too concentrated in one category (Shopping/Others).
