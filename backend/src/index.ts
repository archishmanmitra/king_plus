import * as express from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT 

app.use(express.json())


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})