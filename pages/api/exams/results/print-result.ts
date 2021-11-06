// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import SubjectInterface, {examSchema} from '../../../../models/exam';
import { examResultSchema } from '../../../../models/examResult';
import { studentSchema } from '../../../../models/student';
import * as  pdf from 'pdf-creator-node';
import fs from 'fs'
import CompetenceInterface, { competenceSchema } from '../../../../models/competence';
import ReactDOMServer from 'react-dom/server';
import resultsActions from '../../../../assets/jsx/resultsActions';

export const getCompetencesLenght = (competence:CompetenceInterface) => {
    let total = 0; 
    competence.subjects && competence.subjects.map(s => {
        total+= s.courses?.length ?? 0  
        total+=1;
    })
    return total; 
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const {result} = req.query

    const competences =  await competenceSchema.find().populate('school').populate({path:'subjects',populate:{'path':'courses'}})

    examResultSchema.findOne({_id:result}).populate('student').populate({path:'exam_id',populate:{'path':'class_id'}}).then(async results => {
        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "0mm",
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

        const total = await examResultSchema.find({exam_id:results.exam_id}).count();
        console.log(total);

        let html = ReactDOMServer.renderToStaticMarkup(resultsActions(competences, results, total ))
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
                    font-size:10px;
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
                </style>
                `


        var document = {
            html: html,
            data: {
              competences : competences.map(s => {
                    s.s_l = getCompetencesLenght(s)
                    return s;
              }),
              results : results
            },
            path: "./teacher.pdf",
            type: "",
          };

          pdf.create(document, options)
          .then((response : any)  => {
                var file = fs.createReadStream('./teacher.pdf');
                var stat = fs.statSync('./teacher.pdf');
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader(`Content-Disposition`, `attachment; filename=${results.student.name}.pdf`);
                file.pipe(res);
                console.log('thie file isreac')
          })
          .catch((error : any) => {
            console.error(error);
            res.json({message:error.message, success:false });
            console.log('thisfile isnot react')
          });
    })
    .catch((e) => {
        res.json({message:e.message, success:false });
    })  
}
