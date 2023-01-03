// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, { classeSchema } from '../../../models/classe';
import mg from '../../../services/mg';
import logger from '../../../utils/logger';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{data?:ClasseInterface, success:boolean, message:string}>
) {

    const {name} = req.body;

    const classe = new classeSchema(req.body)
    classe.save().then(()=>{
        res.status(200).json({data:classe, success:true, message:'done'});
    }).catch((e) => {
      logger.error(e)
        res.status(400).json({message:e.message, success:false });
    })  
}
