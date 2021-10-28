// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {subjectSchema} from '../../../models/subject';
import { courseSchema } from '../../../models/course';


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) { 

    const subjects = subjectSchema.find().then(subjects => {
                                            subjects.map(subject => {
                                                console.log(subject)
                                                courseSchema.find({subject:subject._id}).select('_id').then(courses => {
                                                   const sub = courses.map(s =>  s._id);
                                                   console.log(sub);
                                                    subjectSchema.findOneAndUpdate({_id:subject._id}, {courses:sub}).then(c => {
                                                        console.log(c)
                                                    })
                                                })
                                            })
                                        })
                                        .catch((e) => {
                                            res.json({message:e.message, success:false });
                                        })
                                        .finally(()=>{
                                            res.json({message:'Done', success:false });
                                        } ) 

}
