import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
 
    title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    maxPeople:{
        type:Number,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    roomNumbers:[{number: Number, unavailableDates: {type: [Date]}}],
},
{timestamps:true}
);

// [
//     {number:101, unavailableDates:[01.05.2022, 02.05.2022]},
//     {number:102, unavailableDates:[01.05.2022, 04.06.2022},
//     {number:103, unavailableDates:[03.05.2023, 05.06.2023]},
//     {number:104, unavailableDates:[09.10.2024, 02.12.2-24]},
//     {number:105, unavailableDates:[05.04.2024, 04.02.2024]},
// ]

export default mongoose.model("Room", RoomSchema )