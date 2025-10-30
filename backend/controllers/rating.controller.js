import prisma from "../db/prismaClient.js";

//give rating to store
export const giveRating = async (req, res) => {
    try {
        const { userId, storeId, rating } = req.body;

        // Validate input
        if (!userId || !storeId || !rating) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(rating < 1 || rating > 5){
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }
        
        const userIdStr = String(userId);
        const storeIdStr = String(storeId);

        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId: userIdStr,
                    storeId: storeIdStr,
                },
            },
        });
        if(existingRating){
            return res.status(400).json({ error: "User has already rated this store" });
        }

        const newRating = await prisma.rating.create({
            data:{
                userRating: Number(rating),
                userId: userIdStr,
                storeId: storeIdStr,
            }
        })
        res.status(201).json({message: "Rating created successfully", rating: newRating});

    }catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" ,e});
    }
}

//get rating of a user on store
export const getUserRatingOnStore = async (req, res) => {
    try {
        const { userId, storeId } = req.params;
        const rating = await prisma.rating.findUnique({
            where:{
                userId_storeId:{
                    userId: String(userId),
                    storeId: String(storeId)
                }
            }
        });
        if (!rating) {
            return res.status(404).json({ error: "Rating not found" });
        }
        res.status(200).json({ message: "Rating fetched successfully", rating: rating.userRating });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error", e });
    }
}

//update rating of a store by user
export const updateUserRatingOnStore = async (req, res) => {
    try {
        // Accept rating in body; ids come from params
        const { userId, storeId } = req.params;
        const { rating } = req.body;
        if (!rating) {
            return res.status(400).json({ error: "Rating is required" });
        }
        const updatedRating = await prisma.rating.update({
            where: {
                userId_storeId: {
                    userId: String(userId),
                    storeId: String(storeId),
                },
            },
            data: {
                userRating: Number(rating),
            },
        });
        res.status(200).json({ message: "Rating updated successfully", rating: updatedRating });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error", e });
    }
}
