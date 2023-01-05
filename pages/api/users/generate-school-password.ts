// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { schoolSchema } from '../../../models/school';
import { userSchema } from '../../../models/user';
import { generateRandomString } from '../../../utils/calc';
import { HeadersEnum } from '../../../utils/enums';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

  const query ={school_id:req.headers[HeadersEnum.SchoolId], ...req.query}; 

  const school = await schoolSchema.findOne({_id: req.headers[HeadersEnum.SchoolId]})

  userSchema.find(query).populate({path:'school_id', model:schoolSchema}).collation({locale: "en_US", numericOrdering: true}).then(users => {

            users.map(async user => {
                await userSchema.updateOne({_id:user._id}, {password: generateRandomString(school.staff_password_length??8)})
            })
            res.json({data:users, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
