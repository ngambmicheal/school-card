// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import * as pdf from "pdf-creator-node";
import fs from "fs";
import ReactDOMServer from "react-dom/server";
import resultsUiStats from "../../../../assets/jsx/resultsUiStats";
import { examSchema } from "../../../../models/exam";
import { examResultSchema } from "../../../../models/examResult";
import { schoolSchema } from "../../../../models/school";
import { competenceSchema } from "../../../../models/competence";
import { studentSchema } from "../../../../models/student";
import { subjectSchema } from "../../../../models/subject";
import { courseSchema } from "../../../../models/course";
import { classeSchema } from "../../../../models/classe";
import resultsNormalUiStats from "../../../../assets/jsx/resultsNormalUiStats";
import { sectionSchema } from "../../../../models/section";
import { termSchema } from "../../../../models/terms";
import { replaceAll } from "../../../../services/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { annualExam_id } = req.query;

  const term = await termSchema
    .findOne({ _id: annualExam_id })
    .populate({
      path: "class",
      model: classeSchema,
      populate: { path: "section", model: sectionSchema },
    })
    .populate({
      path: "terms",
      model: termSchema,
      populate: { path: "exams", model: examSchema },
    });
  const totalResults = await examResultSchema
    .find({ annualExam_id })
    .populate({ path: "student", model: studentSchema })
    .sort({ number: 1 })
    .collation({ locale: "en_US", numericOrdering: true });
  const statsResults = await examResultSchema
    .find({ annualExam_id })
    .populate({ path: "student", model: studentSchema })
    .sort({ rank: 1 });
  const subjects = await subjectSchema
    .find({
      school: term.class.school,
      report_type: term.class.section.report_type,
    })
    .populate({ path: "school", model: schoolSchema });

  var dir = `./tmp/stats`;
  const zipName = `${replaceAll(" ", "_", term.class.name)}__${term.name}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  var options = {
    format: "A3",
    orientation: "landscape",
    border: "1mm",
    header: {
      height: "0mm",
    },
    footer: {
      height: "1mm",
      contents: {
        // first: 'Cover page',
        // 2: 'Second page', // Any page number is working. 1-based index
        // default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        // last: 'Last Page'
      },
    },
  };

  let exam = term.terms[0].exams[0];
  exam.name = term.name;
  let html = ReactDOMServer.renderToStaticMarkup(
    resultsNormalUiStats(exam, subjects, totalResults, statsResults)
  );
  html += `
                 <style>

                ${bgImgStyle}

                .center{
                    text-align:center
                }
                .table1, .table2{
                    border-collapse: collapse;
                    width: 100%;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    font-size:6px;
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
                `;

  const pdfResultsDir = `${dir}/${zipName}.pdf`;
  var document = {
    html: html,
    data: {},
    path: pdfResultsDir,
    type: "",
  };

  pdf
    .create(document, options)
    .then((response: any) => {
      var file = fs.createReadStream(`${dir}/${zipName}.pdf`);
      var stat = fs.statSync(`${dir}/${zipName}.pdf`);
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        `Content-Disposition`,
        `attachment; filename=${zipName}.pdf`
      );
      file.pipe(res);
    })
    .catch((error: any) => {
      console.error(error);
      res.json({ message: error.message, success: false });
      console.log("thisfile isnot react");
    });
}
