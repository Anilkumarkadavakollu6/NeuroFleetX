import React from 'react'
import Topbar from './Topbar'

const DriverLayout = ({children}) => {
  return (
     <div className=" bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      
      <div className="flex flex-col">
        <Topbar/>
        <main className="flex-1 overflow-y-auto p-8 space-y-8">{children}</main>
      </div>
    </div>
  )
}

export default DriverLayout
