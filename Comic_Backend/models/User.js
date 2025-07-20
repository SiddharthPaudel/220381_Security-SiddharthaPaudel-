import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  role: { type: String, enum: ["user", "admin"], default: "user" },
  avatar: { type: Number, default: 1 },

  bookmarkedManga: [{ type: mongoose.Schema.Types.ObjectId, ref: "Manga" }],

  rentedManga: [
    {
      manga: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
      rentedAt: { type: Date, default: Date.now },
      expiresAt: Date,
    },
  ],

  reviews: [
    {
      manga: { type: mongoose.Schema.Types.ObjectId, ref: "Manga" },
      rating: { type: Number },
      reviewText: { type: String },
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  otpCode: String,
  otpExpires: Date,

  // New fields for password reuse and expiry
  previousPasswords: {
    type: [String], // Array of previous password hashes
    default: [],
  },
  passwordChangedAt: Date,
});

// Pre-save hook to hash password if modified and prevent reuse
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Check password reuse
  for (const oldHash of this.previousPasswords) {
    const isSame = await bcrypt.compare(this.password, oldHash);
    if (isSame) {
      return next(
        new Error(
          "New password must not match any of your recent passwords."
        )
      );
    }
  }

  // Hash new password
  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;

  // Keep only last 3 passwords
  if (this.previousPasswords.length >= 3) {
    this.previousPasswords.shift(); // Remove oldest
  }
  this.previousPasswords.push(hashed);

  // Update passwordChangedAt timestamp
  this.passwordChangedAt = new Date();

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
