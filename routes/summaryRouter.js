import express from 'express';
import { getSummary } from '../utils/budgetUtils.js';

const router = express.Router();


router.get('/', (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const { totalIncome, totalExpenses, disposable } = getSummary(year, month);

  res.render('summary', { totalIncome, totalExpenses, disposable });
});


export default router;


// import express from 'express';
// import { incomes, expenses } from '../data/store.js';

// const router = express.Router();

// router.get('/', (req, res) => {
//     let totalIncome = 0;
//     let totalExpenses = 0;
//     incomes.forEach(element => {
//         totalIncome += element.amount;
//     });

//     expenses.forEach(element => {
//         totalExpenses += element.amount;
//     });

//     let disposable = totalIncome - totalExpenses;

//     console.log("Income: ", totalIncome, "expenses: ", totalExpenses, "disposable: ", disposable);

//     // Pug:
//     res.render("summary", { totalIncome, totalExpenses, disposable });

//     // res.status(200).json({
//     //     message: 'Summary endpoint!'
//     // });
// });



// export default router