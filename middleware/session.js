import User from "../models/userModel.js"

export const checkSession = async(req, res, next) => {

    try {
        
        const id = req.session.userId;

        if(!id){
            return res.status(401).json({message: "No session provided"})
        }

        const user = await User.findById({_id: id})

        if(!user){
            return res.status(401).json({message: "Invalid session"})
        }

        next()


    } catch (error) {
        
        return res.status(500).json({message: error.message})
    }

}