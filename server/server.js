var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

  var headers = req.get('Access-Control-Request-Headers');
  if (typeof(headers) !== 'undefined') {
    res.header('Access-Control-Allow-Headers', headers);
  }

  if ('OPTIONS' === req.method) {
    res.status(200).send('');
  } else {
    next();
  }
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({
  extended: false
}));

var consultas = [{
  id: 1,
  medico: 1,
  paciente: 'Leôncio',
  data: '01/01/2014'
}, {
  id: 2,
  medico: 2,
  paciente: 'Allison Cameron',
  data: '02/01/2014'
}];

app.get('/consultas', function(req, res) {
  res.send(consultas);
});

app.get('/consultas/:id', function(req, res) {
  var id = req.params.id;

  for (var i = 0; i < consultas.length; i++) {
    if (id == consultas[i].id) {
      res.send(consultas[i]);
    }
  }
});

app.post('/consultas', function(req, res) {

  console.log('Recebido de ' + req.connection.remoteAddress, req.body);

  if (req.body.medico && req.body.paciente && req.body.data) {
    consultas.push(req.body);

    res.send({
      status: 'Consulta salva com sucesso'
    });
  } else {
    res.status(500).send({
      status: 'Erro ao salvar consulta. Faltam dados.'
    })
  }
});

app.put('/consultas', function(req, res) {

  console.log('Recebido de ' + req.connection.remoteAddress, req.body);

  if (req.body.medico && req.body.paciente && req.body.data) {

    for (var i = 0; i < consultas.length; i++) {
      if (req.body.id == consultas[i].id) {
        consultas[i] = req.body;
      }
    }

    res.send({
      status: 'Consulta atualizada com sucesso'
    });
  } else {
    res.status(500).send({
      status: 'Erro ao atualizar consulta. Faltam dados.'
    })
  }
});

app.listen(80);
console.log('Servidor iniciado');