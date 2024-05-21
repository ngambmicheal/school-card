// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { competenceSchema } from "../../../models/competence";
import { examSchema } from "../../../models/exam";
import { termSchema } from "../../../models/terms";
import { HeadersEnum } from "../../../utils/enums";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

  let query = req.query; 
  query.session_id = req.headers[HeadersEnum.SchoolSessionId] as string

  const terms = termSchema
    .find(req.query)
    .populate({ path: "exams", model: examSchema })
    .then((terms) => {
      res.json({ data: terms, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
