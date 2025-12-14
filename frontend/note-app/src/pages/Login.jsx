import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Login() {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!email || !password) {
            toast.error('Please fill in all fields')
            return
        }
        
        try{
            const response = await axios.post('http://localhost:5000/api/auth/login', 
                { email, password});
                
            console.log('Login response:', response.data)
            
            if(response.data.success) {
                localStorage.setItem("token", response.data.token)
                toast.success('Login successful! 🎉')
                setTimeout(() => {
                    navigate('/')
                }, 1000)
            }
        } catch(error) {
            console.log('Full error:', error)
            console.log('Error response:', error.response?.data)
            
            // Show the actual error message from the server
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Login failed. Please try again.')
            }
        }
    };


  return (
    <div className='flex justify-center items-center min-h-screen bg-slate-900'> 
        <div className='border shadow rounded-2xl p-6 w-80 bg-white'> 
            <h2 className='text-2xl font-bold mb-4'>Login</h2>
            
        <form onSubmit={handleSubmit}>
          {/* Email field */}
            <div className='mb-4'>
                 <label className='block text-gray-700' htmlFor="email">Email</label>
                <input 
                    onChange={(e) => setEmail(e.target.value)} 
                    className='w-full px-3 py-2 border'
                    placeholder='Enter Email' 
                    type="email"
                    value={email}
                    required
                />
            </div>
            {/* Password field */}
            <div className='mb-4'>
                 <label className='block text-gray-700' htmlFor="password">Password</label>
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    className='w-full px-3 py-2 border' 
                    placeholder='Enter Password' 
                    type="password"
                    value={password}
                    required
                />
            </div>
            
            {/* The button */}
            <div className='mb-4'>
                <button type='submit' className='w-full bg-teal-600 text-white py-2 hover:bg-teal-700 transition-colors'>
                    Login
                </button>
                <p className='text-center mt-2'>
                    Don't Have Account? <a href='/register' className='text-blue-700 hover:underline'>Signup</a>
                </p>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login