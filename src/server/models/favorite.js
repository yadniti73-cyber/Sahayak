import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema(
  {
    seekerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: false,
    collection: "favorites",
  }
);

FavoriteSchema.index({ seekerId: 1, mentorId: 1 }, { unique: true });
FavoriteSchema.index({ seekerId: 1 });

export const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);
