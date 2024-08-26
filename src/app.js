import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { create } from "express-handlebars";
import connectDB from "./config/database.js";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import authRouter from "./routes/authRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import setupSwagger from "./config/swagger.js";

dotenv.config();
connectDB();

const app = express();

// config para obtener __dirname ( ES6 )
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config para swagger
setupSwagger(app);

// config handlebars
const hbs = create({}); // instancia handlebars
app.engine("handlebars", hbs.engine); // uso de hbs.engine
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// middleware (parsea JSON)
app.use(express.json());

// routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/auth", authRouter);

// widdleware para manejo de errores
app.use(errorHandler);

export default app;
