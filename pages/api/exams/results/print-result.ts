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
import { schoolSchema } from '../../../../models/school';
import { subjectSchema } from '../../../../models/subject';
import { classeSchema } from '../../../../models/classe';
import { courseSchema } from '../../../../models/course';
import { getTotal } from '../../../../assets/jsx/resultsUiStats';
import { sectionSchema } from '../../../../models/section';
import serverPath from '../../../../services/serverpath';
import { logo } from '../../../../assets/jsx/image';
import { bgImgStyle } from '../../../../utils/styles';


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

    try{

    
    const url = serverPath('teacher.pdf');
    fs.createWriteStream(url)

    const {result} = req.query

    examResultSchema.findOne({_id:result}).populate({path:'student', model:studentSchema}).populate({path:'exam_id', model:examSchema, populate:{'path':'class_id', model:classeSchema, populate:{'path':'section', model:sectionSchema}}}).then(async results => {
       
        const competences =  await competenceSchema.find({school:results.exam_id.class_id.school, report_type:results.exam_id.class_id.section.report_type}).populate({path:'school', model:schoolSchema}).populate({path:'subjects', model:subjectSchema ,populate:{'path':'courses', model:courseSchema}})

        var options = {
            format: "A4",
            orientation: "portrait",
            border: "10mm",
            header: {
                height: "3.5mm",

                contents: {
                    2: '',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    // last: 'Last Page'
                }
            },
            footer: {
                height: "12mm",
                contents: {
                    first: '',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                    // last: 'Last Page'
                }
            }
        };


        const totalResults = await(await examResultSchema.find({exam_id:results.exam_id, ignore:{ $ne:true }}).populate({path:'student', model:studentSchema}).sort({rank:1})).filter(re => getTotal(re) != 0)

        let html = ReactDOMServer.renderToStaticMarkup(resultsActions(competences, results, totalResults.length, totalResults ))
        html+=`
                <style>
                  ${bgImgStyle}
           
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
                    z-index:2
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

            console.log(html)


        var document = {
            html: html,
            data: {
              competences : competences.map(s => {
                    s.s_l = getCompetencesLenght(s)
                    return s;
              }),
              results : results
            },
            path:url,
            type: "",
          };

          pdf.create(document, options)
          .then((response : any)  => {
                var stat = fs.statSync(url);
                const file = fs.createReadStream(url);
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
    catch(e) {
        res.json({e})
    }


}
