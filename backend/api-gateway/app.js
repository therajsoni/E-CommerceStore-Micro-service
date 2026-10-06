require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const proxy = require("express-http-proxy");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
origin : "*"
}));
app.use(express.json());
app.use(helmet());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  },
};

app.use(
  "/v1/auth",
  proxy(process.env.AUTH_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

app.use(
  "/v1/users",
  proxy(process.env.AUTH_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

app.use(
  "/v1/products",
  proxy(process.env.PRODUCT_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

app.use(
  "/v1/categories",
  proxy(process.env.PRODUCT_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

app.use(
  "/v1/cart",
  proxy(process.env.CART_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

app.use(
  "/v1/orders",
  proxy(process.env.ORDER_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

app.use(
  "/v1/payments",
  proxy(process.env.ORDER_SERVICE, {
    ...proxyOptions,
    parseReqBody: false,
  }),
);

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`API GATEWAY Service ${PORT}`);
      console.log(`AUTH Service ${process.env.AUTH_SERVICE}`);
      console.log(`PRODUCT Service ${process.env.PRODUCT_SERVICE}`);
      console.log(`CART Service ${process.env.CART_SERVICE}`);
      console.log(`ORDER Service ${process.env.ORDER_SERVICE}`);
    });
  } catch (error) {
    console.error("Failed to connected to server", error);
  }
}

startServer();

