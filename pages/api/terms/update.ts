// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TermInterface, { termSchema } from "../../../models/terms";
import { examResultSchema } from "../../../models/examResult";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id, slug, name} =
    req.body;

  termSchema
    .findOneAndUpdate({ _id }, { slug, name })
    .then((exam) => {
      res.json({ data: exam, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
