// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import CompetenceInterface, { subjectSchema } from "../../../models/subject";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.body;
  subjectSchema
    .findOneAndDelete({ _id })
    .then((subject) => {
      res.json({ data: subject, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
