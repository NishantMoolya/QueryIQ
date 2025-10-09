import React from 'react'
import {Button} from '../components/ui/button'
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/',{ replace:true });
    }

  return (
    <div className='flex flex-col justify-center items-center p-4'>
        <p className='font-bold capitalize text-3xl text-indigo-500 mb-10 text-center'>404 Error Page</p>
        <p className='font-bold capitalize text-3xl text-indigo-500 mb-10 text-center'>I think you are lost, go to home page</p>
        <Button onClick={handleClick}>Go to home</Button>
    </div>
  )
}

export default Error