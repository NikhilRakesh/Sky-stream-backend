//REQUIRING THE USER SCHEMA 
import User from "../models/userModel.js"


export const users = async (req, res) => {
  try {
    const { id } = req.params //IF THE ID IS GETTING FROM THE PARAMS THEN IT WILL SAVE ON THE VARIABLE ID
    
    //CHECKING THE CONDITION IF THERE IS NO ID THEN I WILL SHOW ALL THE USER DETAILS
    if (!id) {
      const user = await User.find({ superAdmin: false });
      return res.status(201).json({ user });
    }

    //CHECKING THECONDITION IF THE ID THEN IT WILL RETURN THE MATCHED FROM FROM THE USER LIST
    if (id) {
      const user = await User.findById(id) //GET THE USERES FROM THE MONGODB

      //CHECKING THE CONDITION IF THE USER IS NOT THERE IN THE MONGODB 
      if (!user) {
        return res.status(401).json({ error: `No such a user by this id ${id}` }) 
      }

      // RETURNING IF THE USER IS THERE
      return res.status(201).json({ user });
    }


  } catch (error) {
    res.status(500).json(error.message) //HANDLING THE ERROR IF THESE CODE NOT WORKING THEN IT WILL RETURN THE CATCH MATHOD AND HANDLE THE ERROR

  }

}


