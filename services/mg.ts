import mongoose from "mongoose";
const mg = mongoose;
mg.connect(process.env.DB_HOST ?? 'mongodb://localhost:27017/school_js', {authSource: 'admin'});
//mg.connect(
  process.env.DB_HOST ??
    "mongodb+srv://admin:admin@cluster0.xy4jr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//);

export default mg;
