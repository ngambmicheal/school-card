// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {competenceSchema} from '../../../models/competence';
import { courseSchema } from '../../../models/course';
import { schoolSchema } from '../../../models/school';
import { subjectSchema } from '../../../models/subject';
import { HeadersEnum } from '../../../utils/enums';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

  const query ={school:req.headers[HeadersEnum.SchoolId], ...req.query}; 

    const competences = competenceSchema.find(query).populate({path:'school', model:schoolSchema}).populate({path:'subjects', model:subjectSchema, populate:{'path':'courses', model:courseSchema}}).then(competences => {
                                            res.json({data:competences, status:true});
                                        })
                                        .catch((e) => {
                                            res.json({message:e.message, success:false });
                                        })  

}
