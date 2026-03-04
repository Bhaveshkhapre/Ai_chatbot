import React from 'react'
import { getSession } from '../lib/getSession'
import EmbedMain from '../components/EmbedMain'

async function page() {
    const session = await getSession()
    return (
        <>
            <EmbedMain ownerId={session?.user?.id!}/>
        </>
    )
}

export default page