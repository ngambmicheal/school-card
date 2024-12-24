// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SubjectInterface, { examSchema } from "../../../models/exam";
import { examResultSchema } from "../../../models/examResult";
import { studentSchema } from "../../../models/student";
import { termSchema } from "../../../models/terms";

export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { student_id, session_id, type  } = req.query;
    const exams = await examSchema.find({ session_id });
    const terms = await termSchema.find({ session_id });

    const results = await examResultSchema.find({ student: student_id, $or:[
                                            {exam_id: { $in: exams.map(exam => exam._id)} }, 
                                            {term_id: { $in: terms.map(term => term._id)}}
                                          ]})
                                          .populate({ path: "exam_id", model: examSchema })
                                          .populate({ path: "term_id", model: termSchema });
    res.status(200).json({ data: results });

}
