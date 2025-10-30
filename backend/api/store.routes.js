import { Router } from "express";
import {getAllStores,createStore,getStoreByOwnerId,setStoreRatings} from '../controllers/store.controller.js'

const router = Router();

router.get('/',getAllStores)
router.post('/',createStore)
router.get('/:ownerId',getStoreByOwnerId)
router.put('/:id/:rating',setStoreRatings)

export default router;


