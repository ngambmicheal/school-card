// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { classeSchema } from "../../../models/classe";
import ExamInterface from "../../../models/exam";
import SubjectInterface, { examSchema } from "../../../models/exam";
import { sectionSchema } from "../../../models/section";
import { sessionSchema } from "../../../models/session";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.query;
  examSchema
    .findOne({ _id })
    .populate({
      path: "class_id",
      model: classeSchema,
      populate: { path: "section", model: sectionSchema },
    })
    .populate({
      path: "session_id",
      model: sessionSchema,
    })
    .then((exam) => {
      res.json({ data: exam, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}


export async function getExam(exam_id:string): Promise<ExamInterface | null>{
  const exam = await  examSchema
  .findOne({ _id: exam_id })
  .populate({
    path: "class_id",
    model: classeSchema,
    populate: { path: "section", model: sectionSchema },
  })
  .populate({
    path: "session_id",
    model: sessionSchema,
  })

  return exam;
}