import mongoose from "mongoose";

const domainSchema = new mongoose.Schema({
    domain:{
        type: String,
        required: true,
    }
}, {timestamps: true});


const Domain = mongoose.model("Domain", domainSchema);

export default Domain;
