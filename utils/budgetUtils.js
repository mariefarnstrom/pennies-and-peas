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

  return {
    totalIncome,
    totalExpenses,
    disposable: totalIncome - totalExpenses,
    categories,
    numbers
  };
}
