import express from 'express';
import { getSummary, getAvailableMonths } from '../utils/budgetUtils.js';

const router = express.Router();

/* aktuell månad */
router.get('/', (req, res, next) => {
  try {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const summary = getSummary(year, month);
    const months = getAvailableMonths();

    res.render('summary', {
      ...summary,
      year,
      month,
      months
    });
  } catch (err) {
    next(err)
  }
});

/* valfri månad */
router.get('/:year/:month', (req, res, next) => {
  try {
    const { year, month } = req.params;

    const summary = getSummary(year, month);
    const months = getAvailableMonths();

    res.render('summary', {
      ...summary,
      year,
      month,
      months
    });

  } catch (err) {
    next(err)
  }
});

export default router;