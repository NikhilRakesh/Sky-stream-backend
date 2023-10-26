import User from "../models/userModel.js";

export const addMessage = async (req, res) => {
    
  try {
    

    const { message, to, block } = req.body;
    console.log('req.body',req.body)
    
    const { id } = req.params;

    if (!message || !to) {
      return res.status(401).json({ message: "Please provide all fields" });
    }

    if (!id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById({ _id: to });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    let newMessage = {
      block: block,
      data: message,
    };

    const Updated = await User.findByIdAndUpdate(
      { _id: to },
      { $set: { message: newMessage } },
      { new: true }
    );

    return res.status(201).json({ date: Updated ,message:"Message sent"});
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id, sendId } = req.params;
    console.log('id',id)

    if (!id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let message = {
      block: false,
      data: "",
    };

    const updatedUser = await User.findByIdAndUpdate(
      { _id: sendId },
      { $set: { message: message } },
      { new: true }
    );

    return res.status(201).json({ data: updatedUser,message:"Message deleted" });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
