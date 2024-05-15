// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import { schoolSchema } from "../../../models/school";
import { sectionSchema } from "../../../models/section";
import { sessionSchema } from "../../../models/session";
import mg from "../../../services/mg";
import { HeadersEnum } from "../../../utils/enums";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = { school: req.headers[HeadersEnum.SchoolId], ...req.query };

  return sessionSchema
    .find(query)
    .populate({ path: "school", model: schoolSchema })
    .then((sessions) => {
      res.json({ data: sessions, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
