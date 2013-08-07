
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + 'public'));

mongoose.connect("mongodb://localhost/pharmaCorp");

app.get('/', routes.index);

var ResearchSchema = new mongoose.Schema({
	id: Number,
	author_name: String,
	title: String,
	desc : String
}),
	Researches = mongoose.model("Researches", ResearchSchema);

// INDEX
app.get("/investigaciones", function(req, res){
	Researches.find({}, function(err, docs) {
		if(err) res.redirect("/error");
		res.render("investigaciones/index", { researches: docs });
	});
});

// NEW
app.get("/investigaciones/crear", function(req, res){
	res.render("investigaciones/crearInvestigacion");
});

app.get("/Contacto/Contacto", function(req, res){
	res.render("Contacto/Contacto.html");
});

app.get("/Inicio/index", function(req, res){
	res.render("Inicio/index.html");
});

app.get("/Inicio/ingreso", function(req, res){
	res.render("Inicio/ingreso.html");
});

app.get("/investigaciones/Investigaciones", function(req, res){
	res.render("investigaciones/Investigaciones.html");
});

app.get("/reglamentos/Reglamentos", function(req, res){
	res.render("reglamentos/Reglamentos.html");
});


// CREATE
app.post("/investigaciones", function(req, res){
	var b = req.body;
	new Researches({
		id: b.id,
		author_name: b.author_name,
		title: b.title,
		desc: b.description
	}).save(function(err, research){
		if(err) res.json(err);
		res.redirect("/investigaciones/"+research.id);
	});
});

app.param("id", function(req, res, next, id){
	Researches.find({id: id}, function(err, docs){
		req.research = docs[0];
		next();
	});
}); 

// SHOW
app.get("/investigaciones/:id", function(req, res){
	res.render("investigaciones/show", { research: req.research });
});

// SHOW
app.get("/investigaciones/:id/editar", function(req, res){
	res.render("investigaciones/edit", { research: req.research });
});

// UPDATE

app.put("/investigaciones/:id", function(req, res){
	var b = req.body;
	Researches.update(
		{ id: req.params.id },
		{ id: b.id, title: b.title, desc: b.description },
		function(err) {
			res.redirect("/investigaciones/" + b.id);
		}
	);
});


// DESTROY
app.delete("/investigaciones/:id", function(req, res){
	Researches.remove({id: req.params.id}, function(err){
		res.redirect("/investigaciones");
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
