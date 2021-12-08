// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { competenceSchema } from '../../../models/competence';
import { examSchema } from '../../../models/exam';
import { termSchema} from '../../../models/terms';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

  console.log(req.query);
    const terms = termSchema.find(req.query).populate({path:'exams', model:examSchema}).then(terms => {
                        res.json({data:terms, status:true});
                    })
                    .catch((e) => {
                        res.json({message:e.message, success:false });
                    })  

}
