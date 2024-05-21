// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { competenceSchema } from "../../../models/competence";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id, ...obj } = req.body;

  competenceSchema
    .findOneAndUpdate({ _id }, obj)
    .then((exam) => {
      res.json({ data: exam, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
