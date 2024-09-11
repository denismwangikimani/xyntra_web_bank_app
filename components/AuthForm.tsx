"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

//add shadcn form using zod and react form
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
//import { Input } from "@/components/ui/input";
import CustomInput from "@/components/CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
//import SignIn from "@/app/(auth)/sign-in/page";
import { useRouter } from "next/router";
import { signIn, signUp } from "@/lib/actions/user.action";

// We will use this component to render the form for sign-in and sign-up by passing in the type
const AuthForm = ({ type }: { type: string }) => {
  // We will use the router to redirect the user to the home page after they sign in
  const router = useRouter();
  //we will set the user to null
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //we will create a formSchema that will take in authFormSchema and set pass in type as a parameter
  const formSchema = authFormSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // We will set the isLoading to true
    setIsLoading(true);

    try {
      //sign up with appwrite and get the plaid link token

      // We will check if the type is sign-up
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setUser(newUser);
      }
      if (type === "sign-in") {
        //we will create a response variable that will hold the response from the signIn function
        
        const response = await signIn({
          email: data.email,
          password: data.password,
        });
        //if the response is successful, we will set the user to the response to send the user to the "/"
        if (response) router.push("/");
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      // We will set the isLoading to false
      setIsLoading(false);
    }
  };

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
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>

      {/* if we have the user, we will ask them to link their plaid bank alcs */}
      {user ? (
        <div className="flex flex-col gap-3">
          {/* We will render the plaid link component */}
        </div>
      ) : (
        <>
          {/*the form will be rendered here*/}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* if the type is sign-up, we will render the additional fields */}
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="Enter your first name"
                    />
                    <CustomInput
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Example: NY"
                    />
                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="YYYY-MM-DD"
                    />
                    <CustomInput
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="Example: 1234"
                    />
                  </div>
                </>
              )}

              {/* We will render the CustomInput to render the email input */}
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Please Enter Your Email Address"
              />
              {/* We will render the password input */}
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Please Enter Your Password"
              />

              {/* We will render the button that will submit the form */}
              {/* We will add a loader to show that the form is loading */}
              {/* We will also add a disabled attribute to the button if the form is loading */}
              <div className="flex flex-col gap-4">
                <Button type="submit" disabled={isLoading} className="form-btn">
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* we will add in a footer that will have a link to the sign up page if the user does not have an account */}
          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
