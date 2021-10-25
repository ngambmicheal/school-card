import mongoose  from 'mongoose';
const mg = mongoose;
//mg.connect('mongodb://192.168.10.10:27017/school_js');
mg.connect('mongodb+srv://admin:admin@cluster0.xy4jr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

export default mg;
