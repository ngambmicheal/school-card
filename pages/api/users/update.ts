// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { subjectSchema } from '../../../models/subject';
import { userSchema } from '../../../models/user';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id, ...obj} = req.body

    obj.username = obj.email;

    userSchema.findOneAndUpdate({_id},obj).then(user => {
            res.json({data:user, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
