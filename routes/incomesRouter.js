import express from 'express';
import { updateIncomes } from '../utils/budgetUtils.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    const allIncomes = req.body.incomes ?? {};

    // Get current year and month to store data per month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const updates = [];
    
    for (const key in allIncomes) {
      const amount = Number(allIncomes[key]);
      if (Number.isFinite(amount) && amount >= 0) {
        updates.push({
          source: key,
          amount
        });
      }
    }

    updateIncomes(year, month, updates);

    res.status(204).end();

  } catch(err) {
    next(err)
}

});

export default router;
