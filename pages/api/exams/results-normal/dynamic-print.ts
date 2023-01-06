// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import SubjectInterface, { examSchema } from "../../../../models/exam";
import { examResultSchema } from "../../../../models/examResult";
import { studentSchema } from "../../../../models/student";
import * as pdf from "pdf-creator-node";
import fs from "fs";
import CompetenceInterface, {
  competenceSchema,
} from "../../../../models/competence";
import ReactDOMServer from "react-dom/server";
import resultsActions from "../../../../assets/jsx/resultsActions";
import { schoolSchema } from "../../../../models/school";
import { subjectSchema } from "../../../../models/subject";
import { classeSchema } from "../../../../models/classe";
import { courseSchema } from "../../../../models/course";
import resultsNormalActions from "../../../../assets/jsx/resultsNormalActions";
import { sectionSchema } from "../../../../models/section";
import { getTotal } from "../../../../assets/jsx/resultsNormalUiStats";
import TermInterface, { termSchema } from "../../../../models/terms";
import resultsDynamicNormalActions from "../../../../assets/jsx/resultsDynamicNormalActions";

export const getCompetencesLenght = (competence: CompetenceInterface) => {
  let total = 0;
  competence.subjects &&
    competence.subjects.map((s) => {
      total += s.courses?.length ?? 0;
      total += 1;
    });
  return total;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { term_id, student_id } = req.query;

  const term: TermInterface = await termSchema
    .findOne({ _id: term_id })
    .populate({ path: "class", model: classeSchema });
  const exams = await examSchema.find({ _id: { $in: term.exams } });

  const examResults = await examResultSchema.find({
    student: student_id,
    exam_id: { $in: term.exams },
  });

  examResultSchema
    .findOne({ student: student_id, term_id })
    .populate({ path: "student", model: studentSchema })
    .populate({
      path: "exam_id",
      model: examSchema,
      populate: {
        path: "class_id",
        model: classeSchema,
        populate: { path: "section", model: sectionSchema },
      },
    })
    .then(async (results) => {
      const subjects = await subjectSchema
        .find({ school: term?.class?.school, report_type: term.report_type })
        .populate({ path: "school", model: schoolSchema });

      var options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
        header: {
          height: "2mm",
        },
        footer: {
          height: "19mm",
          contents: {
            // first: 'Cover page',
            // 2: 'Second page', // Any page number is working. 1-based index
            // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            // last: 'Last Page'
          },
        },
      };

      const totalResults = await (
        await examResultSchema
          .find({ term_id })
          .populate({ path: "student", model: studentSchema })
          .sort({ rank: 1 })
      ).filter((re) => getTotal(re) != 0);

      let html = ReactDOMServer.renderToStaticMarkup(
        resultsDynamicNormalActions(
          subjects,
          results,
          totalResults.length,
          totalResults,
          examResults,
          exams,
          term
        )
      );
      html += `
                 <style>

                ${bgImgStyle}

                .center{
                    text-align:center
                }
                .table1, .table2, .table3{
                    border-collapse: collapse;
                    font-weight:bold;
                    width: 100%;
                    margin-top: 5px;
                    margin-bottom: 5px;
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
                </style>
                `;

      var document = {
        html: html,
        data: {
          results: results,
        },
        path: "./teacher.pdf",
        type: "",
      };

      pdf
        .create(document, options)
        .then((response: any) => {
          var file = fs.createReadStream("./teacher.pdf");
          var stat = fs.statSync("./teacher.pdf");
          res.setHeader("Content-Length", stat.size);
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            `Content-Disposition`,
            `attachment; filename=${results.student.name}.pdf`
          );
          file.pipe(res);
          console.log("thie file isreac");
        })
        .catch((error: any) => {
          console.error(error);
          res.json({ message: error.message, success: false });
          console.log("thisfile isnot react");
        });
    })
    .catch((e) => {
      res.json({ message: e.message, success: false });
    });
}
