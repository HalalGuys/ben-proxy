const express = require("express");
const proxy = require("http-proxy-middleware");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));

app.use("/", express.static("public"));
app.use("/listing/:listingId", express.static("public"));
app.use("/search/:searchQuery", express.static("public"));

const endpoints = {
  navigation: "http://ec2-34-217-69-244.us-west-2.compute.amazonaws.com:80",
  details: "http://ec2-54-200-238-109.us-west-2.compute.amazonaws.com:80",
  photos: "http://ec2-18-212-74-66.compute-1.amazonaws.com:80",
  reviews: "http://ec2-18-216-90-61.us-east-2.compute.amazonaws.com:80",
  bookings: "http://ec2-13-59-22-40.us-east-2.compute.amazonaws.com:80"
};

// navigation
app.use(
  "/api/searchRecords",
  proxy({
    target: endpoints.navigation
  })
);

app.use(
  "/api/searchListings/:searchQuery",
  proxy({
    target: endpoints.navigation
  })
);

// details
app.use(
  "/api/details/**",
  proxy({
    target: endpoints.details
  })
);

// photos
app.use(
  "/api/listing/:listingId",
  proxy({
    target: endpoints.photos
  })
);

// reviews
app.use(
  "/reviews/:id",
  proxy({
    target: endpoints.reviews
  })
);

// bookings
app.use(
  "/api/listings/:listingId",
  proxy({
    target: endpoints.bookings
  })
);

app.use(
  "/api/submit",
  proxy({
    target: endpoints.bookings
  })
);

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});
