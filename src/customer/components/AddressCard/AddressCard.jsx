import React from 'react'
import {Typography, Box } from '@mui/material'

const AddressCard = () => {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <div className="space-y-3">
        <div className="p-4 border rounded-md bg-gray-50">
          <Typography variant="body2" className="font-medium">
            John Doe
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            123 Main Street, Apt 4B
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            New York, NY 10001
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Phone: (555) 123-4567
          </Typography>
        </div>
      </div>
    </Box>
  )
}

export default AddressCard
