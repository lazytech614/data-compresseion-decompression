import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

const AuthCallbackPage = async () => {
  const auth = await onAuthenticateUser()
  if(auth.status === 200 || auth.status === 201) {
    return redirect('/dashboard/overview')
  }
  if(auth.status === 401 || auth.status === 400 || auth.status === 404 || auth.status === 500) {
    return redirect('/auth/sign-in')
  }

  return (
    <div>AuthCallbackPage</div>
  )
}

export default AuthCallbackPage