// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {competenceSchema} from '../../../models/competence';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const competences = competenceSchema.find().populate('school').populate({path:'subjects',populate:{'path':'courses'}}).then(competences => {
                                            res.json({data:competences, status:true});
                                        })
                                        .catch((e) => {
                                            res.json({message:e.message, success:false });
                                        })  

}
