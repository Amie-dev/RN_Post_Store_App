import mongoose, { model, Schema } from "mongoose";

const bookShema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    image: {
      url:{
        type: String,
      required: true,
      },
      public_id:{
        type: String,
      required: true,
      }
    },
    rating: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Book = model("Book", bookShema);

export default Book;
