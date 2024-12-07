// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import ExamInterface, { examSchema } from "../../../models/exam";
import { HeadersEnum } from "../../../utils/enums";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: ExamInterface[];
    success: boolean;
    message: string;
  }>
) {
  const examQuery = req.body.exam;

  examQuery.session_id = req.headers[HeadersEnum.SchoolSessionId] as string

  const classes = req.body.classes as string [];

  Promise.all(
    classes.map(class_id => {
        examQuery.class_id = class_id; 
        const exam = new examSchema(examQuery)
        return exam.save();

    })
  )
    .then((exams) => {
        res.status(200).json({ data: exams, success: true, message: "done" });
    })
    .catch(() => {
        res.status(400).json({ message: "Could not be sent", success: false });
    });
}
