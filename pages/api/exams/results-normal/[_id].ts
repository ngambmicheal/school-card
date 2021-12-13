// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { examSchema } from '../../../../models/exam';
import { studentSchema } from '../../../../models/student';

import * as  pdf from 'pdf-creator-node';
import fs from 'fs'
import { examResultSchema } from '../../../../models/examResult';
import { competenceSchema } from '../../../../models/competence';
import { subjectSchema } from '../../../../models/subject';
import { getCompetencesLenght } from './dynamic-print';
import resultsActions from '../../../../assets/jsx/resultsActions';
import ReactDOMServer from 'react-dom/server';
import archiver from 'archiver';
import { schoolSchema } from '../../../../models/school';
import { courseSchema } from '../../../../models/course';
import { classeSchema } from '../../../../models/classe';
import { sectionSchema } from '../../../../models/section';
import resultsNormalActions from '../../../../assets/jsx/resultsNormalActions';
import { getTotal } from '../../../../assets/jsx/resultsNormalUiStats';
import { replaceAll } from '../../../../services/utils';
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {_id:exam_id} = req.query

    const exam = await examSchema.findOne({_id:exam_id}).populate({path:'class_id', model:classeSchema, 'populate':{path:'section', sectionSchema}});

    const totalResults = await (await examResultSchema.find({exam_id}).populate({path:'student', model:studentSchema}).populate({path:'exam_id', model:examSchema, populate:{'path':'class_id', model:classeSchema, populate:{'path':'section', model:sectionSchema}}}).sort({rank:1}))
    const subjects =  await subjectSchema.find({school:exam.class_id.school, report_type:exam.class_id.section.report_type}).populate({path:'school', model:schoolSchema});

    const zipName = `${replaceAll(' ', '_', exam.class_id.name)}__${exam.name}`
    var dir = `./tmp/exams/${zipName}`;
    var termsDir = './public/exams';
    var zipOutput = fs.createWriteStream(`./public/exams/${zipName}.zip`);
    var zipDir = `./public/exams/${zipName}.zip`;
    var archive = archiver('zip');

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(termsDir)){
        fs.mkdirSync(termsDir, { recursive: true });
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

        let html = ReactDOMServer.renderToStaticMarkup(resultsNormalActions(subjects, results, totalResults.length, totalResults))
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
                    border: 1px solid #555;
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
                </style>
                `

        const pdfResultsDir = `${dir}/${replaceAll(' ', '_', results.student.name)}.pdf`
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
    res.setHeader(`Content-Disposition`, `attachment; filename=${zipName}.zip`);
    file.pipe(res);
}
