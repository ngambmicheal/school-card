// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import CompetenceInterface, {
  competenceSchema,
} from "../../../models/competence";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.body;
  competenceSchema
    .findOneAndDelete({ _id })
    .then((competence) => {
      res.json({ data: competence, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
