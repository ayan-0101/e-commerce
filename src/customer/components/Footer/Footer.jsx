import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-alice-carousel";

const Footer = () => {
  return (
    <div>
      <Grid
        className="bg-black text-white text-center mt-10"
        container
        sx={{ bgcolor: "black", color: "white", py: 3 }}
      >
        <Grid item xs={12} sm={4} md={3}>
          {" "}
          <Typography className="pb-5" variant="h6">
            {" "}
            Company{" "}
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
              About
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Blog
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Partners
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Jobs
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Solutions{" "}
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
              Marketing
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Analytics
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Insights
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Suport
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Documentations{" "}
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
              Guide
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              API Status
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Typography className="pb-5" variant="h6">
            {" "}
            Legal{" "}
          </Typography>
          <div>
            <Button className="pb-5" variant="h6">
              Claim
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Privacy
            </Button>
          </div>
          <div>
            <Button className="pb-5" variant="h6">
              Terms
            </Button>
          </div>
        </Grid>

        <Grid className="pt-20" item xs={12}>
          <Typography variant="body2" component="p" align="center">
            &copy; 2024 Fashion Hub. All Rights Reserved.
          </Typography>
          <Typography variant="body2" component="p" align="center">
            Made by Beyond 9 to 5 co.
          </Typography>
          <Typography variant="body2" component="p" align="center">
           Icons made by Freepic from <Link href="https://www.flaticon.com/authors/freepik" target="_blank">https://www.flaticon.com/authors/freepik</Link>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Footer;
