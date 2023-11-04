import jwt from "jsonwebtoken";

export const jwtMiddleware = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(401).json({ message: "No cookies provided" });
    }

    const token = await cookies.split("=")[1];

    if (!token) {
      return res
        .clearCookie("cookie")
        .status(401)
        .json({ message: "Invalid token no" });
    }

    const decoded =  jwt.verify(token, process.env.JWT_SECRET);


    if (!decoded) {
      return res
        .clearCookie("cookie")
        .status(401)
        .json({ message: "Invalid token" });
    }

   
    next();
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Invalid token internal", error: err.meassage });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(401).json({ message: "No cookies provided" });
    }

    const prevToken = cookies.split("=")[1];

    if (!prevToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    jwt.verify(prevToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .clearCookie(String('cookie'))
          .status(403)
          .json({ message: "Invalid token", error: err.message });
      }

      const token = jwt.sign({ id: 'cookie' }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      if (!token) {
        return res
          .clearCookie(String('cookie'))
          .status(403)
          .json({ message: "Invalid token", error: "Failed to refresh token" });
      }

      res
        .clearCookie(String('cookie')).cookie(String('cookie'), token, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          httpOnly: true,
          sameSite: "lax",
        })
        .status(200)
        .json({ message: "Token refreshed successfully" });

      
      next();
    });

    
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogout = async (req, res) => {
  try {
    const cookies = req.headers.cookie;
    console.log(cookies, "cookies");
    if (!cookies) {
      return res.status(401).json({ message: "No cookies provided" });
    }

    const prevToken = cookies.split("=")[1];

    if (!prevToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    jwt.verify(prevToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res
          .status(403)
          .json({ message: "Invalid token internal", error: err.message });
      }

      res
        .clearCookie(String(decoded.id))
        .status(200)
        .json({ message: "User logged out successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
