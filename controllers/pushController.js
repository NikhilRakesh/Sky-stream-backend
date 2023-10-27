import Channel from "../models/channelModel";
import Eadge from "../models/eadgeModel";
import User from "../models/userModel";

export const pushStream = async (req, res) => {
  try {
    const { userId, channelId } = req.params;
    const { edge } = req.body;

    if (!userId || !channelId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById({ _id: userId });

    if (!user.superAdmin) {
      return res.status(401).json({ message: "You are not an Admin" });
    }

    const channel = await Channel.findById(channelId);

    const newName = channel.streamKey.split("/")[1];

    const newEdge = new Eadge({
      name: newName,
      edge: edge,
      channelId:channel._id
    });

    await newEdge
      .save()
      .then((data) => console.log(data))
      .then((data) => res.status(200).json(data))
      .catch((err) =>
        res.status(500).json({ message: "Internal Server error" })
      );
  } catch (error) {

    res.status(500).json({ message: "Internal Server error" });

  }
};


export const deletePush = async (req,res) =>{
    try {
        
        const {channelId} = req.params

        if(!channelId){
            return res.status(401).json({ message: "Not authorized" });
        }

         const edge = await Eadge.deleteOne({channelId:channelId}).catch((err)=>{
            console.log(err.message)
            return res.status(204)
         })


    } catch (error) {
          res.status(500).json({ message: "Internal Server error" });        
    }
}