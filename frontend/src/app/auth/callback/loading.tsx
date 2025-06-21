import React from 'react'

const AuthLoading = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Wait a moment...</p>
        </div>
      </div>
  )
}

export default AuthLoading