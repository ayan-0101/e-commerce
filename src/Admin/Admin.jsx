import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { ICONS } from "../media/Icons/iconBank";
import Dashboard from "./Components/Dashboard/Dashboard";
import AddProduct from "./Components/AddProduct";
import Orders from "./Components/Orders";
import Customers from "./Components/Customers";
import ProductsTable from "./Components/ProductsTable";

const drawerWidth = 250;

const ADMIN_MENU = [
  { name: "Dashboard", path: "/admin", icon: "dashboard" },
  { name: "Products", path: "/admin/products", icon: "products" },
  { name: "Orders", path: "/admin/orders", icon: "orders" },
  { name: "Customers", path: "/admin/customers", icon: "customers" },
  { name: "Add Product", path: "/admin/products/create", icon: "addProduct" },
  { name: "Settings", path: "/admin/settings", icon: "settings" },
];

const SidebarList = ({ onNavigate, currentPath }) => {
  const isActive = (itemPath) => {
    // Exact match for dashboard
    if (itemPath === "/admin" && currentPath === "/admin") {
      return true;
    }
    
    // For other paths, check if current path starts with item path
    if (itemPath !== "/admin") {
      return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
    }
    
    return false;
  };

  return (
    <List>
      {ADMIN_MENU.map((item) => {
        const IconComponent = ICONS[item.icon];
        const active = isActive(item.path);
        
        return (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={active}
              onClick={() => onNavigate(item.path)}
              sx={{
                py: 1.5,
                "&.Mui-selected": {
                  backgroundColor: "#f3f4f6",
                  borderRight: "3px solid #3b0663",
                  "&:hover": {
                    backgroundColor: "#e5e7eb",
                  },
                },
              }}
            >
              <ListItemIcon>
                {IconComponent ? (
                  <IconComponent style={{ color: active ? "#3b0663" : "#e5e7eb" }} />
                ) : (
                  <MenuIcon style={{ color: active ? "#3b0663" : "#e5e7eb" }} />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: active ? 600 : 400,
                  color: active ? "#3b0663" : "#e5e7eb",
                }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-purple-950">
      {/* AppBar for mobile / small screens */}
      <AppBar
        position="fixed"
        sx={{ 
          display: { lg: "none" },
          bgcolor: "#fff",
          color: "#1f2937",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            aria-label="open menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600, color: "#1f2937" }}
          >
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{
          width: { lg: drawerWidth },
          flexShrink: { lg: 0 },
        }}
        aria-label="admin sidebar"
      >
        {/* Desktop: fixed, always open */}
        <Box
        className="bg-purple-950"
          sx={{
            display: { xs: "none", lg: "block" },
            width: drawerWidth,
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            borderRight: "1px solid #e5e7eb",
            bgcolor: "#3b0663",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {/* Logo/Brand */}
          <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#e5e7eb",
                textAlign: "center",
              }}
            >
              Admin Panel
            </Typography>
          </Box>

          {/* Menu Items */}
          <Box sx={{ px: 1, pt: 2 }}>
            <SidebarList 
              onNavigate={handleNavigate} 
              currentPath={location.pathname} 
            />
          </Box>

          <Divider sx={{ mt: 2 }} />
        </Box>

        {/* Mobile: temporary Drawer */}
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#fff",
            },
          }}
        >
          <Box sx={{ width: drawerWidth }}>
            {/* Mobile Header */}
            <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#e5e7eb",
                  textAlign: "center",
                }}
              >
                Admin Panel
              </Typography>
            </Box>

            {/* Menu Items */}
            <Box sx={{ px: 1, pt: 2 }}>
              <SidebarList 
                onNavigate={handleNavigate} 
                currentPath={location.pathname} 
              />
            </Box>

            <Divider />
          </Box>
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          pt: { xs: 8, lg: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsTable />} />
          <Route path="/products/create" element={<AddProduct />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Box>
    </div>
  );
};

export default Admin;