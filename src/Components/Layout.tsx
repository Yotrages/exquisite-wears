import React, { Suspense, useState } from 'react'
import Nav from './Nav'
import Preloader from './Preloader'
import BottomNavigation from './BottomNavigation'
import Chatbot from './ChatBot'

const Footer = React.lazy(() => import('./Footer'))
const BackToTop = React.lazy(() => import('./Backtotop'))

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [change, setChange] = useState(false)

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <Preloader />
      <Nav setChange={setChange} change={change} />
      <main className={`flex-1 ${change ? 'mt-4' : 'mt-4'}`}>
        {children}
      </main>
      <Suspense fallback={null}>
        <BackToTop />
      </Suspense>
      <Suspense fallback={<div className="bg-black h-40" />}>
        <Footer />
      </Suspense>
      <Chatbot />
      <BottomNavigation />
    </div>
  )
}

export default Layout
