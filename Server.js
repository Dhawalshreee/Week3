const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

const authRoutes = require("./src/routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Hello Pace"));

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 8000;

    mongoose
        .connect(process.env.MONGODB_URL, { dbName: "user-auth" })
        .then(() => {
            console.log("Database connected");
            app.listen(PORT, () =>
                console.log(`Server running on :${PORT}`)
            );
        })
        .catch((err) => {
            console.error(" DB connection error:", err);
            process.exit(1);
        });
}
