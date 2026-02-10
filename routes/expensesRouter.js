import express from 'express';
import { updateExpenses } from '../utils/budgetUtils.js';

const router = express.Router();

router.post('/', (req, res) => {
  const allExpenses = req.body.expenses;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const updates = [];

  for (const key in allExpenses) {
    const amount = Number(allExpenses[key]);
    if (!isNaN(amount)) {
      updates.push({
        category: key,
        amount
      });
    }
  }

  updateExpenses(year, month, updates);

  res.redirect('/summary');
});

export default router;







// import express from 'express';
// import { expenses } from '../data/store.js';

// const router = express.Router();


// router.post('/', (req, res) => {
//     // POST data
//     // const expenseAmount = Number(req.body.expenses);
//     const allExpenses = req.body.expenses;
//     for (var key in allExpenses) {
//         const expenseAmount = Number(allExpenses[key])

//         if(!isNaN(expenseAmount)) {
//             expenses.push({ category: key, amount: expenseAmount });
//         }
//     }

    

//     console.log('Received POST /expenses: ', allExpenses);

//     // send JSON response
//     // res.status(200).json({
//     //     message: 'POST request received',
//     //     receivedData: body
//     // });

//     res.redirect('/summary');
// });


// export default router