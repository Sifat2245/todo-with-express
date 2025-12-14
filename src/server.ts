import  express, { Request, Response } from "express"
import {Pool} from 'pg'


const app = express()
const port = 5000


//db
const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_GOtx7lUT8oCu@ep-autumn-tooth-adw2g31y-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async () =>{
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
        `)
}

initDB()


app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('creating a server with express')
})

app.post('/', (req: Request, res: Response) =>{
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: 'api working'
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})