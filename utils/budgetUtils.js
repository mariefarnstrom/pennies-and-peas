import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data');

/* 1️⃣ Hjälpfunktion: var ska filen ligga? */
function getFilePath(year, month) {
  return path.join(dataDir, `budget-${year}-${month}.json`);
}

/* 2️⃣ Ladda (eller skapa) en månad */
export function loadMonth(year, month) {
  // se till att data-mappen finns
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const filePath = getFilePath(year, month);

  if (!fs.existsSync(filePath)) {
    const emptyMonth = {
      incomes: [],
      expenses: []
    };

    fs.writeFileSync(
      filePath,
      JSON.stringify(emptyMonth, null, 2)
    );

    return emptyMonth;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/* 3️⃣ Spara en månad */
function saveMonth(year, month, data) {
  const filePath = getFilePath(year, month);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/* 4️⃣ Lägg till expense */
export function setExpenses(year, month, expenses) {
  const data = loadMonth(year, month);
  data.expenses = expenses.map(e => ({
    id: Date.now() + Math.random(),
    ...e
  }));
  saveMonth(year, month, data); 
}

/* 5️⃣ Lägg till income */
export function setIncomes(year, month, incomes) {
  const data = loadMonth(year, month);
  data.incomes = incomes.map(i => ({
     id: Date.now() + Math.random(),
    ...i
 }));
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
  other: 4
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
  other: 2
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
  other: 1
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
  other: 10
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
  const budget = getBudgetNumbers(incomeLevel);
  return budget;
}


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

/* 6️⃣ Summering */
export function getSummary(year, month) {
  const data = loadMonth(year, month);

  const totalIncome = data.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = {};

  data.expenses.forEach(e => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
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

  const budget = getBudgetProposal(totalIncome);

  const proposalCategories = Object.keys(budget);
  const proposalNumbers = Object.values(budget); 
  console.log(getBudgetProposal)

  return {
    totalIncome,
    totalExpenses,
    disposable: totalIncome - totalExpenses,
    categories,
    numbers,
    adviceList,
    proposalCategories,
    proposalNumbers
  };
  
}
