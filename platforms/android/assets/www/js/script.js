var medicos = {
  1: 'Hans Chucrute',
  2: 'Gregory House'
};

$(document).bind("mobileinit", function() {
  $.mobile.defaultDialogTransition = 'none';
  $.mobile.defaultPageTransition = 'none';
});

// Eventos disparados quando as páginas são acessadas
$(document).on('pageshow', '#lista-consultas', function() {

  // Requisição AJAX para retornar as consultas já cadastradas
  $.ajax({
    type: 'GET',
    url: 'http://192.168.1.111/consultas',
    dataType: 'json'
  }).success(function(dados) {

    // Assim que a requisição retornar as consultas, montamos a listagem
    popularLista(dados);
  });
});

// Quando a página de cadastro for carregada, preenchemos o select com os médicos
$(document).on('pageshow', '#cadastro-consultas', function() {
  popularSelectMedicos();
});

// Evento: Quando clicar no botão "Salvar", chama função que envia os dados para o servidor
$(document).on('click', '#btn-salvar', function() {
  salvarConsulta();
});


/*
 *Funções
 */

// Chamada na página inicial para montar a lista de consultas
function popularLista(dados) {
  var lista = '';

  for (var i = 0; i < dados.length; i++) {
    lista += '<li>Médico: ' + medicos[dados[i].medico] + '<br/>Paciente: ' + dados[i].paciente;
    lista += '<div style="float:right">Data: ' + dados[i].data + '</div></li>';
  }

  $('#listview-consultas').html(lista).listview('refresh');
}

// Chamada na página de cadastro para montar o select com os médicos
function popularSelectMedicos() {
  var select = '<option selected>Selecione</option>';

  for (var i in medicos) {
    select += '<option value="' + i + '">' + medicos[i] + '</option>';
  }

  $('#medico').html(select);
}

function salvarConsulta() {

  // Requisição AJAX para salvar a consulta
  $.ajax({
    type: 'POST',
    url: 'http://192.168.1.111/consultas',
    data: $('#form-cadastro').serialize(),
    dataType: 'json'
  }).success(function(dados) {
    alert(dados.status);

    window.location.hash = '#lista-consultas';

  }).fail(function(err) {
    try {
      var erro = JSON.parse(err.responseText);
      alert(erro.status);
    } catch (e) {
      console.log(err.responseText);
    }
  });

}