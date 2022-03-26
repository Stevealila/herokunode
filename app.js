import express from 'express'
import dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts'
import passport from 'passport'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import methodOverride from 'method-override'

import { dbConnection } from './db.js'
import { authenticateUser } from './passport.js'
import indexRoute from './controllers/index.js'
import userRoutes from './controllers/users.js'

const app = express()

if(process.env.NODE_ENV != 'production') dotenv.config()
dbConnection()
authenticateUser(passport)

// set up views
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))

// accept form data
app.use(express.urlencoded({ extended: false, limit: '3mb' }))
app.use(express.json({ extended: false, limit: '3mb' }))

// sessions and passport
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// routes
app.use('/', indexRoute)
app.use('/users', userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT)