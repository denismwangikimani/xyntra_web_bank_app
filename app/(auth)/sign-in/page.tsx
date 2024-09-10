import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignIn = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      {/* We will use the AuthForm and pass in the type sign-in */}
      <AuthForm type="sign-in" />
    </section>
  )
}

export default SignIn