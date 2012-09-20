(function ($) {

AjaxSolr.ResultWidget = AjaxSolr.AbstractWidget.extend({
  start: 0,

  beforeRequest: function () {
    //$(this.target).html($('<img/>').attr('src', 'images/ajax-loader.gif'));
  },

  facetLinks: function (facet_field, facet_values) {
    var links = [];
    if (facet_values) {
      for (var i = 0, l = facet_values.length; i < l; i++) {
        if (facet_values[i] !== undefined) {
          links.push(AjaxSolr.theme('facet_link', facet_values[i], this.facetHandler(facet_field, facet_values[i])));
        }
        else {
          links.push(AjaxSolr.theme('no_items_found'));
        }
      }
    }
    return links;
  },

  facetHandler: function (facet_field, facet_value) {
    var self = this;
    return function () {
      self.manager.store.remove('fq');
      self.manager.store.addByValue('fq', facet_field + ':' + AjaxSolr.Parameter.escapeValue(facet_value));
      self.doRequest();
      return false;
    };
  },

  afterRequest: function () {
    $(this.target).empty();
	var element='';
var count=0;
    for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
	
	if(i==0){
		element=element+'<li class="panel">';
	}
	count++;
      
      var doc = this.manager.response.response.docs[i];
	element=element + AjaxSolr.theme('result', doc, this.manager.response.response.docs.length);
	if(count===15){
		element=element+'</li><li class="panel">';
		count=0;
	}
      

      //var items = [];
      //items = items.concat(this.facetLinks('topics', doc.topics));
      //items = items.concat(this.facetLinks('organisations', doc.organisations));
      //items = items.concat(this.facetLinks('exchanges', doc.exchanges));
      //AjaxSolr.theme('list_items', '#links_' + doc.id, items);
	//console.log('Iteracion: '+i);
	
    }
	$(this.target).append(element);
    /*
     * Usamos el helper clone para que no desaparezca al arrastrar
     * appendTo se encarga de que el draggable pueda salir de la caja del slider
     * usamos revert  invalid porque queremos que vuelva al dejar fuera del hueco
     */
     $('.item').draggable({
      revert: 'invalid',
      revertDuration: 500,
      appendTo: '#temp-placeholder',
      helper: 'clone',
      scroll: true
    });

     $('#slider').anythingSlider({
      buildStartStop:false,
      hashTags:false
    });

     $('.list_companies').parent().parent().parent().show();
     $('.item').qtip({
      content: {
        title: {
          text: function(){
            return $(this).html();
          }
        },
        attr:'data-description'
      },
      style: {
        classes: 'ui-tooltip-rounded ui-tooltip-shadow ui-tooltip-episteme'
      },
     
      
      position:{
        my:'bottom center',
        at:'top center'
      }
    });
	
  },

  init: function () {
    $('a.more').livequery(function () {
      $(this).toggle(function () {
        $(this).parent().find('span').show();
        $(this).text('less');
        return false;
      }, function () {
        $(this).parent().find('span').hide();
        $(this).text('more');
        return false;
      });
    });
  }
});

})(jQuery);
