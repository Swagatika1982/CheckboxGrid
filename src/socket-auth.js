import { verifyAccessToken } from "./common/utils/jwt.utils.js";
import User from "./module/auth/auth.model.js";

export async function socketAuthMiddleware(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      socket.user = null; // anonymous user
      return next();
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      socket.user = null;
      return next();
    }

    socket.user = {
      id: user._id.toString(),
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    socket.user = null;
    next();
  }
}