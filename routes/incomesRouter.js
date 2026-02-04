import express from 'express';
import { incomes } from '../data/store.js';

const router = express.Router();


router.post('/', (req, res) => {
    // POST data
    const body = req.body;
    incomes.push(body);

    console.log('Received POST /income with body:', body);

    // send JSON response
    res.status(200).json({
        message: 'POST request received',
        receivedData: body
    });

    // res.redirect('/summary');
});

export default router