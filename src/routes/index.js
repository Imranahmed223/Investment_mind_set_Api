const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const profileRoute = require("./profile.route");
const adminRoute = require("./admin.route");
const newsRoute = require("./news.route");
const analysisRoute = require("./analysis.route");
const featureRoute = require("./feature.route");
const coinRoute = require("./coin.route");
const stockRoute = require("./stock.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/profiles",
    route: profileRoute,
  },
  {
    path: "/news",
    route: newsRoute,
  },
  {
    path: "/analysis",
    route: analysisRoute,
  },
  {
    path: "/feature",
    route: featureRoute,
  },
  {
    path: "/coins/cryptocurrency",
    route: coinRoute,
  },
  {
    path: "/stock",
    route: stockRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
