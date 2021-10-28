// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, {classeSchema} from '../../../models/classe';
import { studentSchema } from '../../../models/student';
import mg from '../../../services/mg';



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {class_id} = req.query
    studentSchema.find().then(students => {
        res.json({students, success:false });
            // students.map(s => {
            //     console.log(s.class_id)
            //     studentSchema.findOneAndUpdate({_id:s._ids}, {class_id:s.class_id}).then((ss) => 
            //     console.log(ss)
            //     )
            // })
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
