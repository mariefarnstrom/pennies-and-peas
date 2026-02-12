# Budget Tracker

A simple personal budget app that lets users track incomes, expenses, and savings. Provides summaries, pie charts, and budget recommendations.

## Features

- Add multiple incomes and expenses per month
- Categorized expenses: Housing, Loans, Utilities, Insurance, Transportation, Groceries, Clothing, Media, Hobbies, Retirement, Buffer, Other savings
- Visualize spending with pie charts
- Budget proposal based on four different income levels
- Advice messages when spending exceeds recommended percentages
- View historical months and summaries

## Installation

1. Clone the repository:  
   git clone <repo-url>

    Install dependencies:
    npm install

    Start the server:
    npm start

    Open your browser at http://localhost:3000

Usage
Enter your incomes and expenses in the forms on the main page

Submit to see:

Pie chart of current expenses

Budget proposal for your income level

Advice for overspending categories

Data Storage
Monthly budgets are saved as JSON files in the data folder

Format: budget-YYYY-MM.json

Tech Stack
Node.js, Express.js

Pug templates

Chart.js for visualizations

File-based JSON storage

Error Handling
Routes wrapped in try/catch

500 errors handled globally in index.js

Local errors (e.g., corrupted budget file) handled in budgetUtils.js