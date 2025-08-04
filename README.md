# 📊 Market Seasonality Explorer

A React/Next.js application that visualizes market seasonality through a dynamic calendar UI with daily, weekly, and monthly views. It includes interactive heatmaps for volatility, liquidity indicators, and performance metrics, designed to help traders and analysts explore historical patterns.

## 🖥️ Live Demo (Video)
📹 **[Video Link Placeholder]**  
Replace this with the video recording link showcasing:
- Calendar interaction
- View switching (Daily, Weekly, Monthly)
- Tooltips, historical alerts, and visual legends
- Keyboard navigation and alert system

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/market-seasonality-explorer.git
cd market-seasonality-explorer
2. Install dependencies
bash
Copy
Edit
npm install
# or
yarn install
3. Run the development server
bash
Copy
Edit
npm run dev
# or
yarn dev
Visit http://localhost:3000 in your browser.

⚙️ Features
📅 Custom Calendar: Interactive daily, weekly, and monthly views

🌡️ Volatility Heatmap: Color-coded cells (green/yellow/red)

💧 Liquidity Indicators: Circle + mini-bar visualizations for trading volume

📈 Performance Metrics: Arrows and color-coded trends

🔔 Alert System: Visual warnings for extreme volatility or negative performance

🧠 Historical Pattern Highlighting

⌨️ Keyboard Navigation Support

📦 Libraries Used
Purpose	Library
UI & Layout	@mui/material, @emotion/react
Charts	recharts
Date Handling	date-fns
PDF/Image Export	html2canvas, jspdf

📋 Assumptions
Historical market data is pre-aggregated and provided in a structured format.

volatility, performance, and volume are available for each time interval.

Daily view supports only one day, while weekly and monthly aggregate accordingly.

🧪 Unit Tests
Test files are located in the __tests__/ folder. To run tests:

bash
Copy
Edit
npm run test
# or
yarn test
Tested Components:

Calendar Grid rendering and props

Date formatting and keyboard navigation logic

Alert threshold validations

📊 Sample Data Scenarios & Edge Cases
✅ Days/weeks/months with:

High volatility but low volume

High performance and high volume

Missing or null data

🚫 Historical pattern match with alert triggers

⚠️ Edge case: empty data object

🔗 GitHub Repository
🔗 [GitHub Repo Placeholder]
Replace with your actual GitHub repo link.

🙌 Author
Created by [Your Name] as part of a technical assignment for [Company Name].