/**
 * Functionality for Episteme's Bazar Agil
 * Developed by Gsi
 */
     var mCapabilities=new Array();
     
     var Manager;

 $(document).ready(function() {

  $('.widgetArea').hide();
  /**
   * Definir url del endpoint
   */
  Manager = new AjaxSolr.Manager({
    solrUrl: 'http://shannon.gsi.dit.upm.es/episteme/lmf/solr/INES/'
	//solrUrl: 'http://localhost:8080/LMF/solr/Episteme/'
  });
  /**
   * Añadir widget de resultados
   */
   Manager.addWidget(new AjaxSolr.ResultWidget({
    id: 'result',
    target: '.result_widget'
    }));
  /**
   * Botón de widget de provincias
   */
    $('#new-widget').bind('click', function() {
      
      addWidget(Math.floor(Math.random() * 10001), "province", "province");
      $('#new-widget').hide();

    });
  /**
   * Widget que indica filtros aplicados
   */
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
    id: 'currentsearch',
    target: '#currentselection'
    }));
  /**
   * Widget de autocompletado
   */
    // Manager.addWidget(new AjaxSolr.AutocompleteWidget({
    //   id: 'text',
    //   target: '#searchBox',
    //   fields: [ 'name' ]
    // }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');

    //Para el appendTo de los draggables
  $('#main-content').append('<div id="temp-placeholder"></div>');
    loadOffers(); //cargar ofertas
    

  /*
   * Hacer droppables los huecos para las ofertas
   * Mediante getCompanies se carga el número de huecos necesarios para
   * cada oferta
   */
   $('.drop-offer').droppable({
    accept: ".offer",
    activeClass: "drop-active",
    drop: function(event, ui) {

      $('.instructions.offer').empty();
      var item = ui.draggable.html();
      var itemid = ui.draggable.attr("id");
      var html = '<div class="service dropped">';
      html = html + '<div class="divrm">';
      html = html + '<a onclick="remove(this)" class="remove '+itemid+'">&times;</a>';
      html = html + '</div><div>'+item+'</div>';
      $(this).append(html);
      itemid=itemid.replace(/[a-z]+/,"");
      $('.list_companies').parent().parent().parent().show();
      getCompanies(itemid); //ajax
      
    },activate: function(event,ui){
      $('.instructions.offer').hide();
    },deactivate: function(event,ui){
      $('.instructions.offer').show();
    }
  });
 });
  /*
   * Función que se usa para eliminar las ofertas que se sueltan en un hueco
   */
   function remove(el) {
    $(el).parent().parent().remove();
    var htmlCompanies = '<div class="service droppable drop-company" data-max-items="1" data-drag-out-kill="true" data-read-service="true" data-droppable="true" style="position: relative; " id="g2"></div>';
    htmlCompanies = htmlCompanies + '<span class="instructions company" data-instructions="true">Arrastre aqu&iacute;<br>(Compañ&iacute;as)</span>';
    htmlCompanies = htmlCompanies + '<span class="instructions not-supported hide" data-instructions-not-supported="true">Not<br>Supported</span>';
    htmlCompanies = htmlCompanies + '<div class="cross hide" data-cant-use-read="true"><img src="/static/images/frontend/cross-large.png"></div>';
    $('.panel-to').html(htmlCompanies);
    $('.list_offers').parent().show();
    $('.list_companies').parent().parent().parent().hide();
    $('.widgetArea').hide();
    $('#endPanel').hide();
  }
/*
 * Función que se usa para eliminar las compañias que se sueltan en un hueco
 */
 function removeCompany(el) {
  $(el).parent().parent().parent().droppable("enable");
  var cap=$(el).parent().parent().parent().attr('data-capability');
  var index=$(el).parent().parent().parent().attr('id');
  mCapabilities[eval(index.replace('o',''))]=cap;
  console.log('mCapabilities= '+mCapabilities);
  loadCompanies();
  $(el).parent().parent().remove();


}
/*
 * Función que se usa para cargar los huecos necesarios
 * de una oferta
 */
 function getCompanies(itemid){
  $.getJSON('data/offers/offers.js', function(data) {
    $('.list_offers').parent().hide();
    
    $('.panel-to').html('');

    $.each(data.offers[itemid].capabilities, function(key, val) {
      var htmlCompanies='';
      htmlCompanies = htmlCompanies + '<div class="service droppable drop-company" data-max-items="1" data-drag-out-kill="true" data-read-service="true" data-droppable="true" data-capability="'+val+'" style="position: relative; " id="o'+key+'">';
      htmlCompanies = htmlCompanies + '<span class="instructions company" data-instructions="true">Arrastre aqu&iacute;:<br>('+val+')</span></div>';
      htmlCompanies = htmlCompanies + '<span class="instructions not-supported hide" data-instructions-not-supported="true">Not<br>Supported</span>';
      htmlCompanies = htmlCompanies + '<div class="cross hide" data-cant-use-read="true"><img src=""></div>';
      $('.panel-to').append(htmlCompanies);

      var mdiv='\'#o'+key+'\'';
      var classType= val;
      classType=classType.split(' ')[0]+'_'+classType.split(' ')[1];
      var mClass='\".'+classType+'\"';
      
      dropifier(mdiv,mClass,key);
      mCapabilities[key]=val;

    });
loadCompanies();
});
}
/*
 * Hace droppable a un determinado div y hace que acepte unas determinadas clases
 * se usa al cargar los huecos para las compañias
 */
 function dropifier(mdiv,aClass,key){
  var mDraggable;
  $(eval(mdiv)).droppable({
    accept: eval(aClass),
    activeClass: "drop-active",
    hoverClass: "drop-hover",
    drop: function(event, ui) {
      $('.instructions.company').show();
      var mdivClass='\''+mdiv.split('\'')[1]+' .instructions.company'+'\'';
      

      $(eval(mdivClass)).empty();
      mDraggable=ui.draggable;
      mDraggable.hide();
      //$('.instructions.company').empty();
      var item = ui.draggable.html();
      var itemid = ui.draggable.attr("id");
      var html = '<div class="service dropped">';
      html = html + '<div class="divrm">';
      html = html + '<a onclick="removeCompany(this)" class="remove '+itemid+'">&times;</a>';
      html = html + '</div><div>'+item+'</div>';
      $(this).append(html);
      $(this).droppable("disable");
      
      mCapabilities[key]='x'; //Capability desactivada
      
      
      var testFinish=0;
      for (var m in mCapabilities){
        if(mCapabilities[m]=='x'){
          testFinish++;
        }
      }
      if(testFinish==mCapabilities.length){
        //window.location.replace("/endPage.html");
        $('.list_companies').parent().parent().parent().hide();
        $('.widgetArea').hide();
        $('#endPanel').show();
      }else{
        loadCompanies();
      }
      $('.list_companies').parent().show();
    },activate: function(event,ui){
      $('.instructions.company').hide();
    },deactivate: function(event,ui){
      $('.instructions.company').show();
    }
  });
}
/*
 * Carga las ofertas, de momento en local, tambien pone las qtips
 */
 function loadOffers(){
  $.getJSON('data/offers/offers.js', function(data) {
    $('.list_offers').html('');
    $.each(data.offers, function(key, val) {
      var list_offers='';
      list_offers= list_offers + '<div class="item offer" id="o'+key+'" ';
      list_offers= list_offers + 'data-capability="';
      for(var j in val.capabilities){
        var classType= val.capabilities[j];
        classType=classType.split(' ')[0]+'_'+classType.split(' ')[1];
        list_offers= list_offers + classType+' ';
      }
      list_offers= list_offers +'">';
      list_offers= list_offers + '<div class="imgwrap"><img draggable="false" src="'+val.logo.src+'"/></div>';
      list_offers= list_offers + '<div class="titlebar"><h2>'+val.name+'</h2></div></div>';
      $('.list_offers').append(list_offers);
    $('.list_companies').parent().hide();
    
  });
    $('.list_offers').append('<a href="offerWizard.html"><div id="new_offer_entry" class="add-arrow"></div></a>');
    $('.list_offers').append('<div class="clear"></div>');
    $('.item').draggable({
      revert: 'invalid',
      revertDuration: 500,
      appendTo: '#temp-placeholder',
      helper: 'clone',
      scroll: true
    });
  });
}
/*
 * Carga las compañias, mediante lmf
 *
 */
 function loadCompanies(){
console.log('mCapabilities= '+mCapabilities);
  Manager.addWidget(new AjaxSolr.ResultWidget({
    id: 'result',
    target: '.list_companies'
  }));
  //Consulta lmf en función de capabilities
  var fquery = '';
  for (var j in mCapabilities){
    if(mCapabilities[j]!="x"){
      if(j==mCapabilities.length-1){

        fquery+='type:' + '"'+mCapabilities[j]+'"';
      }else{
        fquery+='type:' + '"'+ mCapabilities[j] + '"'+ ' OR ';

      }
    }

  }
  var fq = Manager.store.values('fq');

  for (var i = 0, l = fq.length; i < l; i++) {
    if(fq[i].split(':')[0]=='type'){

      Manager.store.removeByValue('fq', fq[i]);

    }

    }
    Manager.store.addByValue('fq', fquery);
    Manager.doRequest(); //Método encargado de recargar las compañias
  }
/*
 *  Método para añadir los widgets
 */
function addWidget(id, target, field){

      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: id,
        target: '#' + target,
        field: field
      }));

    Manager.store.addByValue('q', '*:*');

    var params = {
      facet: true,
      'facet.field': field,
      'facet.limit': 10,
      'facet.sort': 'count',
      'facet.mincount': 1,
      'json.nl': 'map'
    };

    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }

    Manager.doRequest();
}
