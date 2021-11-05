// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { examSchema } from '../../../../models/exam';
import { studentSchema } from '../../../../models/student';

import * as  pdf from 'pdf-creator-node';
import fs from 'fs'
import { examResultSchema } from '../../../../models/examResult';
import { competenceSchema } from '../../../../models/competence';
import { subjectSchema } from '../../../../models/subject';
const html = fs.readFileSync("assets/teacher.html", "utf8");


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {exam_id} = req.query

    const results = await examResultSchema.find({exam_id}).sort({rank:1})
    const competences =  await competenceSchema.find().populate('school').populate({path:'subjects',populate:{'path':'courses'}})

    try{

        var options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "45mm",
                contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
            },
            footer: {
                height: "28mm",
                contents: {
                    first: 'Cover page',
                    2: 'Second page', // Any page number is working. 1-based index
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    last: 'Last Page'
                }
            }
        };

        var document = {
            html: html,
            data: {
              competences : competences.map(s => {
                    return s
              }),
              results : results.map(s => {
                  return s
              })
            },
            path: "./teacher.pdf",
            type: "",
          };

          pdf.create(document, options)
          .then((res : any)  => {
                var file = fs.createReadStream('./teacher.pdf');
                var stat = fs.statSync('../teacher.pdf');
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
                file.pipe(res);
          })
          .catch((error : any) => {
            console.error(error);
          });
    }
    catch(e:any) {
        res.json({message:e.message, success:false });
    }  

}
