'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000 // 7 days



export async function signUp(params: SignUpParams) {

    const {uid, name, email} = params

    try {

        const userRecord = await db.collection('users').doc(uid).get()

        if(userRecord.exists) {
            return {
                success: false,
                message: 'User already exists. Please login.'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
       
        })

        return {
            success: true,
            message: 'User created successfully. Please sign in.'
        }


    } catch(error : any) {
        console.error('Error creating a user', error)

        if(error.code == 'auth/email-already-exists') {
            return {
                success: false,
                message: 'Email already exists'
            }
        }

        return {
            success: false,
            message: 'Error creating a user'
        }

    }
}

export async function signIn(params: SignInParams) {
    const {email, idToken} = params

    try {

        const userRecord = await auth.getUserByEmail(email)

        if(!userRecord) {
            return {
                success: false,
                message: 'User not found. Please sign up.'
            }
        }

        await setSessionCookie(idToken)

    } catch(error) {
        console.log(error)

        return {
            success: false,
            message: 'Error signing in'
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies()
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK 
    });

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    })
    
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value || ''

    if(!sessionCookie) {
        return null
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get()

        if(!userRecord.exists) {
            return null
        }

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User

    } catch(error) {
        console.log(error)
        return null
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser()

    return !!user
}

