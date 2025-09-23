import * as express from 'express'
import * as dotenv from 'dotenv'
import logger from './logger/logger'

dotenv.config()

const app = express()
const PORT = process.env.PORT 

app.use(express.json())


app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`)
})