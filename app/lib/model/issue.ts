import mongoose, { Schema, Document } from "mongoose"

export interface IIssue extends Document {
    user: mongoose.Types.ObjectId
    id:string,
    issue: string,
    category: string,
    priority: string,
    location: string,
    description: string,
    email: string,
    image?: string,
    phone?: string,
    status?:string,
}

const IssueSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id:{ type:String, required: true},
    issue: { type: String, trim: true, required: true},
    category: { type: String, trim: true, required: true  },
    priority: { type: String, trim: true, required: true },
    location: { type: String, trim: true , required: true  },
    description: { type: String, trim: true, required:true  },
    email: { type: String, trim: true, required:true  },
    image: { type: String, default: "" },
    phone: { type: String, trim: true  },
    status: { type: String, default: "reported"}
    },{
        timestamps:true
    }
)

const Issue = mongoose.models.Issue || mongoose.model<IIssue>("Issue", IssueSchema)

export default Issue;
