// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SubjectInterface, { examSchema } from "../../../models/exam";
import { examResultSchema } from "../../../models/examResult";
import { studentSchema } from "../../../models/student";

export  default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { student_id, session_id  } = req.query;

  const results = await examResultSchema.find({ student: student_id }).populate({ path: "exam_id", model: examSchema });
  res.status(200).json({ data: results });

}
