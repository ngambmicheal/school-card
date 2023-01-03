// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { schoolSchema } from '../../../models/school';
import CompetenceInterface, {competenceSchema} from '../../../models/competence';
import { studentSchema } from '../../../models/student';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id} = req.body
    schoolSchema.findOneAndDelete({_id}).then(competence => {
        res.json({data:competence, status:true});
    })
    .catch((e) => {
        res.json({message:e.message, success:false });
    })  

}
