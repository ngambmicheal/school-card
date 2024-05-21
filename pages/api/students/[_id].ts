// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { classeSchema } from "../../../models/classe";
import { examSchema } from "../../../models/exam";
import { examResultSchema } from "../../../models/examResult";
import { studentSchema } from "../../../models/student";
import { userSchema } from "../../../models/user";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.query;
  
  try{
    const student =   await studentSchema
                    .findOne({ _id })
                    .populate({ path: "user_id", model:userSchema })
                    .populate({ path: "class_id", model: classeSchema})
    
    const exams = await examResultSchema.find({student:_id}).populate({ path: 'exam_id', model: examSchema})
    res.json({message: 'done', data:{...student, exams}, success:true})

  }
  catch(e){
    res.json({ message: e.message, success: false });
  } 
}
