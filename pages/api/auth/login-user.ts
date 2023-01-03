import { NextApiRequest, NextApiResponse } from "next";
import { userSchema } from "../../../models/user";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) { 

    const {username, password} = req.body;

    if(!(username && password)){
        res.send(false)
    }

    const user = await userSchema.findOne({username, password})

    if(user){
      return res.json(user)
    }
    
    res.send(false)
  }
  