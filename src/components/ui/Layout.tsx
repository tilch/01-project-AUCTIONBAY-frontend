import { FC, ReactNode } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

interface Props {
  children: ReactNode | ReactNode[]
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>

      <div className="layout-container container-xxl p-4">{children}</div>
    </>
  )
}

export default Layout
