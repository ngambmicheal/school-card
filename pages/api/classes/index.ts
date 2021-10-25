// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, {classeSchema} from '../../../models/classe';
import mg from '../../../services/mg';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    // const {name} = req.body;

    const classes = classeSchema.find().populate('students').then(classes => {
                                            res.json({data:classes, status:true});
                                        })
                                        .catch(() => {
                                            res.json({message:'Could not be sent s', success:false });
                                        })  

}
