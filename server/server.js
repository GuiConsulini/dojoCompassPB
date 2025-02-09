const { urlencoded } = require('express');
const express = require('express');
const app = express();
const path = require('path');
const { createFakeUser } = require('./utils/utils');
const { createTables } = require('./data/data_utils');
const connectionTest = require('./config/database').connectionTest;

app.use(express.json());
app.use(urlencoded({ extended: false }));

//initial
app.use('/', require('./routes/initial/initial'));

app.use('/', require('./routes/csrf/csrf-render-post-method'));

//CSRF
app.use('/', require('./routes/csrf/csrf-get'));
app.use('/', require('./routes/csrf/csrf-post'));

//SQLI
app.use('/', require('./routes/sqli/sqli'));

//XSS
app.use('/', require('./routes/xss/xss_armazenado'));
app.use('/', require('./routes/xss/xss_refletido'));

//broken_authentication
app.use('/', require('./routes/broken_authentication/broken_authentication'));

//broken_authentication II
app.use('/', require('./routes/broken_authentication_II/broken_authentication_II'));

//broken_authentication III
app.use('/', require('./routes/broken_authentication_III/broken_authentication_III'));

app.use('/', require('./utils/aux_router'));

//upload
app.use('/', require('./routes/upload/upload'));

app.use(express.static(__dirname + '/views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Error Handler
app.use((req, res, next) => {
	const renderData = [];
	renderData.error = '';
	res.status(404).render('error_page', renderData);
});
//Error Handler
app.use((err, req, res, next) => {
	console.log('\nSOMETHING WENT WRONG\n');
	console.log(err);
	const renderData = [];
	renderData.error = err;
	res.status(404).render('error_page', renderData);
});

//Linsten
const porta = process.env.PORT || 3000;
app.listen(porta, async () => {
	console.log(`Sevidor Rodando na porta ${porta} => ${__dirname}`);
	await connectionTest();
	const existeUsuario = await createTables()

	if (!existeUsuario) {
		createFakeUser()
	}
});
