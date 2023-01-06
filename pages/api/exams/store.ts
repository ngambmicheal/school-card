// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import ExamInterface, { examSchema } from "../../../models/exam";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: ExamInterface;
    success: boolean;
    message: string;
  }>
) {
  const examQuery = req.body;

  const exam = new examSchema(examQuery);
  exam
    .save()
    .then(() => {
      res.status(200).json({ data: exam, success: true, message: "done" });
    })
    .catch(() => {
      res.status(400).json({ message: "Could not be sent", success: false });
    });
}
