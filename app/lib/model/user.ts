import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  id:string
  name: string
  email: string
  password: string
  userType: "user" | "admin"
  phone?: string
  adminId?: string
  department?: string
  governmentId?: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  verified: Boolean
  verifyToken?: string
  verifyTokenExpiry?: Date
}

const UserSchema = new Schema<IUser>({
  id: { type:String, default:()=>crypto.randomUUID()},
  name: { type: String, required: true, trim: true  },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["user", "admin"], required: true },
  phone: { type: String, trim: true  },
  adminId: { type: String },
  department: { type: String },
  governmentId: { type: String, unique: true, sparse: true },
  location: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  verified: {type: Boolean, required: true, default: false },
  verifyToken: {type: String },
  verifyTokenExpiry: {type: Date },
  },
  {
    timestamps:true
  }
)

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User;
