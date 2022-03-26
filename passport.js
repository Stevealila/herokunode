import User from './models/User.js'
import bcrypt from "bcryptjs"
import { Strategy } from "passport-local"

const customizedInput = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (email, password, done) => {
    User.findOne({ email })
    .then(user => {
        if(!user){
            return done(null, false)
        }else {
            const passwordIsValid = bcrypt.compareSync(password, user.password)
            
            if(passwordIsValid){
                return done(null, user)
            }else {
                return done(null, false)
            }
        }
    })
}

export const authenticateUser = (passport) => {

    passport.use(new Strategy(customizedInput, verifyCallback))

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => User.findById(id)
    .then(user => done(null, user))
    .catch(err => console.log(err)))
}