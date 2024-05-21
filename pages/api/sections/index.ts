// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { schoolSchema } from "../../../models/school";
import SectionInterface, { sectionSchema } from "../../../models/section";
import mg from "../../../services/mg";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // const {name} = req.body;

  const sections = sectionSchema
    .find(req.query)
    .populate({ path: "school", model: schoolSchema })
    .then((sections) => {
      res.json({ data: sections, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
