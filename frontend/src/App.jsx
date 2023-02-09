import React, { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// import { ProtectedRoute } from './shared/HOC'
import { Signup } from '@/pages/Auth/Signup';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello</div>
  },
  {
    path: "/signup",
    element: <Signup />
  }

])

function App() {

  return (
    <RouterProvider router={router}/>    
  )
}

export default App;
