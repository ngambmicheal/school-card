// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import CompetenceInterface, { studentSchema } from "../../../models/student";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.body;

  studentSchema
    .aggregate([
      {
        $group: {
          _id: { slug: "$name" },
          slugs: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ])
    .then((docs) => {
      docs.map((doc) => {
        doc.slugs.shift();
        console.log(doc.slugs);
        studentSchema
          .deleteMany({
            _id: { $in: doc.slugs },
          })
          .then((rs) => {
            console.log(rs);
          });
      });
    });
  //    }).forEach(function(doc) {
  //       doc.slugs.shift();
  //       studentSchema.remove({
  //           _id: {$in: doc.slugs}
  //       });
  //    })
}
