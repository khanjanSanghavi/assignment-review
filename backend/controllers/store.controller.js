import prisma from "../db/prismaClient.js";


//get all store
export const getAllStores = async (req,res)=>{
    try {
        const stores = await prisma.store.findMany();
        return res.status(200).json(stores);
    } catch (e) {
        console.error(e);
        return res.status(501).json({message:"Server Error- Can't get Stores--",e});
    }
}

//create store 
export const createStore = async (req,res)=>{
    try {
        const {name,add,OwnerID} = req.body;
        if(!name||!add||!OwnerID){
            return res.status(400).json({message:"All fields are required"})
        }
        const OwnerExist = await prisma.store.findUnique({
            where:{
                OwnerID
            }
        })
        if(OwnerExist){
            return res.status(401).json({message:"User can't have more than one store"})
        }

        const Store = await prisma.store.create({
            data:{
                name,
                address:add,
                OwnerID
            }
        })
        return res.status(201).json({message:"Store Created successfully",store:Store})
    } catch (e) {
        console.error(e)
        return res.status(501).json({message:"Server Error- Can't create Store--",e})
    }
}

//get store by owner id
export const getStoreByOwnerId = async (req,res)=>{
    try {
        const {ownerId} = req.params;
        const store = await prisma.store.findMany({
            where:{
                OwnerID:ownerId
            }
        })
        return res.status(200).json(store)
    } catch (e) {
        console.error(e)
        return res.status(501).json({message:"Server Error- Can't get Store--",e})
    }
}

//set overall ratings
export const setStoreRatings = async (req,res)=>{
    try{
    const {id,rating} = req.params;
    const numRating = Number(rating)
    const Store = await prisma.store.findUnique({
        where:{
            id
        }
    })
    const newRating = ((Store.overallRating * Store.ratingCount) + numRating )/ (Store.ratingCount + 1)

    const updatedStore = await prisma.store.update({
        where:{id},
        data:{
            overallRating:newRating,
            ratingCount: Store.ratingCount +1
        }
    })

    return res.status(200).json(updatedStore);
    }catch(e){
        console.error(e)
        return res.status(500).json({message:"Server error",e})
    }
}

