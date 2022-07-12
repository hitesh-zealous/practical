var mysql=require('mysql2');

var connection=mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_USER_PASSWORD,
  database: process.env.DATABASE_NAME
});

connection.connect(function(error){
  if(!!error){
    console.log(error);
  }else{
    console.log('My sql Connected!:)');
  }
});  

module.exports = connection; 