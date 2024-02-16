const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = Schema({
  name: String,
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "member"],
      message: "{VALUE} inconnue",
    },
  },
  age: Number,
});

userSchema.pre("save", async function (next) {
  try {
    this.email = this.email.toLowerCase();
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = model("User", userSchema);
