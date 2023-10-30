import {Router} from "express";
import path from "path";


export const route=Router();

route.get('/:filename', async(req, res)=>{
    try {
        console.log('ok');
       if(path.join(process.cwd(), "uploads", req.params.filename)) res.sendFile(path.join(process.cwd(), "uploads", req.params.filename));
        
    } catch (error:any) {
        console.log(error.message);
        return error;
    }
})