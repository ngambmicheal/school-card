// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { examSchema } from '../../../../models/exam';
import { studentSchema } from '../../../../models/student';

import * as  pdf from 'pdf-creator-node';
import fs from 'fs'
import { examResultSchema } from '../../../../models/examResult';
import { competenceSchema } from '../../../../models/competence';
import { subjectSchema } from '../../../../models/subject';
import { getCompetencesLenght } from './print-result';
import resultsActions from '../../../../assets/jsx/resultsActions';
import ReactDOMServer from 'react-dom/server';
import archiver from 'archiver';
import { schoolSchema } from '../../../../models/school';
import { courseSchema } from '../../../../models/course';
import { classeSchema } from '../../../../models/classe';
import { sectionSchema } from '../../../../models/section';
import { getTotal, getTotalPoints, getTotals } from '../../../../assets/jsx/resultsUiStats';
import resultsMatActions from '../../../../assets/jsx/resultsMatActions';
import resultsNurseryActions from '../../../../assets/jsx/resultsNurseryActions';
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id:exam_id} = req.query

    const exam = await examSchema.findOne({_id:exam_id}).populate({path:'class_id', model:classeSchema, 'populate':{path:'section', sectionSchema}});

    const totalResults = await (await examResultSchema.find({exam_id}).populate({path:'student', model:studentSchema}).sort({rank:1}))
    const competences =  await competenceSchema.find({school:exam.class_id.school, report_type:exam.class_id.section.report_type}).populate({path:'school', model:schoolSchema}).populate({path:'subjects', model:subjectSchema ,populate:{'path':'courses', model:courseSchema}})
    var dir = `./tmp/exams/${exam_id}`;
    var zipOutput = fs.createWriteStream(`./public/exams/${exam_id}.zip`);
    var zipDir = `./public/exams/${exam_id}.zip`;
    var archive = archiver('zip');

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    totalResults.map((results) => {
        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "0mm",
            },
            footer: {
                height: "0mm",
                contents: {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    // last: 'Last Page'
                }
            }
        };

        let html = ReactDOMServer.renderToStaticMarkup(resultsNurseryActions(competences, results, totalResults.length, totalResults))
        html+=`
                <style>
                .center{
                    text-align:center
                }
                .table1, .table2, .table3{
                    border-collapse: collapse;
                    width: 100%;
                    margin-top: 2px;
                    margin-bottom: 5px;
                    font-size:8px;
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

                    .table3 {
                        font-size:9px;
                    }

                    input[type='checkbox']{
                        transform: scale(2);
                      }
                </style>
                `

        const pdfResultsDir = `${dir}/${results._id}.pdf`
        var document = {
            html: html,
            data: {
            },
            path: pdfResultsDir,
            type: "",
          };

          pdf.create(document, options)
          .then((response : any)  => {
          })
          .catch((error : any) => {
            console.error(error);
            res.json({message:error.message, success:false });
            console.log('thisfile isnot react')
          });
    })
   

    archive.pipe(zipOutput);
    archive.directory(dir, false);
    archive.finalize()

    var file = fs.createReadStream(zipDir);
    var stat = fs.statSync(zipDir);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(`Content-Disposition`, `attachment; filename=${exam_id}.zip`);
    file.pipe(res);
}