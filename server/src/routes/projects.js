import { Router } from "express";
import pool from "../db.js";

const router = Router();

// POST /projects : the creator becomes the manager
router.post('/', async (req, res)=> {
    const { name, totalBudget } = req.body;

    if(typeof name !== 'string' || name.trim()===''){
        return res.status(400).json({error: 'Project name is required'});
    }
    if(!Number.isInteger(totalBudget) || totalBudget<=0){
        return res.status(400).json({error: 'totalBudget must be a positive whole number'});
    }

    try{
        const result = await pool.query(
            `INSERT INTO projects (name, total_budget, manager_id)
             VALUES ($1, $2, $3)
             RETURNING id, name, total_budget, manager_id`,
            [name.trim(), totalBudget, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
});


// GET /projects : projects I manage or belong to
router.get('/', async (req, res)=> {
    try{
        const result = await pool.query(
            `SELECT p.id, p.name, p.total_budget, p.manager_id,
                CASE WHEN p.manager_id = $1 THEN 'manager' ELSE 'member' END AS role
            FROM projects p
            WHERE p.manager_id = $1
                OR EXISTS(
                    SELECT 1 FROM project_members pm
                    WHERE  pm.project_id = p.id AND pm.user_id = $1
                )
            ORDER BY p.id DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch(err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
});

export default router;