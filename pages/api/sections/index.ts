// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SectionInterface, {sectionSchema} from '../../../models/section';
import mg from '../../../services/mg';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    // const {name} = req.body;

const sections = sectionSchema.find(req.query).populate('school').then(sections => {
                                        res.json({data:sections, status:true});
                                    })
                                    .catch((e) => {
                                        res.json({message:e.message, success:false });
                                    })  

}
