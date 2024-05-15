// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../../models/classe";
import SectionInterface, { sectionSchema } from "../../../../models/section";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.query;
  classeSchema
    .findOne({ _id })
    .populate({ path: "section", sectionSchema })
    .then((classe) => {
      res.json({ data: classe, status: true });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
