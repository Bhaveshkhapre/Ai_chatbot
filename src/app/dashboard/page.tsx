import React from 'react'
import { getSession } from '../lib/getSession'
import DashboardPage from '../components/DashboardPage'
export default async function page() {

  const session = await getSession()

  return (
    <>
      <DashboardPage ownerId={session?.user?.id!} />

    </>
  )
}
