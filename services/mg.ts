import mongoose from "mongoose";
const mg = mongoose;
mg.connect(process.env.DB_HOST ?? 'mongodb://localhost:27017/school_js');

export default mg;
