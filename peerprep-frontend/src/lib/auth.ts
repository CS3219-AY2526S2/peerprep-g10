import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  exp: number;
  username: string;
  email: string;
}

export const getRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Expiration Check
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Session expired");
      return null; // Token is expired
    }

    return decoded.role;
  } catch (error) {
    return null; // Token is malformed
  }
};