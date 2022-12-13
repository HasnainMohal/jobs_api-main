require('dotenv').config()
require('express-async-errors')
const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const express = require('express')
const app = express()

// connectDB && middlewares
const connectDB = require('../db/connect')
const authenticationUser = require('../middleware/authentication')

//routers
const authRouter = require('../routes/auth')
const jobRouter = require('../routes/jobs')

// error handler
const notFoundMiddleware = require('../middleware/not-found')
const errorHandlerMiddleware = require('../middleware/error-handler')

app.use(express.json())
// extra packages

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

//Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

//View Jobs WithOut Auth
app.get('/api/v1/public', async (req, res) => {
  const jobs = await Job.find().sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
})

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationUser, jobRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error)
  }
}

start()
