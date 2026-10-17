import 'dotenv/config';
import express from 'express';
import pool from './db.js';
import cors from 'cors';

import { requireUser } from './middleware/auth.js';
import  projectsRouter from './routes/projects.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



app.get('/health', (req, res)=> {
    res.json({status : 'ok'});
});



app.get('/db-check', async (req, res)=> {

    try{
        const result = await pool.query('SELECT NOW()');
        res.json(result.rows[0]);

    } catch (err){
        console.log(err);
        res.status(500).json({error: err.message});
    }

});


app.get('/users', async (req, res)=>{
    try{
        const result = await pool.query('SELECT id, email, name FROM users ORDER BY id');
        res.json(result.rows);
    } catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
});


app.get('/me', requireUser, (req, res)=> {
    res.json(req.user);
});

app.use('/projects', requireUser, projectsRouter);

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
});