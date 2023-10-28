import { UserType } from "../types";
import jwt from "jsonwebtoken";



export default {
    sign: (data: {}) => {
        const secret_key: string = process.env.SECRET_KEY || "jwt"
        return jwt.sign(data, secret_key);
    },


    verify: (token: string) => {
        const secret_key: string = process.env.SECRET_KEY || "jwt"
        return jwt.verify(token, secret_key);
    }
};