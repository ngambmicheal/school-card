// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SectionInterface, { sectionSchema } from "../../../models/section";
import mg from "../../../services/mg";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: SectionInterface;
    success: boolean;
    message: string;
  }>
) {
  const { name } = req.body;

  const section = new sectionSchema(req.body);
  section
    .save()
    .then(() => {
      res.status(200).json({ data: section, success: true, message: "done" });
    })
    .catch((e) => {
      res.status(400).json({ message: e.message, success: false });
    });
}
