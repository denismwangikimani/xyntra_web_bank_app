'use client'

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// We will use this component to render the form for sign-in and sign-up by passing in the type
const AuthForm = ({ type }: { type: string }) => {
    //we will set the user to null
    const [user, setUser] = useState(null);

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            width={34}
            height={34}
            src="/icons/logo.svg"
            alt="xyntra logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Xyntra</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
                {user 
                  ? 'Link your account to get started'
                  : 'Please enter your details'
                }
              </p> 
          </h1>
        </div>
      </header>

      {/* if we have the user, we will ask them to link their plaid bank alcs */}
        {user ? (
            <div className="flex flex-col gap-3">
             {/* We will render the plaid link component */}
            </div>
        ) : (<>FORM</>) }
    </section>
  );
};

export default AuthForm;
