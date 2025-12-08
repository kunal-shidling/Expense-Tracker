// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export const authenticate = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     console.log("Auth middleware - Headers:", req.headers);
//     console.log("Auth middleware - Token:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "No token provided" });
//     }

//     const token = authHeader.substring(7); // Remove 'Bearer ' prefix

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     console.log("Auth middleware - Token verified for user:", decoded.userId);
    
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Auth middleware error:", error.message);
    
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Token expired" });
//     }
    
//     return res.status(401).json({ error: "Authentication failed" });
//   }
// };
// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalid or expired" });
  }
}
