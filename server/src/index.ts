import * as express from 'express'
import * as dotenv from 'dotenv'
import * as cors from 'cors'
import * as helmet from 'helmet'
import logger from './logger/logger'
import employeesRouter from './routers/employees'
import invitationsRouter from './routers/invitations'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Security & CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:8080,http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or same-origin requests with no origin header
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))

app.use(express.json())
app.use('/api/employees', employeesRouter)
app.use('/api/invitations', invitationsRouter)


app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`)
})