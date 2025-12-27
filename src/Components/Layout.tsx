import React, { Suspense, useState } from 'react'
import Nav from './Nav'
import Preloader from './Preloader'
import BottomNavigation from './BottomNavigation'
import Chatbot from './ChatBot'

const Footer = React.lazy(() => import('./Footer'))
const BackToTop = React.lazy(() => import('./Backtotop'))
interface LayoutProps {
    children: React.ReactNode,
}
const Layout = ({children} : LayoutProps) => {

  const [change, setChange] = useState(false)
  return (
    <div className='w-full'>
      <Preloader />
        <Nav setChange={setChange} change={change} />
        <main className={`${change ? 'mt-4' : 'mt-16'}`}>
            {children}
        </main>
        <Suspense fallback={<div className='text-red-500 animate-pulse'>loading...</div>}>
          <BackToTop />
        </Suspense>
        <Suspense fallback={<div className='text-red-400 animate-bounce'>Loading...</div>}>
        <Footer />
        </Suspense>
         <Chatbot />
        <BottomNavigation />
    </div>
  )
}

export default Layout