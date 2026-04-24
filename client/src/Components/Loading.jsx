import React from 'react'

const Loading = ({message="Neuro"}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#fdfdff] dark:bg-[#050505] antialiased">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-t-2 border-rose-500 animate-spin transition-all duration-1000"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white animate-pulse">
             {message}
           </span>
           <div className="absolute h-12 w-12 bg-rose-500/10 blur-xl rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading
