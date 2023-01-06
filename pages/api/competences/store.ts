// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import CompetenceInterface, {
  competenceSchema,
} from "../../../models/competence";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    data?: CompetenceInterface;
    success: boolean;
    message: string;
  }>
) {
  const competenceQuery = req.body;

  const competence = new competenceSchema(competenceQuery);
  competence
    .save()
    .then(() => {
      res
        .status(200)
        .json({ data: competence, success: true, message: "done" });
    })
    .catch(() => {
      res.status(400).json({ message: "Could not be sent", success: false });
    });
}
