import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data');

// placement of file
function getFilePath(year, month) {
  return path.join(dataDir, `budget-${year}-${month}.json`);
}

// Load or create new month
export function loadMonth(year, month) {
  const filePath = getFilePath(year, month);

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    if (!fs.existsSync(filePath)) {
      const emptyMonth = {
        incomes: [],
        expenses: []
      };

      fs.writeFileSync(filePath, JSON.stringify(emptyMonth, null, 2));

      return { ...emptyMonth, created: true };
    }

    const raw = fs.readFileSync(filePath, 'utf-8');

    // extra protection
    if (!raw) throw new Error("File empty");

    const data = JSON.parse(raw);

    return {
      incomes: data.incomes || [],
      expenses: data.expenses || [],
      created: false
    };

  } catch (error) {
    console.error("LOAD MONTH FAILED:", error);

    return {
      incomes: [],
      expenses: [],
      corrupted: true,
      created: false
    };
  }
}


// Save month budget
function saveMonth(year, month, data) {
  const filePath = getFilePath(year, month);

  const cleanData = {
    incomes: data.incomes,
    expenses: data.expenses
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Add expenses
export function setExpenses(year, month, expenses) {
  const data = loadMonth(year, month);
  data.expenses = expenses.map(e => ({
    id: Date.now() + Math.random(),
    ...e
  }));
  saveMonth(year, month, data); 
}

// Add income
export function setIncomes(year, month, incomes) {
  const data = loadMonth(year, month);
  data.incomes = incomes.map(i => ({
     id: Date.now() + Math.random(),
    ...i
  }));
  saveMonth(year, month, data);
}

// Numbers used to calculate budget
const recommendedPercentages = {
  housing: 35,
  loans: 10,
  utilities: 10,
  insurance: 5,
  transportation: 10,
  groceries: 15,
  clothing: 5,
  media: 5,
  hobbies: 5,
  retirement: 10,
  buffer: 5,
  other_savings: 5
};

// Recommended percentage distribution depending on income level
const highIncomeBudget = {
  housing: 32,
  loans: 8,
  utilities: 6,
  insurance: 4,
  transportation: 5,
  groceries: 12,
  clothing: 4,
  media: 3,
  hobbies: 6,
  retirement: 10,
  buffer: 6,
  other_savings: 4
};

const mediumIncomeBudget = {
  housing: 38,
  loans: 9,
  utilities: 7,
  insurance: 5,
  transportation: 6,
  groceries: 14,
  clothing: 4,
  media: 2,
  hobbies: 5,
  retirement: 4,
  buffer: 4,
  other_savings: 2
};

const lowIncomeBudget = {
  housing: 40,
  loans: 10,
  utilities: 8,
  insurance: 6,
  transportation: 6,
  groceries: 15,
  clothing: 4,
  media: 1,
  hobbies: 5,
  retirement: 1,
  buffer: 3,
  other_savings: 1
}

const veryLowIncomeBudget = {
  housing: 45,
  loans: 0,
  utilities: 8,
  insurance: 5,
  transportation: 5,
  groceries: 18,
  clothing: 3,
  media: 1,
  hobbies: 3,
  retirement: 0,
  buffer: 2,
  other_savings: 10
};

function getIncomeLevel(income) {
  if (income < 13000) return 'veryLow';
  if (income < 18000) return 'low';
  if (income < 30000) return 'medium';
  return 'high';
}

function getBudgetNumbers(incomeLevel) {
  switch (incomeLevel) {
    case 'veryLow':
      return veryLowIncomeBudget;
    case 'low':
      return lowIncomeBudget;
    case 'medium':
      return mediumIncomeBudget;
    case 'high':
      return highIncomeBudget;
    default:
      return mediumIncomeBudget;
  }
}

function getBudgetProposal(totalIncome){
  const incomeLevel = getIncomeLevel(totalIncome);
  const percentageBudget = getBudgetNumbers(incomeLevel);
  const budget = {};

  // Convert percentages to SEK
  for (const category in percentageBudget) {
    budget[category] = Math.round((percentageBudget[category] / 100) * totalIncome);
  }
  return budget;
}

const budgetMessages = {
  housing: "You have exceeded the recommended amount on housing. Are you eligible for <a href='https://www.forsakringskassan.se/privatperson/arbetssokande/bostadsbidrag'>housing allowance</a>?",
  loans: "Your loans seem to take up a lot of economic space. Your bank might be able to help consolidate your loans into one place",
  utilities: "Your utility costs are high. Consider energy-saving measures like LED bulbs, smart thermostats, or switching providers.",
  insurance: "Your insurance expenses are high. We recommend you compare insurance companies at <a href='https://www.konsumenternas.se/'>konsumenternas.se</a> to see if you could lower your premiums",
  transportation: "Your transportation fees seems like a challenge. Is there a possibility to use public transport or walk/cycle more? Remember if you are retired or a student you are probably entitled to discount. Are you using these?",
  groceries: "Food prices are high right now. Meal planning and cheap recipes found on sites like <a href='https://undertian.com/'>Under tian</a> might help. Can you do your weekly shopping in discounted stores like Willys or Lidl? <a href='https://www.matsmart.se/'>Matsmart</a> is also a place to find good deals.",
  clothing: "Your clothing expenses are high. Consider buying second-hand or waiting for sales.",
  media: "Your subscriptions/media costs are an action movie! Review which subscriptions you actually use and cancel extras. Can you share subscription fees with friends/ family? ",
  hobbies: "You are spending more than suggested on hobbies. There are resources available to lower monthly fees for children's sport. Read more at <a href='https://majblomman.se/'>Majblomman</a> and check out <a href='https://www.fritidsbanken.se/'>Fritidsbanken</a>! For crafts there are a lot of groups that sell old equipment. Check <a href='https://www.facebook.com/marketplace/?locale=sv_SE'>marketplace</a>, social media interests groups etc. Is a gym membership necessary or can you find a cheaper alternative/ gym?",
  retirement: "Your retirement savings are high relative to your income, saving is good but make it achievable. Ensure it's sustainable given your other expenses. Maybe call your municipal for financial guidance if you wish. Your bank might also be helpful to make sense of a pension plan!",
  buffer: "Your emergency savings contribution is above the recommended percentage. Is this what you need to put your finances into now? Check if you can balance with other essential expenses.",
  other_savings: "Your percentage here is high compared to your overall spending/expenses. Could you review miscellaneous expenses and cut unnecessary costs?"
}

function getAdvice(percentageOfIncome, recommendedPercentage, disposable, totalIncome, savings, category) {

  if (percentageOfIncome > recommendedPercentage && disposable < totalIncome * 0.2 && savings / totalIncome < 0.2) {
    return budgetMessages[category];
  }
  return null;
}

// Summary
export function getSummary(year, month) {
  const data = loadMonth(year, month);

  if (data.corrupted) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      disposable: 0,
      categories: [],
      numbers: [],
      adviceList: [],
      proposalCategories: [],
      proposalNumbers: [],
      corrupted: true,
      created: false
    };
  }

  // Calculate total incomes and expenses
  const totalIncome = data.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);
  const disposable = totalIncome - totalExpenses;

  // Group expenses by category
  const categoryTotals = {};

  data.expenses.forEach(e => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const savings =
  (categoryTotals.retirement || 0) +
  (categoryTotals.buffer || 0) +
  (categoryTotals.other_savings || 0);

  // Prepare data for pie chart
  const categories = Object.keys(categoryTotals);
  const numbers = Object.values(categoryTotals);

  const adviceList = [];

  // Compare each category against recommended percentages
  for (const category in categoryTotals) {
    const amount = categoryTotals[category];
    const percentageOfIncome = (amount / totalIncome) * 100;
    const recommendedPercentage = recommendedPercentages[category];

    const advice = getAdvice(
      percentageOfIncome,
      recommendedPercentage,
      disposable,
      totalIncome,
      savings,
      category
    );
    
    // Add advice if spending exceeds recommendation
    if (advice) {
      adviceList.push({
        category,
        percentageOfIncome: percentageOfIncome.toFixed(1),
        recommendedPercentage,
        message: advice
      });
    }
  }

  const budget = getBudgetProposal(totalIncome);

  const proposalCategories = Object.keys(budget).map(key =>
  key.replace(/_/g, ' '));
  const proposalNumbers = Object.values(budget);
  
  if (totalIncome > 15000 && savings < totalIncome * 0.05) {
    adviceList.push({message: "Your savings are currently quite low compared to your income. Even small, regular savings can provide peace of mind and a buffer for unexpected expenses. Consider setting aside a little each month — it really adds up over time!"});
  }

  if (adviceList.length < 1) {
    adviceList.push({message: "You seem to have a healthy economy. Keep it up and enjoy the peace of mind!"});
  }

  return {
    totalIncome,
    totalExpenses,
    disposable,
    categories,
    numbers,
    adviceList,
    proposalCategories,
    proposalNumbers,
    created: data.created || false,
    corrupted: data.corrupted || false
  };
  
}
export function getAvailableMonths() {
  if (!fs.existsSync(dataDir)) {
    return [];
  }

  return fs.readdirSync(dataDir)
    .filter(file => file.startsWith('budget-') && file.endsWith('.json'))

    .map(file => {
      const [, year, monthWithExt] = file.split('-');
      const month = monthWithExt.replace('.json', '');

      return { year, month };
    })
    // sort chronologically-- overview for future
    .sort((a, b) =>
      a.year === b.year
        ? a.month.localeCompare(b.month)
        : a.year.localeCompare(b.year)
    );
}

export function updateExpenses(year, month, newExpenses) {
  const data = loadMonth(year, month);

  for (const newItem of newExpenses) {
    const existing = data.expenses.find(
      e => e.category === newItem.category
    );

    // If the category already exists for this month, update its amount. Otherwise, create a new expense entry.
    if (existing) {
      existing.amount = newItem.amount;
    } else {
      data.expenses.push({
        id: Date.now() + Math.random(),
        ...newItem
      });
    }
  }

  saveMonth(year, month, data);
}

export function updateIncomes(year, month, newIncomes) {
  const data = loadMonth(year, month);

  for (const item of newIncomes) {
    const existing = data.incomes.find(
      i => i.source === item.source
    );

    if (existing) {
      existing.amount = item.amount;
    } else {
      data.incomes.push({
        id: Date.now() + Math.random(),
        ...item
      });
    }
  }

  saveMonth(year, month, data);
}





