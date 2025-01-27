"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const PORT = process.env.PORT_NUMBER || 8000;
const mongoUrl = process.env.MONGO_URL;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
const uploadsPath = path_1.default.join(__dirname, '..', 'uploads');
// console.log('Serving uploads from:', uploadsPath);
app.use('/uploads', express_1.default.static(uploadsPath));
app.use(express_1.default.json());
if (!mongoUrl) {
    throw new Error("MongoDB connection URL (process.env.mongo_url) is not defined.");
}
mongoose_1.default
    .connect(mongoUrl, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Database connection error:", err));
app.use("/", userRoutes_1.default);
app.listen(PORT, () => {
    console.log(`server started at port ${PORT}`);
});
