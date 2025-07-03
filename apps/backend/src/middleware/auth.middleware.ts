import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../modules/auth/service/auth.service';
// import { getTokenFromDB } from '../modules/auth/model/auth.model';

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorizationHeader =
      req.headers.authorization || req.cookies.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authorizationHeader.split(' ')[1];

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    // const TokenInDB = await getTokenFromDB(authorizationHeader);

    // if (!TokenInDB) {
    //   return res
    //     .status(401)
    //     .json({ message: 'Token Not Found. It seems you are logged out!' });
    // }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
