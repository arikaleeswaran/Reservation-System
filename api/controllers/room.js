import Room from "../models/Room.js";
 import Hotel from "../models/Hotel.js";
 import {createError} from "../utils/error.js"

 export const createRoom = async (req,res,next) =>{
    const hotelId = req.params.hotelid;
    const newRoom = new Room(req.body);

    try{
        const savedRoom = await newRoom.save();
        try{
            await Hotel.findByIdAndUpdate(hotelId,{
                $push :{ rooms: savedRoom._id},
            });
        }catch(err){
            next(err);
        }
        res.status(200).json(savedRoom);
    }catch(err){
        next(err);
    }
 };

 export const updateRoom = async (req,res,next) =>{
    try{
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new:true}
        );
        res.status(200).json(updatedRoom);

    }catch(err){
        next(err);
    }
};
export const updateRoomAvailability = async (req,res,next) =>{
    try{
        console.log("hello",req.params.id,req.body.dates);

        const room = await Room.findOne({
            "roomNumbers._id":req.params.id
        });

        if(!room){
            return res.status(404).json("Room not found!");
        }
        
      await Room.updateOne(
        {"roomNumbers._id":req.params.id},
        {
            $push:{
                "roomNumbers.$.unavailableDates": {
                    $each : req.body.dates
                }
            },
        });
        res.status(200).json("Room status has been updated.");

    }catch(err){
        next(err);
    }
};

export const deleteRoom = async (req,res,next) =>{
    // try{
    //     const roomId = req.params.id;

    //     const room = await Room.findById(roomId)

    //     // const hotel = await Hotel.findOne({rooms:roomId});
    //     if (!room) {
    //         return res.status(404).json({ message: "Room not found " });
    //     }

    //     const hotel = await Hotel.findOne({ rooms:roomId });

    //     if (!hotel) {
    //         return res.status(404).json({ message: "No hotel found containing this room" });
    //     }

    //     await Room.findByIdAndDelete(roomId);

    //     await Hotel.findByIdAndUpdate(hotel._id,{
    //         $pull :{ rooms: roomId},
    //     });
        
    //     res.status(200).json("Room has been Deleted!");

    // }catch(err){
    //     next(err);
    // }

    try{
        const roomId = req.params.id;

        // CHANGE 1: Find the room first
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // CHANGE 2: Try to find the hotel with a more flexible approach
        const hotel = await Hotel.findOne({ 
            rooms: { $in: [roomId] } 
        });

        // CHANGE 3: If no hotel found, log additional context
        if (!hotel) {
            console.error(`No hotel found for room ID: ${roomId}`);
            console.error(`Room details:`, room);
            
            // Additional safety check: delete the room even if no hotel is found
            await Room.findByIdAndDelete(roomId);
            
            return res.status(200).json("Room deleted without hotel reference");
        }

        // CHANGE 4: Remove the room from the hotel's rooms array
        await Hotel.findByIdAndUpdate(hotel._id, {
            $pull: { rooms: roomId }
        });

        // CHANGE 5: Delete the room
        await Room.findByIdAndDelete(roomId);
        
        res.status(200).json("Room has been Deleted!");

    }catch(err){
        // CHANGE 6: Comprehensive error logging
        console.error("Error in deleteRoom:", err);
        console.error("Room ID:", req.params.id);
        
        next(err);
    }
};
export const getRoom = async (req,res,next) =>{
    try{
        const room = await Room.findById(req.params.id);
        res.status(200).json(room);
    }catch(err){
        next(err);
    }
};
export const getRooms = async (req,res,next) =>{
    try{
        const rooms = await Room.find();
        res.status(200).json(rooms);
    }catch(err){
        next(err);
    }
};