import AuthForm from '@/components/AuthForm'
import React from 'react'

const SignUp = () => {
  return (
    <section className='flex-center size-full max-sm:px-6'>
      {/* We will use the AuthForm and pass in the type sign-up */}
      <AuthForm type="sign-up" />
    </section>
  )
}

export default SignUp