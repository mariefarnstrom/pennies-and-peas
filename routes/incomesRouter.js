import express from 'express';
import { incomes } from '../data/store.js';

const router = express.Router();


router.post('/', (req, res) => {
    // POST data
    const incomeAmount = Number(req.body.income);
    if(!isNaN(incomeAmount)) {
        incomes.push({ amount: incomeAmount });
    }

    console.log('Received POST /income: ', incomeAmount);

    // send JSON response
    // res.status(200).json({
    //     message: 'POST request received',
    //     receivedData: body
    // });

    // res.redirect('/summary');
});

export default router