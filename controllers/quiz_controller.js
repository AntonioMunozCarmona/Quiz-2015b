var models = require('../models/models.js');

//Autoload =>Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz){
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe :quizId= '+quizId));
        }
    }
    ).catch(function(error){
      next(error); });
};


// GET /quizes
exports.index = function(req, res) {

  var search = req.query.search == undefined?"":req.query.search.replace(" ", "%");
  models.Quiz.findAll({where: ["pregunta like ?", '%'+search+'%'], order: 'pregunta ASC'}).then(function(quizes){ 
      res.render('quizes/index.ejs', { quizes: quizes});
    }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
    } 
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

//GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(         // Crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );

  res.render('quizes/new', {quiz: quiz});
};

//POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);

  // Guarda en la Base de Datos los campor pregunta y respuesta de quiz
  quiz.save({fields:["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  })    // Redireccion HTTP al URL relativo de la lista de preguntas (/quizes)
};