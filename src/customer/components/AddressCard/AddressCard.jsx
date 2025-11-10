const AddressCard = ({ address }) => {
  if (!address) return (<p className="text-gray-500">No Saved address available.</p>);
  return (
    <div className="text-sm text-gray-700 space-y-1">
      <p>
        <span className="font-medium">
          {address.firstName} {address.lastName}
        </span>
      </p>
      <p>{address.streetAddress}</p>
      <p>
        {address.city}, {address.state} - {address.zipCode}
      </p>
      <p>Phone: {address.mobile}</p>
    </div>
  );
};

export default AddressCard;
