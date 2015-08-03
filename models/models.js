var path = require('path');

//Postgress DATABASE_URL = postgress://user:passwd@host:port/database
//SQLite    DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name 	= (url[6] || null);
var user    	= (url[2] || null);
var pwd  		= (url[3] || null);
var protocol	= (url[1] || null);
var dialect		= (url[1] || null);
var port 		= (url[5] || null);
var host		= (url[4] || null);
var storage		= process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar Base de Datos SQLite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd,
		{	dialect: 	protocol,
			protocol: 	protocol,
			port: 		port,
			host: 		host,
			storage: 	storage,	//Solo SQLite .env
			omitNull: 	true		//Solo Postgress
		}
	);

//Importar la definicion de la tabla QUIZ en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

//Importar la definición de la tabla Comment 
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);							//Relacion de tipo 1
Quiz.hasMany(Comment, { onDelete: 'cascade', 		//Relacion de tipo N 	==> 1 a N
						 hooks: true }); 		//Para borrar los comentarios en cascada 
												//cuando se borra una pregunta

exports.Quiz = Quiz;		//Exporta la definición de la tabla Quiz
exports.Comment = Comment;	//Exporta la definicion de la tabla Comment	

//sequelize.sync() cre e inicializa tablas de preguntas en las Bases de Datos
sequelize.sync().then(function(){
	//Then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if (count === 0) {	///la tabla se inicializa solo si está vacia
			 Quiz.bulkCreate(  
		        [	{pregunta: 'Capital de Italia',   respuesta: 'Roma', tema: 'Humanidades'}, 
        		   	{pregunta: 'Capital de Portugal', respuesta: 'Lisboa',  tema: 'Humanidades'} 
        		]
		
			).then(function(){console.log('Base de Datos inicializa')});
		};
	});
});