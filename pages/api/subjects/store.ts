// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SubjectInterface, { subjectSchema } from "../../../models/subject";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: SubjectInterface;
    success: boolean;
    message: string;
  }>
) {
  const subjectQuery = req.body;

  const subject = new subjectSchema(subjectQuery);
  subject
    .save()
    .then(() => {
      res.status(200).json({ data: subject, success: true, message: "done" });
    })
    .catch((e: any) => {
      res.status(400).json({ message: e.message, success: false });
    });
}
