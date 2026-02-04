import mongoose from "mongoose";

const userNoteSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: String,
    userEmail: String,
  },
  { timestamps: true },
);

export default mongoose.model("Note", userNoteSchema);
