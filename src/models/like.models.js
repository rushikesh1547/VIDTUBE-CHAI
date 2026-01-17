import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    tweet:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.plugin(mongooseAggregatePaginate)

export const Like = mongoose.model("Like", likeSchema);