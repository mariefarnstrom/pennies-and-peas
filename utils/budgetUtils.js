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

  return {
    totalIncome,
    totalExpenses,
    disposable: totalIncome - totalExpenses,
    categories: Object.keys(categoryTotals),
    numbers: Object.values(categoryTotals)
  };
}
