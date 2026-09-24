import express from 'express';
import { updateExpenses } from '../utils/budgetUtils.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  try {
    const allExpenses = req.body.expenses ?? {};

    // Get current year and month to store data per month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const updates = [];

    for (const key in allExpenses) {
      const amount = Number(allExpenses[key]);
      if (Number.isFinite(amount) && amount >= 0) {
        updates.push({
          category: key,
          amount
        });
      }
    }

    updateExpenses(year, month, updates);

    res.redirect('/summary');

  } catch (err) {
    next(err);
  }
});

export default router;

