import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.actions'
import React from 'react'

export default async function Page() {

    const user = await getCurrentUser()
    return (
       <>
        <Agent userName={user?.name} userId={user?.id} type='generate'/>
       </>
    )
}