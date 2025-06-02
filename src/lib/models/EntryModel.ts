import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  twitter: {
    type: String,
   
  },
  instagram: {
    type: String,
   
  },
  fplTeam: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl:{
    type: String,

  },
  clashID: {
    type: String,
    default: "0"
  }
});

const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

export default Entry;
