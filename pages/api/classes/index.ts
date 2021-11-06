// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, {classeSchema} from '../../../models/classe';
import { schoolSchema } from '../../../models/school';
import { sectionSchema } from '../../../models/section';
import mg from '../../../services/mg';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    // const {name} = req.body;

    const classes = classeSchema.find(req.query).populate({path:'school', model:schoolSchema}).populate({path:'section', model:sectionSchema}).then(classes => {
                                            res.json({data:classes, status:true});
                                        })
                                        .catch((e) => {
                                            res.json({message:e.message, success:false });
                                        })  

}
