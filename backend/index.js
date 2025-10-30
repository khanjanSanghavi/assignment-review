import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./api/user.routes.js";
import storeRoutes from "./api/store.routes.js"
import ratingRoutes from "./api/ratings.routes.js"
dotenv.config();

const corsOptions = {
  origin: 'http://localhost:5173/',
  optionsSuccessStatus: 200,
};



const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
  res.send("server is running")
})

app.use("/api/users", userRoutes);
app.use("/api/stores",storeRoutes)
app.use("/api/ratings",ratingRoutes)

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});