import { Grid, Typography, Link } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Grid
      container
      spacing={4}
      sx={{
        bgcolor: "black",
        color: "white",
        px: { xs: 2, sm: 6, md: 12 },
        py: 6,
        textAlign: { xs: "center", sm: "left" },
      }}
    >
      {/* Company */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          Company
        </Typography>
        <Link href="#" color="inherit" underline="hover" display="block">
          About
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          Blog
        </Link>
      </Grid>

      {/* Solutions */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          Solutions
        </Typography>
        {["Marketing", "Analytics", "Insights", "Support"].map((item) => (
          <Link key={item} href="#" color="inherit" underline="hover" display="block">
            {item}
          </Link>
        ))}
      </Grid>

      {/* Documentation */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          Documentation
        </Typography>
        <Link href="#" color="inherit" underline="hover" display="block">
          Guide
        </Link>
        <Link href="#" color="inherit" underline="hover" display="block">
          API Status
        </Link>
      </Grid>

      {/* Legal */}
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="h6" gutterBottom>
          Legal
        </Typography>
        {["Claim", "Privacy", "Terms"].map((item) => (
          <Link key={item} href="#" color="inherit" underline="hover" display="block">
            {item}
          </Link>
        ))}
      </Grid>

      {/* Bottom text */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Typography variant="body2" align="center" color="gray">
          &copy; {new Date().getFullYear()} Lowkey. All Rights Reserved.
        </Typography>
        <Typography variant="body2" align="center" color="gray">
          Made by WeBelieve Co.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
