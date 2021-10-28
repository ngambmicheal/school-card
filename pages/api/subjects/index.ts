// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {subjectSchema} from '../../../models/subject';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const subjects = subjectSchema.find(req.query).populate('school').populate('competence').populate('courses').then(subjects => {
                                            res.json({data:subjects, status:true});
                                        })
                                        .catch((e) => {
                                            res.json({message:e.message, success:false });
                                        })  

}
