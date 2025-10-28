import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import logger from './logger/logger'
import employeesRouter from './routers/employees'
import attendanceRouter from './routers/attendance'
import usersRouter from './routers/users'
import invitationsRouter from './routers/invitations'
import authRouter from './routers/auth'
import leaveRouter from './routers/leave'
import roleAssignmentRouter from './routers/roleAssignment'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Security & CORS
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080', 'http://localhost:5173' , 'https://king-plus-1.onrender.com')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

app.use(helmet())
app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
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

// Health check endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    port: PORT 
  })
})

app.use('/api/employees', employeesRouter)
app.use('/api/attendance', attendanceRouter)
app.use('/api/users', usersRouter)
app.use('/api/invitations', invitationsRouter)
app.use('/api/auth', authRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/roles', roleAssignmentRouter)


app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT}`)
})
