import pool from '../db.js'

export async function requireUser(req, res, next){
    const id = Number(req.header('x-user-id'));

    if(!Number.isInteger(id) || id<=0){
        return res.status(401).json({error: 'Missing or invalid x-user-id header'});
    }

    try{
        const result = await pool.query(
            'SELECT id, email, name FROM users WHERE id = $1',
            [id]
        );

        if(result.rows.length===0){
            return res.status(401).json({error: 'User not found'});
        }

        req.user = result.rows[0];
        next();
        
    } catch (err){
        console.log(err);
        res.status(500).json({error: err.message});
    }
}