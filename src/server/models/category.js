import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    mentorCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

CategorySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
