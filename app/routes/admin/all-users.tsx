import React from 'react'
import { Header } from './components';

export async function loader() {
  return null;
}

const AllUsers = () => {
  return (
    <main className='dashboard wrapper'>

      <Header
        title="Trips Page"
        description="Check out our current users in real time"
      />
      All Users Page Contents
    </main>
  )
}

export default AllUsers;