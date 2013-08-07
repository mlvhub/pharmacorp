
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

app.engine('html', require('ejs').renderFile);

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

mongoose.connect("mongodb://localhost/pharmaCorp");

app.get('/', routes.index);

var ResearchSchema = new mongoose.Schema({
	id: Number,
	author_name: String,
	title: String,
	desc : String
}),
	Researches = mongoose.model("Researches", ResearchSchema);

var UserSchema = new mongoose.Schema({
	email: String,
	password: String
}),
	Users = mongoose.model("Users", UserSchema);

// INDEX
app.get("/intranet/index", function(req, res){
	res.render("intranet/index");
});

// LOGIN FORM
app.get("/intranet", function(req, res){
	res.render("intranet/login");
});

// LOGIN FORM
app.get("/intranet/salir", function(req, res){
	res.redirect("inicio/index");
});

// LOGIN FORM
app.get("/intranet/investigaciones/crear", function(req, res){
	res.render("investigaciones/new");
});

// LOGIN
app.post("/intranet", function(req, res){
	Users.find({ email: req.body.email, password: req.body.password }, function(err, docs){
		if(err) res.render("intranet/login", {error: err});
		console.log(docs.length);
		if(docs.length > 0){
			res.redirect("/intranet/investigaciones/crear");
		}else{
			res.render("intranet/login", {error: "Credenciales incorrectos."});
		}
	});
});

// INDEX
app.get("/investigaciones", function(req, res){
	Researches.find({}, function(err, docs) {
		if(err) res.redirect("/error");
		res.render("investigaciones/index", { researches: docs });
	});
});

// NEW
app.get("/usuarios/crear", function(req, res){
	res.render("usuarios/new");
});

// CREATE
app.post("/usuarios", function(req, res){
	var b = req.body;
	new Users({
		email: b.email,
		password: b.password
	}).save(function(err, user){
		if(err) res.json(err);
		res.redirect("/usuarios/"+user.email);
	});
});

// NEW
app.get("/investigaciones/crear", function(req, res){
	res.render("investigaciones/crearInvestigacion");
});

app.get("/contacto/contacto", function(req, res){
	res.render("contacto/contacto.html");
});

app.get("/inicio/index", function(req, res){
	res.render("inicio/index.html");
});

app.get("/inicio/ingreso", function(req, res){
	res.render("inicio/ingreso.html");
});

app.get("/investigaciones/investigaciones", function(req, res){
	res.redirect("/investigaciones");
});

app.get("/reglamentos/reglamentos", function(req, res){
	res.render("reglamentos/reglamentos.html");
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
