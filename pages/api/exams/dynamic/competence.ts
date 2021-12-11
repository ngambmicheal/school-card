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
import resultsDynamicActions from '../../../../assets/jsx/resultsDynamicActions';
import TermInterface, { termSchema } from '../../../../models/terms';
  

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {term_id} = req.query

    const term:TermInterface = await termSchema.findOne({_id:term_id}).populate({path:'class', model:classeSchema})
    const exams = await examSchema.find({_id:{$in:term.exams}})
    const totalResults = await (await examResultSchema.find({term_id}).populate({path:'student', model:studentSchema}).sort({rank:1})).filter(re => getTotal(re) != 0)
    const competences =  await competenceSchema.find({school:term.class.school, report_type:term.report_type}).populate({path:'school', model:schoolSchema}).populate({path:'subjects', model:subjectSchema ,populate:{'path':'courses', model:courseSchema}})

    var dir = `./tmp/terms/${term_id}`;
    var zipOutput = fs.createWriteStream(`./public/terms/${term_id}.zip`);
    var zipDir = `./public/terms/${term_id}.zip`;
    var archive = archiver('zip');

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    totalResults.map(async (results) => {
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

        const examResults =  await examResultSchema.find({student:results.student._id, exam_id:{ $in: term.exams}})
 
        let html = ReactDOMServer.renderToStaticMarkup(resultsDynamicActions(competences, results, totalResults.length, totalResults, examResults, exams, term))
        html+=`
        <style>
        .center{
            text-align:center
        }
        .table1, .table2, .table3{
            border-collapse: collapse;
            font-weight:bold;
            width: 100%;
            margin-top: 10px;
            margin-bottom: 0px;
            font-size:9px;
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
            font-size:10px;
        }
        .bord {
            border: 1px solid red;
            position: absolute;
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
    res.setHeader(`Content-Disposition`, `attachment; filename=${term_id}.zip`);
    file.pipe(res);
}
