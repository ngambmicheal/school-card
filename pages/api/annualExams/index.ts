// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { annualExamSchema } from "../../../models/annualExam";
import { competenceSchema } from "../../../models/competence";
import { examSchema } from "../../../models/exam";
import { termSchema } from "../../../models/terms";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  annualExamSchema
    .find(req.query)
    .populate({ path: "terms", model: termSchema })
    .then((terms) => {
      res.json({ data: terms, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
