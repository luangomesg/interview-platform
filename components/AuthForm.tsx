"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField";
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { signIn, signUp } from "@/lib/actions/auth.actions"



const authFormSchema = (type:FormType) => {
  return z.object({
    name: type === 'sign-up' 
      ? z.string().min(3, {
          message: "Name must be at least 3 characters long"
        })
      : z.string().optional(),
    email: z.string({
      required_error: "Email is required",
    }).email("Please enter a valid email address"),
    password: z.string({
      required_error: "Password is required",
    }).min(8, {
      message: "Password must be at least 8 characters long"
    }),
  })
}




export default function AuthForm({type}: {type: FormType}) {
  const router = useRouter()
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange" // Isso fará a validação acontecer em tempo real
  })
 
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      if(type === 'sign-up') {
        const {name, email, password} = values

        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
          password,
        })

        if(!result?.success) {
          toast.error(result?.message)
          return
        }

        toast.success("Account created successfully. Please sign in.")
        router.push('/sign-in')
      } else {
        const {email, password} = values
        try {
          const userCredentials = await signInWithEmailAndPassword(auth, email, password)
          const idToken = await userCredentials.user.getIdToken()
          if (!idToken) {
            toast.error("Error signing in.")
            return
          }
          await signIn({
            email,
            idToken,
          })
          toast.success("Sign in successfully.")
          router.push('/')
        } catch (signInError: any) {
          if (signInError.code === "auth/wrong-password" || signInError.code === "auth/user-not-found" || signInError.code === "auth/invalid-credential") {
            toast.error("Invalid email or password")
          } else {
            toast.error("An error occurred while signing in")
          }
          return
        }
      }
    } catch (error: any) {
      console.log(error)
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists")
      } else {
        toast.error("An error occurred. Please try again.")
      }
    }
  }

  const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
          <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
              <Image src="/logo.svg" alt="logo" height={32} width={38}/>
              <h2 className="text-primary-100">AlphaInsight</h2>
            </div>

            <h3>Practice job interview with AI</h3>
          
          
              
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
        {!isSignIn && (
          <FormField
            control={form.control}
            name="name"
            label="Name"
            placeholder="Your Name"
          />

          
        )}
        <FormField
            control={form.control}
            name="email"
            label="Email"
            placeholder="Your email address"
            type="email"
          />

        <FormField
           control={form.control}
           name="password"
           label="Password"
           placeholder="Enter your password"
           type="password"
          />
        <Button className="btn" type="submit">{isSignIn ? 'Sign in' : 'Create an Account'}</Button>
      </form>
    </Form>

    <p className="text-center">
      {isSignIn ? "Don't have an account?" : "Already have an account?"}
      <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className="font-bold text-user-primary ml-1">
        {!isSignIn ? "Sign in" : "Sign-up"}
      </Link>
    </p>
    </div>
  
        </div>
    )
}