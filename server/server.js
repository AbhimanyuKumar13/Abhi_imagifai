import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser"; 

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";
import imageRouter from "./routes/imageRoutes.js";
import { removeUnverifiedAccounts } from "./automation/removeUnverifiedAccounts.js";
import { errorMiddleware } from "./middlewares/error.js";

const PORT = process.env.PORT || 10000;
const app = express();



app.use((req, res, next) => {
  console.log(`🔵 Incoming: ${req.method} ${req.originalUrl}`);
  next();
});



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
 

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.get("/", (req, res) => {
  res.send("Hello World!? ");
});

removeUnverifiedAccounts();

 await connectDB();

app.use(errorMiddleware);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
