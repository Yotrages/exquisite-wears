import React from 'react'

interface PageLoaderProps {
  message?: string
  fullPage?: boolean
}

const PageLoader: React.FC<PageLoaderProps> = ({ message = 'Loading...', fullPage = true }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {loaderContent}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {loaderContent}
    </div>
  )
}

export default PageLoader
