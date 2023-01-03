// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, { classeSchema } from '../../../models/classe';
import UserInterface, { userSchema } from '../../../models/user';
import { HeadersEnum } from '../../../utils/enums';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{data?:UserInterface, success:boolean, message:string}>
) {

    const userQuery = req.body;

    userQuery.username = userQuery.email;
    userQuery.school_id = req.headers[HeadersEnum.SchoolId]

    const user = new userSchema(userQuery)
    user.save().then(()=>{
                    res.status(200).json({data:user, success:true, message:'done'});
                })
                .catch(() => {
                    res.status(400).json({message:'Could not be sent', success:false });
                })

}
