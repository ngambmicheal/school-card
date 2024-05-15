// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TermInterface, { termSchema } from "../../../models/terms";
import { HeadersEnum } from "../../../utils/enums";

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
  termQuery.session_id = req.headers[HeadersEnum.SchoolSessionId] as string

  const term = new termSchema(termQuery);
  term
    .save()
    .then(() => {
      res.status(200).json({ data: term, success: true, message: "done" });
    })
    .catch((e:any) => {
      res.status(400).json({ message: e.message, success: false });
    });
}
