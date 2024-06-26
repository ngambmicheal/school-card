// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SubjectInterface, { examSchema } from "../../../models/exam";
import { examResultSchema } from "../../../models/examResult";
import annualExam from "../../classes/modals/annual-exam";
import { annualExamSchema } from "../../../models/annualExam";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id, exam_id, student, createdAt, updatedAt, __v, class_id, ...obj } =
    req.body;

    annualExamSchema
    .findOneAndUpdate({ _id }, obj)
    .then((exam) => {
      res.json({ data: exam, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
