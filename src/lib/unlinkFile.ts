import {unlinkSync} from "fs";


export default (x:string)=>{
unlinkSync("uploads/"+x);
console.log("unlink");

}