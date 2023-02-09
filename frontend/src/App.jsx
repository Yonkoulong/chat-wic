import React, { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// import { ProtectedRoute } from './shared/HOC'
import { AuthView } from '@/pages/Auth';

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello</div>
  },
  {
    path: "/signup",
    element: <AuthView />
  },
  {
    path: "/signin",
    element: <AuthView />
  }

])

function App() {

  return (
    <RouterProvider router={router}/>    
  )
}

export default App;
