// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { studentSchema } from "../../../models/student";
import mg from "../../../services/mg";
import { HeadersEnum } from "../../../utils/enums";
import path from 'path'; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  
    const folderPath = path.join(process.cwd(), 'public', 'photos');

    console.log({
        folderPath
    })


    res.json({
        message: "Images updated successfully!"
    })

}   
