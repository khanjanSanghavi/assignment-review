import { Router } from "express";
import {  giveRating,updateUserRatingOnStore,getUserRatingOnStore} from "../controllers/rating.controller.js";

const router = Router();
router.post("/", giveRating);
router.get("/:userId/:storeId", getUserRatingOnStore);
router.put("/:userId/:storeId", updateUserRatingOnStore);

export default router;