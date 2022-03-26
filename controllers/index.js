import express from "express"
import { auth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', (req, res) => res.render('index'))

router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', { username: req.user.username })
})

export default router