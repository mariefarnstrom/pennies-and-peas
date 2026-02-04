import express from 'express';
import { incomes, expenses } from '../data/store.js';

const router = express.Router();

router.get('/', (req, res) => {
    let totalIncome = 0;
    let totalExpenses = 0;
    incomes.forEach(element => {
        totalIncome += element.amount;
    });

    expenses.forEach(element => {
        totalExpenses += element.amount;
    });

    let disposable = totalIncome - totalExpenses;

    console.log("Income: ", totalIncome, "expenses: ", totalExpenses, "disposable: ", disposable);

    // Pug:
    res.render("summary", { totalIncome, totalExpenses, disposable });

    // res.status(200).json({
    //     message: 'Summary endpoint!'
    // });
});



export default router