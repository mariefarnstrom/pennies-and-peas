import express from 'express';
import { updateIncomes } from '../utils/budgetUtils.js';

const router = express.Router();

router.post('/', (req, res) => {
  const allIncomes = req.body.incomes;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const updates = [];

  for (const key in allIncomes) {
    const amount = Number(allIncomes[key]);
    if (!isNaN(amount)) {
      updates.push({
        source: key,
        amount
      });
    }
  }

  updateIncomes(year, month, updates);

  return res.status(204).end();
});

export default router;







// import express from 'express';
// import { incomes } from '../data/store.js';

// const router = express.Router();


// router.post('/', (req, res) => {
//     // POST data
//     const incomeAmount = Number(req.body.income);
//     if(!isNaN(incomeAmount)) {
//         incomes.push({ amount: incomeAmount });
//     }

//     console.log('Received POST /income: ', incomeAmount);

//     // send JSON response
//     // res.status(200).json({
//     //     message: 'POST request received',
//     //     receivedData: body
//     // });

//     // res.redirect('/summary');
// });

// export default router