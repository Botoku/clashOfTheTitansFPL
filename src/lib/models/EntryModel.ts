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
    required: true,
  },
  instagram: {
    type: String,
    required: true,
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

  }
});

const Entry = mongoose.models.Entry || mongoose.model("Entry", EntrySchema);

export default Entry;
