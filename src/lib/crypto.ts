import bcrypt from "bcrypt"




export default{
    hash:(pass:string)=>{
        const salr:number=Number(process.env.SALT_ROUNDS) || 3;
        return bcrypt.hash(pass, salr);
    },

    compare:(pass:string, hashPass:string)=>{
return bcrypt.compare(pass, hashPass);
    }
}