// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import TermInterface, { termSchema } from "../../../models/terms";
import ExamResultInterface, {
  examResultSchema,
} from "../../../models/examResult";
import { examSchema } from "../../../models/exam";
import CompetenceInterface, {
  competenceSchema,
} from "../../../models/competence";
import { schoolSchema } from "../../../models/school";
import SubjectInterface, { subjectSchema } from "../../../models/subject";
import CourseInterface, { courseSchema } from "../../../models/course";
import { sectionSchema } from "../../../models/section";
import { classeSchema } from "../../../models/classe";
import { studentSchema } from "../../../models/student";
import { ExamResult } from "../../../assets/jsx/resultsUiStats";
import { getSubjectTotal } from "../../exams/[_id]";
import { getFloat } from "../../../utils/calc";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { term_id, student_id } = req.body;

  const term: TermInterface = await termSchema
    .findOne({ _id: term_id })
    .populate({ path: "class", model: classeSchema });
  const exams = await examSchema.find({ _id: { $in: term.exams } });

  studentSchema.find({ class_id: term.class }).then((students) => {
    students.map((student) => {
      examResultSchema
        .update(
          { term_id, student: student._id },
          { number: student.number },
          { upsert: true }
        )
        .then((results) => {
          //res.json({data:results, status:true});
        })
        .catch((e) => {
          res.json({ message: e.message, success: false });
        })
        .finally(() => {
          examResultSchema
            .find({ term_id })
            .sort({ number: 1 })
            .populate({ path: "student", model: studentSchema })
            .collation({ locale: "en_US", numericOrdering: true })
            .then((results) => {
              res.json({ data: results, status: true });
            });
        });
    });
  });

  switch (term.report_type) {
    case "Competence":
      const competences: CompetenceInterface[] = await competenceSchema
        .find({ school: term?.class?.school, report_type: term.report_type })
        .populate({ path: "school", model: schoolSchema })
        .populate({
          path: "subjects",
          model: subjectSchema,
          populate: { path: "courses", model: courseSchema },
        });
      let termResults: ExamResultInterface[] = await examResultSchema
        .find({ term_id })
        .sort({ number: 1 })
        .populate({ path: "student", model: studentSchema })
        .collation({ locale: "en_US", numericOrdering: true });

      termResults.map((tResult) => {
        let res: any = {};
        examResultSchema
          .find({
            student: tResult.student._id,
            exam_id: { $in: term.exams },
            ignore: { $ne: true },
          })
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
          .then((results) => {
            competences.map((competence) => {
              competence.subjects?.map((subject: SubjectInterface) => {
                subject?.courses?.map((course: CourseInterface) => {
                  res[`subject_${course?._id}`] = getSubjectSum(
                    results,
                    "subject",
                    course._id
                  );
                });

                res[`total_${subject?._id}`] = getSubjectSum(
                  results,
                  "total",
                  subject._id
                );
                examResultSchema
                  .findOneAndUpdate({ _id: tResult._id }, res)
                  .then(() => {});
              });
            });
          });
      });

      const termResultsUpdated: ExamResultInterface[] = await examResultSchema
        .find({ term_id })
        .sort({ number: 1 })
        .populate({ path: "student", model: studentSchema })
        .collation({ locale: "en_US", numericOrdering: true });
      getTermRank(termResultsUpdated);

      break;
    case "Matiere":
      const termResults1: ExamResultInterface[] = await examResultSchema
        .find({ term_id })
        .sort({ number: 1 })
        .populate({ path: "student", model: studentSchema })
        .collation({ locale: "en_US", numericOrdering: true });
      const subjects: SubjectInterface[] = await subjectSchema
        .find({ school: term?.class?.school, report_type: term.report_type })
        .populate({ path: "school", model: schoolSchema });
      termResults1.map((tResult) => {
        let res: any = {};
        examResultSchema
          .find({
            student: tResult.student._id,
            exam_id: { $in: term.exams },
            ignore: { $ne: true },
          })
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
          .then((results) => {
            subjects.map((subject: SubjectInterface) => {
              res[`subject_${subject?._id}`] = getSubjectSum(
                results,
                "subject",
                subject._id
              );
            });

            console.log(res);
            examResultSchema
              .findOneAndUpdate({ _id: tResult._id }, res)
              .then((t) => {
                console.log(t);
              });
          });
      });

      const termResultsUpdated1: ExamResultInterface[] = await examResultSchema
        .find({ term_id })
        .sort({ number: 1 })
        .populate({ path: "student", model: studentSchema })
        .collation({ locale: "en_US", numericOrdering: true });
      getTermRank(termResultsUpdated1);
      break;
    case "Special":
      const termResults2: ExamResultInterface[] = await examResultSchema
        .find({ term_id })
        .sort({ number: 1 })
        .populate({ path: "student", model: studentSchema })
        .collation({ locale: "en_US", numericOrdering: true });
      const subjects2: SubjectInterface[] = await subjectSchema
        .find({ school: term?.class?.school, report_type: term.report_type })
        .populate({ path: "school", model: schoolSchema });
      termResults2.map((tResult) => {
        let res: any = {};
        examResultSchema
          .find({
            student: tResult.student._id,
            exam_id: { $in: term.exams },
            ignore: { $ne: true },
          })
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
          .then((results) => {
            subjects2.map((subject: SubjectInterface) => {
              res[`subject_${subject?._id}`] = getSubjectSum(
                results,
                "subject",
                subject._id
              );
            });

            console.log(res);
            examResultSchema
              .findOneAndUpdate({ _id: tResult._id }, res)
              .then((t) => {
                console.log(t);
              });
          });
      });

      const termResultsUpdated2: ExamResultInterface[] = await examResultSchema
        .find({ term_id })
        .sort({ number: 1 })
        .populate({ path: "student", model: studentSchema })
        .collation({ locale: "en_US", numericOrdering: true });
      getTermRank(termResultsUpdated2);
      break;
    default:
      break;
  }

  res.json({ data: { term, exams }, status: true });
}

export function getSubjectSum(
  results: ExamResultInterface[],
  type: "total" | "subject",
  subject_id?: string
) {
  let total = 0;
  results.map((r: any) => {
    total += getFloat(r[`${type}_${subject_id}`] ?? 0);
  });

  return results.length ? (total / results.length).toFixed(2) : 0;
}

export function getTermRank(results: ExamResultInterface[]) {
  const sortedData = results.sort((a, b) => {
    let lA = getSubjectTotal(a);
    let lB = getSubjectTotal(b);

    if (lA < lB) return 1;
    if (lA > lB) return -1;
    return 0;
  });

  sortedData.map((item, index) => {
    let rank = index + 1;
    examResultSchema
      .findOneAndUpdate({ _id: item._id }, { rank: rank })
      .then(() => {});
  });
}
