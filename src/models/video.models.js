import mongoose, {Schema} from "mongoose"


const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudinary URL
        required: true,
    },
     thumbnail: {
        type: String, //cloudinary URL
        required: true,
    },
    title: {
        type: String, 
        required: true,
    },
    description:{
        type: String, 
        required: true,
    },
    views: {
        type: Number, 
        required: true,
    },
    duration: {
        type: Number, 
        required: true,
    }


})


export const Video = mongoose.model("Video", videoschema)