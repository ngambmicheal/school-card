// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { schoolSchema } from "../../../models/school";
import mg from "../../../services/mg";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { class_id } = req.query;
  schoolSchema
    .find(req.query)
    .then((schools) => {
      console.log(schools);
      res.json({ data: schools, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
