import React, { ReactNode } from 'react'
import useLoadingStore from 'stores/loading'
import Loading from 'components/Loading'

interface GlobalLoadingProps {
  children: ReactNode
}

const GlobalLoading: React.FC<GlobalLoadingProps> = ({ children }) => {
  const loading = useLoadingStore((state) => state.loading)

  if (loading) {
    return <Loading />
  }

  return <>{children}</>
}

export default GlobalLoading
