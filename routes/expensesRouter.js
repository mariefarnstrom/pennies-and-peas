import express from 'express';
import { expenses } from '../data/store.js';

const router = express.Router();


router.post('/', (req, res) => {
    // POST data
    const expenseAmount = Number(req.body.expense);
    if(!isNaN(expenseAmount)) {
        expenses.push({ amount: expenseAmount });
    }

    console.log('Received POST /expenses: ', expenseAmount);

    // send JSON response
    // res.status(200).json({
    //     message: 'POST request received',
    //     receivedData: body
    // });

    res.redirect('/summary');
});


export default router