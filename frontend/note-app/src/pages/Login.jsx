import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Signup() {

    const [name,setName] = useState('') 
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!name || !email || !password) {
            toast.error('Please fill in all fields')
            return
        }
        
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }
        
        try{
            const response = await axios.post('http://localhost:5000/api/auth/register', 
                { name, email, password});
                
            console.log('Register response:', response.data)
            
            if(response.data.success) {
                toast.success('Account created successfully! 🎉')
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch(error) {
            console.log('Full error:', error)
            console.log('Error response:', error.response?.data)
            
            // Show the actual error message from the server
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Registration failed. Please try again.')
            }
        }
    };


  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'> 
        <div className='border shadow p-6 w-80 bg-white'> 
            <h2 className='text-2xl font-bold mb-4'>Signup</h2>
            
        <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label className='block text-gray-700' htmlFor="name">Name</label>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    className='w-full px-3 py-2 border'  
                    placeholder='Enter Username' 
                    type="text"
                    value={name}
                    required
                />
            </div>
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
            <div className='mb-4'>
                 <label className='block text-gray-700' htmlFor="password">Password</label>
                <input 
                    onChange={(e) => setPassword(e.target.value)} 
                    className='w-full px-3 py-2 border' 
                    placeholder='Enter Password (min 6 characters)' 
                    type="password"
                    value={password}
                    required
                />
            </div>
            
            {/* The button */}
            <div className='mb-4'>
                <button type='submit' className='w-full bg-teal-600 text-white py-2 hover:bg-teal-700 transition-colors'>
                    SignUp
                </button>
                <p className='text-center mt-2'>
                    Already Have Account? <a href='/login' className='text-blue-700 hover:underline'>Login</a>
                </p>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Signup