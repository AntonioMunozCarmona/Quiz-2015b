var path = require('path');

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar Base de Datos SQLite
var sequelize = new Sequelize(null, null, null,
					{dialect: "sqlite", storage: "quiz.sqlite"}
					);

//Importar la definicion de la tabla QUIZ en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz;	//Exporta la definición de la tabla Quiz

//sequelize.sync() cre e inicializa tablas de preguntas en las Bases de Datos
sequelize.sync().success(function(){
	//Success(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function (count){
		if (count === 0) {	///la tabla se inicializa solo si está vacia
			Quiz.create({
				pregunta:   'Capital de Italia',
				respuesta:   'Roma' 
			})
			.success(function(){console.log('Base de Datos inicializa')});
		};
	});
});