import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors"
import path from "path";
import userRoutes from "./routes/userRoutes"
import dotenv from "dotenv"


const app: Application = express()
dotenv.config()
const PORT = process.env.PORT_NUMBER || 8000
const mongoUrl = process.env.MONGO_URL;



app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

const uploadsPath = path.join(__dirname, '..', 'uploads');
// console.log('Serving uploads from:', uploadsPath);

app.use('/uploads', express.static(uploadsPath));

app.use(express.json())

if (!mongoUrl) {
    throw new Error("MongoDB connection URL (process.env.mongo_url) is not defined.");
}

mongoose
    .connect(mongoUrl, {
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection error:", err))

app.use("/", userRoutes);

app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`)
})