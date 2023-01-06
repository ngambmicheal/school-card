// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../models/classe";
import mg from "../../../services/mg";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.query;
  classeSchema
    .findOne({ _id })
    .then((classe) => {
      res.json({ data: classe, status: true });
    })
    .catch(() => {
      res.json({ message: "Could not be sent s", success: false });
    });
}
