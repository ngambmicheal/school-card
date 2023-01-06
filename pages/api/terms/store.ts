// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TermInterface, { termSchema } from "../../../models/terms";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: TermInterface;
    success: boolean;
    message: string;
  }>
) {
  const termQuery = req.body;

  const term = new termSchema(termQuery);
  term
    .save()
    .then(() => {
      res.status(200).json({ data: term, success: true, message: "done" });
    })
    .catch((e) => {
      res.status(400).json({ message: e.message, success: false });
    });
}
