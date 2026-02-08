import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data');

function getFilePath(year, month) {
  return path.join(dataDir, `budget-${year}-${month}.json`);
}

export function loadMonth(year, month) {
  const filePath = getFilePath(year, month);

  if (!fs.existsSync(filePath)) {
    return { incomes: [], expenses: [] };
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function saveMonth(year, month, data) {
  const filePath = getFilePath(year, month);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function addExpense(year, month, expense) {
  const data = loadMonth(year, month);
  data.expenses.push({ id: Date.now(), ...expense });
  saveMonth(year, month, data);
}

export function addIncome(year, month, income) {
  const data = loadMonth(year, month);
  data.incomes.push({ id: Date.now(), ...income });
  saveMonth(year, month, data);
}

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
  other: 5
};

const budgetMessages = {
  housing: "Too much on housing!",
  loans: "Too much on loans!",
  utilities: "Too much on utilities!",
  insurance: "Too much on insurance!",
  transportation: "Too much on transportation!",
  groceries: "Too much on groceries!",
  clothing: "Too much on clothing!",
  media: "Too much on media!",
  hobbies: "Too much on hobbies!",
  retirement: "Too much on retirement!",
  buffer: "Too much on buffer!",
  other: "Too much on other!"
}

function getAdvice(percentageOfIncome, recommendedPercentage, category) {

  if (percentageOfIncome > recommendedPercentage) {
    return budgetMessages[category];
  }
  return null;
}

export function getSummary(year, month) {
  const data = loadMonth(year, month);

  const totalIncome = data.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = {};

  data.expenses.forEach(e => {
    if (!categoryTotals[e.category]) {
      categoryTotals[e.category] = 0;
    }

    categoryTotals[e.category] += e.amount;
  });

  const categories = Object.keys(categoryTotals);
  const numbers = Object.values(categoryTotals);

  const adviceList = [];

  for (const category in categoryTotals) {
    const amount = categoryTotals[category];
    const percentageOfIncome = (amount / totalIncome) * 100;
    const recommendedPercentage = recommendedPercentages[category];

    const advice = getAdvice(
      percentageOfIncome,
      recommendedPercentage,
      category
    );

    if (advice) {
      adviceList.push({
        category,
        percentageOfIncome: percentageOfIncome.toFixed(1),
        recommendedPercentage,
        message: advice
      });
    }
  }

  return {
    totalIncome,
    totalExpenses,
    disposable: totalIncome - totalExpenses,
    categories,
    numbers,
    adviceList
  };
  
}
