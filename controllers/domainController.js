import Domain from "../models/domainModel.js";
import User from "../models/userModel.js";

export const createDomain = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { domain } = req.body;
    const id = req.params.userId;
    console.log("req.params", req.params);

    if (!id) return res.status(401).json({ message: "User id is required" });

    if (!domain) return res.status(401).json({ message: "Domain is required" });

    const newDomain = new Domain({ domain })
    
    await newDomain
      .save()
      .then((data) => {
        res.status(200).json({ message: "Domain created successfully", data });
      })
      .catch((err) => {
        res.status(400).json({ message: "Domain creation failed", err });
      });

  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Domain creation failed", error });
  }
};

export const deleteDomain = async (req, res) => {
  try {
    const id = req.params.domainId;

    if (!id) return res.status(400).json({ message: "Domain id is required" });

    const domain = await Domain.findByIdAndDelete(id);

    if (!domain) return res.status(400).json({ message: "Domain not found" });

    res.status(200).json({ message: "Domain deleted successfully", domain });

    restartServer()

  } catch (error) {
    res.status(500).json({ message: "Domain deletion failed", error });
  }
};

export const getDomain = async (req, res) => {
  try {
    const id = req.params.userId;

    if (!id) return res.status(400).json({ message: "User id is required" });

    const user = await User.findById(id);

    if (!user) return res.status(400).json({ message: "User not found" });

    const domain = await Domain.find();
    return res.status(200).json({ message: "Domain found", domain });

  } catch (error) {
    res.status(500).json({ message: "Domain not found", error });
  }
};
