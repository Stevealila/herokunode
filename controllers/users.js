import express from "express"
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import passport from 'passport'

const router = express.Router()

router.get('/login', (req, res) => res.render('login'))
router.get('/register', (req, res) => res.render('register'))

router.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/' }))


router.post('/register', async (req, res) => {

    const { username, email, pwd, pwdConf } = req.body

    // VALIDATIONS:

    const errors = []

    // passwords not matching?
    if(pwd !== pwdConf) errors.push(`Passwords don't match`)
    
    // email exists?
    const emailExists = await User.findOne({ email })
    if(emailExists) errors.push(`Email Already exists!`)
    
    if(errors.length > 0) res.redirect('/users/register', {message: "Recheck email or password"})


    // REGISTRATION:

    const password = await bcrypt.hash(pwd, 12)
    let user = new User({ username: username, email:email, password:password })

    try {
        await user.save()
        res.redirect('/users/login')
    } catch {
        res.status(500).redirect('/', { message: 'registration failed, try again later.' })
    }

})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

export default router