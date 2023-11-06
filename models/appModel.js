import mongoose from "mongoose";


const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    deletedNumber: {
      type: Array,
    },
  },
  { timestamps: true }
);


const App = mongoose.model("APP", appSchema);

export default App