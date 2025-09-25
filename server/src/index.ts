import * as express from 'express'
import * as dotenv from 'dotenv'
import logger from './logger/logger'
import employeesRouter from './routers/employees'
import invitationsRouter from './routers/invitations'

dotenv.config()

const app = express()
const PORT = process.env.PORT 

app.use(express.json())
app.use('/api/employees', employeesRouter)
app.use('/api/invitations', invitationsRouter)


app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`)
})