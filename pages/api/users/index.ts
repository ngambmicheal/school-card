// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { schoolSchema } from '../../../models/school';
import { userSchema } from '../../../models/user';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {school_id} = req.query
    userSchema.find(req.query).populate({path:'school_id', model:schoolSchema}).collation({locale: "en_US", numericOrdering: true}).then(users => {
            res.json({data:users, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
