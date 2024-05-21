// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { competenceSchema } from "../../../models/competence";
import { subjectSchema } from "../../../models/subject";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const competences = competenceSchema
    .find()
    .then((competences) => {
      competences.map((competence) => {
        console.log(competence);
        subjectSchema
          .find({ competence: competence._id })
          .select("_id")
          .then((subjects) => {
            const sub = subjects.map((s) => s._id);
            console.log(sub);
            competenceSchema
              .findOneAndUpdate({ _id: competence._id }, { subjects: sub })
              .then((c) => {
                console.log(c);
              });
          });
      });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    })
    .finally(() => {
      res.json({ message: "Done", success: false });
    });
}
