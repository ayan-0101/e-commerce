import React from 'react'
import AddressCard from '../AddressCard/AddressCard'
import CartItem from '../Cart/CartItem'

const OrderSummary = () => {
  return (
    <div>
     <div>
      <AddressCard/>
     </div>
       <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Left Side - Cart Items */}
      <div className="flex-1 flex flex-col gap-4">
       {[1,1,1,1,1,1,1].map((item)=>(<CartItem />)) }
        {/* Add more CartItems as needed */}
      </div>

      {/* Right Side - Price Details */}
      <div className="w-full lg:w-1/3 border rounded-md shadow-md p-5 h-fit">
        <h2 className="text-gray-700 font-semibold mb-4">PRICE DETAILS</h2>

        <div className="flex justify-between text-sm mb-2">
          <span>Price (3 items)</span>
          <span>₹4697</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Discount</span>
          <span className="text-green-600">-₹3419</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span>Delivery Charges</span>
          <span className="text-green-600">Free</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span>₹1278</span>
        </div>

        <button className="w-full mt-5 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-md">
          CHECK OUT
        </button>
      </div>
    </div>
    </div>
  )
}

export default OrderSummary
