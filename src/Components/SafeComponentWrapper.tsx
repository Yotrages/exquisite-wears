import React, { Suspense, ReactNode } from 'react'
import PageLoader from './PageLoader'

interface SafeComponentWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Wraps lazy-loaded components with proper Suspense boundary and loading state
 * This prevents "map is not a function" errors in production
 */
export const SafeComponentWrapper: React.FC<SafeComponentWrapperProps> = ({
  children,
  fallback
}) => (
  <Suspense fallback={fallback || <PageLoader message="Loading component..." fullPage={false} />}>
    {children}
  </Suspense>
)

export default SafeComponentWrapper
