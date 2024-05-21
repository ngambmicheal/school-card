// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import ClasseInterface, { classeSchema } from "../../../../models/classe";
import { studentSchema } from "../../../../models/student";

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var dateParts = dateString.split("/");

  // month is 0-based, that's why we need dataParts[1] - 1
  var birthDate = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //age--;
  }

  console.log(dateString + "------" + age);
  return age;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { _id } = req.query;
  // classeSchema.findOne({_id}).then(classe => {
  //         res.json({data:classe, status:true});
  //     })
  //     .catch(() => {
  //         res.json({message:'Could not be sent s', success:false });
  //     })

  const students = await studentSchema.find({ class_id: _id });

  const studentAge = students.map((s) => {
    return {
      ...s.toObject(),
      age: getAge(s.dob),
    };
  });

  const grouped = _.mapValues(_.groupBy(studentAge, "sex"), (clist) =>
    _.mapValues(_.groupBy(clist, "age"), (aged) => aged.length)
  );

  res.json({ data: grouped, status: true });
}
