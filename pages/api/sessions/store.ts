// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { sessionSchema } from "../../../models/session";
import mg from "../../../services/mg";
import logger from "../../../utils/logger";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: ClasseInterface;
    success: boolean;
    message: string;
  }>
) {
  const { name } = req.body;

  const session = new sessionSchema(req.body);
  session
    .save()
    .then(() => {
      res.status(200).json({ data: session, success: true, message: "done" });
    })
    .catch((e:any) => {
      logger.error(e);
      res.status(400).json({ message: e.message, success: false });
    });
}
