import React from "react";
import { Avatar, Grid, Rating } from "@mui/material";

const ProductReviewCard = ({ name, date, rating, review }) => {
  return (
    <div className="border-b border-gray-200 pb-6">
      <Grid container spacing={2} alignItems="flex-start">
        {/* Avatar */}
        <Grid item xs="auto">
          <Avatar sx={{ width: 48, height: 48 }}>
            {name?.charAt(0) || "A"}
          </Avatar>
        </Grid>

        {/* Review Content */}
        <Grid item xs>
          {/* Name & Date */}
          <div className="flex items-center gap-4">
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{date}</p>
          </div>

          {/* Rating */}
          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ marginTop: "4px" }}
          />

          {/* Review Text */}
          <p className="mt-3 text-gray-700 leading-relaxed max-w-[200px] min-w-[150px]">
            {review}
          </p>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductReviewCard;
