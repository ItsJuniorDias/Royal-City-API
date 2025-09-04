const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "https://omnistate.vercel.app", // your frontend URL
    credentials: true, // if you want to send cookies/auth headers
  })
);

// config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const nft = require("./routes/NFTRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
const swaggerDocs = require("./swagger");

app.use("/api/v1", nft);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", payment);

swaggerDocs(app, 4000);

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Server is Running! 🚀");
  });
}

module.exports = app;
