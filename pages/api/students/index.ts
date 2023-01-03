// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ClasseInterface, {classeSchema} from '../../../models/classe';
import { studentSchema } from '../../../models/student';
import mg from '../../../services/mg';
import { HeadersEnum } from '../../../utils/enums';



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {class_id} = req.query

    const classes = (await classeSchema.find({school: req.headers[HeadersEnum.SchoolId]})).map(classe => classe._id)

    const query = {...req.query, class_id:{$in:classes}}

    studentSchema.find(query).populate({path:'class_id', model:classeSchema}).collation({locale: "en_US", numericOrdering: true}).then(students => {
            res.json({data:students, status:true});
        })
        .catch((e) => {
            res.json({message:e.message, success:false });
        })  

}
