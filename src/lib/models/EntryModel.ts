import mongoose from "mongoose";

const EntrySchemaNew = new mongoose.Schema({
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
  },
  phoneNumber: {
    type: String,
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
  },
  season:{
    type: String,
    default: '2025/2026'
  }
});

const Entry2026 = mongoose.models.Entry2026 || mongoose.model("Entry2026", EntrySchemaNew);

export default Entry2026;
