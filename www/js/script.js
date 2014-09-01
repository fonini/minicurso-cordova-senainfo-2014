var medicos = {
  1: 'Hans Chucrute',
  2: 'Gregory House'
};

var ipServidor = '127.0.0.1';

// Desabilita transições para melhorar performance
$(document).bind('mobileinit', function() {
  $.mobile.defaultDialogTransition = 'none';
  $.mobile.defaultPageTransition = 'none';
});

// Eventos disparados quando as páginas são acessadas
$(document).on('pageshow', '#lista-consultas', function() {

  // Requisição AJAX para retornar as consultas já cadastradas
  $.ajax({
    type: 'GET',
    url: 'http://' + ipServidor + '/consultas',
    dataType: 'json'
  }).success(function(dados) {

    // Assim que a requisição retornar as consultas, montamos a listagem
    popularLista(dados);

    $('#btn-salvar').data('action', 'save');
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

// Evento: Quando clicar no botão "Editar", chama função que retorna dados do servidor e preenche o formulário
$(document).on('click', '.editar-consulta', function() {
  var idConsulta = $(this).data('id');

  editarConsulta(idConsulta);
});


/*
 *Funções
 */

// Chamada na página inicial para montar a lista de consultas
function popularLista(dados) {
  var lista = '';

  for (var i = 0; i < dados.length; i++) {
    lista += '<li>Médico: ' + medicos[dados[i].medico] + '<br/>Paciente: ' + dados[i].paciente;
    lista += '<div style="float:right">Data: ' + dados[i].data + ' - <a class="editar-consulta" data-id="' + dados[i].id + '">Editar</a></div></li>';
  }

  $('#listview-consultas').html(lista).listview('refresh');
}

// Chamada na página de cadastro para montar o select com os médicos
function popularSelectMedicos() {
  var select = '<option>Selecione</option>';

  for (var i in medicos) {
    select += '<option value="' + i + '">' + medicos[i] + '</option>';
  }

  $('#medico').html(select);
}

function editarConsulta(idConsulta) {

  // Requisição AJAX para retornar os dados da consulta
  $.ajax({
    type: 'GET',
    url: 'http://' + ipServidor + '/consultas/' + idConsulta,
    dataType: 'json'
  }).success(function(data) {
    window.location.hash = '#cadastro-consultas';

    setTimeout(function() {
      $('#id').val(data.id);

      setTimeout(function() {
        $('#medico').val(data.medico).selectmenu('refresh');
      }, 500);

      $('#paciente').val(data.paciente);
      $('#data').val(data.data);

      $('#btn-salvar').data('action', 'update');
    }, 350);

  }).fail(function(err) {
    alert('Erro ao carregar dados');
  });
}

function salvarConsulta() {

  if ($('#btn-salvar').data('action') == 'save') {

    // Requisição AJAX para salvar a consulta
    $.ajax({
      type: 'POST',
      url: 'http://' + ipServidor + '/consultas',
      data: $('#form-cadastro').serialize(),
      dataType: 'json'
    }).success(function(dados) {
      alert(dados.status);

      $('#form-cadastro')[0].reset();

      window.location.hash = '#lista-consultas';

    }).fail(function(err) {
      try {
        var erro = JSON.parse(err.responseText);
        alert(erro.status);
      } catch (e) {
        console.log(err.responseText);
      }
    });
  } else {
    // Requisição AJAX para atualizar a consulta
    $.ajax({
      type: 'PUT',
      url: 'http://' + ipServidor + '/consultas',
      data: $('#form-cadastro').serialize() + '&' + $.param({
        id: $('#id').val()
      }),
      dataType: 'json'
    }).success(function(dados) {
      alert(dados.status);

      $('#form-cadastro')[0].reset();

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
}