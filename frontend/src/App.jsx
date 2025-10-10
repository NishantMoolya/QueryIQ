import React,{ lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import {  useSelector, useDispatch } from 'react-redux'
import { getUserProfile } from './redux/api/userApi'
import ProtectedRoute from './components/ProtectedRoute'
import PrivateRoute from './components/PrivateRoute'
import Error from './pages/Error'
import Dashboard from './pages/Dashboard';
import StoryReader from './pages/Story';
// import useRole from './hooks/useRole';
import Home from './pages/Home';
import Spinner from './components/loaders/Spinner';
import Navbar from './components/Navbar';
import Chat from './pages/Chat'
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));


const App = () => {

  const dispatch = useDispatch();
  const auth = useSelector(state => state.user.auth);
  // const checkRole = useRole();

  useEffect(() => {
    dispatch(getUserProfile());
  }, [auth]);

  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Suspense fallback={<div className='flex h-96 justify-center items-center'><Spinner /></div>}><Login /></Suspense>} />
        <Route path='/signup' element={<Suspense fallback={<div className='flex h-96 justify-center items-center'><Spinner /></div>}><Signup /></Suspense>} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path= '/chat' element={<Chat/>}/>
        <Route path='/story' element={<StoryReader />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  )
}

export default App