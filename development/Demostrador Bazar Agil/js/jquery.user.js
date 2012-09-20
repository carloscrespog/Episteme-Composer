/**
 * Functionality for Episteme's Bazar Agil
 * Developed by Gsi
 */

jQuery(function($) {

    /* Load data */
    var $container = $("#element-container .list");
    var total = 4;
    for(index = 1; index < total; index++){
        $.get("../data/company" + index + ".js" , function(data) {
              alert( parseData(data) );
          });
    }
    
    var $display = $('#display');

    $('.list').sortable({
      placeholder: "ui-state-highlight",
      revert: 'invalid'
    });
    $('.list').disableSelection();


 /* $(".item" ).draggable({

      drag: function (event, ui) {
          $display.html("Drag");
      },
      revert: 'invalid',
      revertDuration: 200,
      connectToSortable: ".list"

  });

  $(".droppable" ).droppable({

      hoverClass: "ui-droppable-hover",

      drop: function (event, ui) {
          $display.html("Dropped");
          var left_off = $(this).offset().left-2; 
          var top_off = $(this).offset().top-4;
          $(ui.draggable).offset({'top' : top_off, 'left' : left_off});
      }
 
  });*/

    function parseData (data) {
     
        var capabilities = "";
        var length = data.company.capabilities.length;
        for (var i = 0; i < length; i++){
            capabilities = capabilities.concat(" ").concat(data.company.capabilities[i]);
        }
        

    }

});





/*{"company" : 
    {
      "name" : "Company 1",
      "logo" : { "text" : "company 1 logo", "src" : "data/images/logo1.png"},
      "description" : "The description of first company",
      "capabilities" : [ "technical_memo", "admin_memo" ]
    }
  }

<div class="item company" data-capability="technical_memo admin_memo">
    <div class="imgwrap">
        <img src="data/images/logo1.png" />
    </div>
    <div class="titlebar">
        <h2>company 1</h2>
    </div>
</div>*/

