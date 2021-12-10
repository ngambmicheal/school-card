// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import * as  pdf from 'pdf-creator-node';
import fs from 'fs'
import ReactDOMServer from 'react-dom/server';
import resultsUiStats from '../../../assets/jsx/resultsUiStats';
import { examSchema } from '../../../models/exam';
import { examResultSchema } from '../../../models/examResult';
import { schoolSchema } from '../../../models/school';
import { competenceSchema } from '../../../models/competence';
import { studentSchema } from '../../../models/student';
import { subjectSchema } from '../../../models/subject';
import { courseSchema } from '../../../models/course';
import { classeSchema } from '../../../models/classe';
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {exam_id} = req.query

    const exam = await examSchema.findOne({_id:exam_id}).populate({path:'class_id', model:classeSchema});
    const totalResults = await examResultSchema.find({exam_id}).populate({path:'student', model:studentSchema}).sort({number:1}).collation({locale: "en_US", numericOrdering: true})
    const statsResults = await examResultSchema.find({exam_id}).populate({path:'student', model:studentSchema}).sort({rank:1})
    const competences =  await competenceSchema.find({school:exam.class_id.school}).populate({path:'school', model:schoolSchema}).populate({path:'subjects', model:subjectSchema ,populate:{'path':'courses', model:courseSchema}})

    var dir = `./tmp/stats/${exam_id}`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

        var options = {
            format: "A3",
            orientation: "landscape",
            border: "8mm",
            header: {
                height: "10mm",
            },
            footer: {
                height: "10mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    // last: 'Last Page'
                }
            }
        };

        let html = ReactDOMServer.renderToStaticMarkup(resultsUiStats(exam, competences, totalResults, statsResults))
        html+=`
                <style>
                .center{
                    text-align:center
                }
                .table1, .table2{
                    border-collapse: collapse;
                    width: 100%;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    font-size:9px;
                    }
                    .com, b{
                    font-weight: bold;
                    }
                    .table1 td, .table1 th{
                    text-align: center;
                    border: 2px solid #ccc;
                    }

                    .table2 td, .table2 th{
                    text-align: center;
                    }

                    .th{
                    width:300px;
                    }
                </style>
                `

        const pdfResultsDir = `${dir}/${exam_id}.pdf`
        var document = {
            html: html,
            data: {
            },
            path: pdfResultsDir,
            type: "",
          };

          pdf.create(document, options)
          .then((response : any)  => {
            var file = fs.createReadStream(`${dir}/${exam_id}.pdf`);
            var stat = fs.statSync(`${dir}/${exam_id}.pdf`);
            res.setHeader('Content-Length', stat.size);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(`Content-Disposition`, `attachment; filename=stats.pdf`);
            file.pipe(res);
          })
          .catch((error : any) => {
            console.error(error);
            res.json({message:error.message, success:false });
            console.log('thisfile isnot react')
          })
   
}
