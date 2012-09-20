/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */
jQuery(function ($) {

    /**/
    var current_offer_line = 1;
    
    /* calculate the current offer line*/
    if (!$('.skill-level-closure') == 'undefined') {
        current_offer_line = $('.skill-level-closure').size();
    }
    

    /* Add the remove buttons */
    $('.skill-level-closure').append($(make_remove_button()));
    
    $('#selection-panel').on('click', '.remove-line', function(){
        $(this).parent('.skill-level-closure').slideUp(200, function(){ $(this).remove() });
    });

    /* Add new offer when the button is press */
    $('#new_offer_entry').bind('click', function() {
        var $new_line = $(make_new_line());
        $new_line.hide();
        $('form#skills-selection button').before($new_line);
        $new_line.slideDown(150);
        current_offer_line = current_offer_line + 1;
    });

    /* This builds the html code including que corresponding index number */
    function make_new_line() {

        return '<div class="skill-level-closure"> \
                    <label for="skill' + (current_offer_line + 1) + '">Requisito:</label> \
                    <select name="skill' + current_offer_line++ + '"> \
                        <option value="Web_programming">Programación Web</value> \
                        <option value="Graphic_applications">Diseño Gráfico</value> \
                        <option value="Office_applications">Aplicaciones Ofimáticas</value> \
                        <option value="Relational_databases">BBDD Relacionales</value> \
                        <option value="Oracle">Oracle</value> \
                        <option value="JavaScript">JavaScript</value> \
                        <option value="VisualBasic">VisualBasic</value> \
                        <option value="VisualBasic">Java</value> \
                    </select> \
                    <label for="level' + (current_offer_line + 1) + '">Grado de competencia:</label> \
                    <select name="level' + (current_offer_line + 1) + '"> \
                        <option value="Expert">Experto</value> \
                        <option value="Advanced">Avanzado</value> \
                        <option value="Intermediate">Intermedio</value> \
                        <option value="Beginner">Básico</value> \
                    </select> \
                    ' + make_remove_button() + ' \
                </div>';
    }

    function make_remove_button() {
        return '<div class="remove-line" title="Eliminar condición"">x</div>'
    }

});
