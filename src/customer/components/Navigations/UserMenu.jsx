import { Menu } from "@headlessui/react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Your Profile", action: () => navigate("/profile") },
    { label: "Orders", action: () => navigate("/orders") },
    { label: "Settings", action: () => navigate("/settings") },
    { label: "Sign out", action: onLogout, danger: true },
  ];

  const getInitials = (user) => {
    if (!user) return "U";
    const firstName = user.firstName || user.name?.split(" ")[0] || "";
    const lastName = user.lastName || user.name?.split(" ")[1] || "";
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "U";
  };

  return (
    <Menu as="div" className="relative ml-3">
      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 hover:ring-4 transition-all">
        <span className="sr-only">Open user menu</span>
        <Avatar sx={{ bgcolor: "#4f46e5", color: "white", width: 45, height: 45 }}>
          {getInitials(user)}
        </Avatar>
      </Menu.Button>

      <Menu.Items
        transition
        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        {menuItems.map((item) => (
          <Menu.Item key={item.label}>
            {({ focus }) => (
              <button
                onClick={item.action}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  focus ? "bg-gray-100" : ""
                } ${item.danger ? "text-red-600" : "text-gray-700"}`}
              >
                {item.label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default UserMenu;