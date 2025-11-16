import React from 'react'
import Achievement from './Achievement'
import MonthlySales from './MonthlySales'

const Dashboard = () => {
  return (
    <div className='flex gap-4'>
      <Achievement />
      <MonthlySales/>
    </div>
  )
}

export default Dashboard