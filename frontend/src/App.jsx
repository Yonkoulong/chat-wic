import React, { useState } from 'react';

import { Signup } from '@/pages/Auth/signup'
// import { ProtectedRoute } from './shared/HOC'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello</div>
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/home"
  }

])

function App() {

  return (
    <RouterProvider router={router}/>    
  )
}

export default App;
