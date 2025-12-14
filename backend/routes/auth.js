import express from 'express'
import { supabase } from '../supabaseClient.js'

const router = express.Router()

router.post('/register', async(req, res) => {
    try {
        const {name, email, password} = req.body;
        
        console.log('Registration attempt:', { name, email })
        
        // Sign up user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name  // Store name in user metadata
                }
            }
        })
        
        if (error) {
            console.log('Registration error:', error.message)
            return res.status(401).json({success: false, message: error.message})
        }
        
        if (data.user) {
            console.log('User created successfully:', data.user.email)
            return res.status(200).json({
                success: true, 
                message: "Account Created Successfully"
            })
        } else {
            console.log('No user data returned')
            return res.status(500).json({success: false, message: "Registration failed"})
        }
        
    } catch(error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Error in Adding User"})
    }
})

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt for:', email)
        
        // Sign in user with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        
        if (error) {
            console.log('Login error:', error.message)
            
            // Better error messages
            if (error.message.includes('Email not confirmed')) {
                return res.status(401).json({
                    success: false, 
                    message: 'Please confirm your email before logging in. Check your inbox.'
                })
            }
            
            return res.status(401).json({success: false, message: error.message})
        }
        
        if (data.user) {
            console.log('Login successful for:', data.user.email)
            return res.status(200).json({
                success: true, 
                token: data.session.access_token,  // Supabase JWT token
                user: { 
                    name: data.user.user_metadata.name || data.user.email,
                    email: data.user.email 
                }, 
                message: "Login Successfully"
            })
        } else {
            console.log('No user data returned')
            return res.status(401).json({success: false, message: 'Login failed'})
        }
        
    } catch(error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Error in Login server"})
    }
})

// Optional: Logout endpoint
router.post('/logout', async(req, res) => {
    try {
        const { error } = await supabase.auth.signOut()
        
        if (error) {
            return res.status(500).json({success: false, message: error.message})
        }
        
        return res.status(200).json({success: true, message: "Logged out successfully"})
    } catch(error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Error in logout"})
    }
})

// Optional: Get current user
router.get('/user', async(req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')
        
        if (!token) {
            return res.status(401).json({success: false, message: 'No token provided'})
        }
        
        const { data: { user }, error } = await supabase.auth.getUser(token)
        
        if (error || !user) {
            return res.status(401).json({success: false, message: 'Invalid token'})
        }
        
        return res.status(200).json({
            success: true, 
            user: {
                name: user.user_metadata.name || user.email,
                email: user.email
            }
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).json({success: false, message: "Error fetching user"})
    }
})

export default router