import mongoose  from 'mongoose';
const mg = mongoose;
mg.connect('mongodb://localhost:27017/new-school');
//mg.connect('mongodb+srv://admin:admin@cluster0.xy4jr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')

export default mg;
