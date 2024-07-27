const mongoose=require('mongoose');

mongoose.set('strictQuery', true);

const ConnectionString = process.env.ConnectionString;
mongoose.connect(ConnectionString).then(()=>{
    console.log('you connected to MongoDB Database');
});