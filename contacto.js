$(document).ready(function() {
    $( function() {
        $( "#dialog" ).dialog({autoOpen: false, modal: true, show: {effect: "blind", duration: 500}, hide: {effect: "blind", duration: 500}});
    });
    function showDialog(message) {
        $('#dialogMessage').text(message);
        $('#dialog').dialog('open');
    }

    $("#contactForm").validate({
        rules: {
            contactName: {
                required: true
            },
            contactEmail: {
                required: true,
                email: true
            },
            contactMessage: {
                required: true,
                minlength: 10
            }
        },
        messages: {
            contactName: {
                required: "El campo de nombre es obligatorio."
            },
            contactEmail: {
                required: "El campo de correo electrónico es obligatorio.",
                email: "Por favor, ingresa un correo electrónico válido."
            },
            contactMessage: {
                required: "El campo de mensaje es obligatorio.",
                minlength: "El mensaje debe tener al menos 10 caracteres."
            }
        },
        submitHandler: function(form) {
            const name = $("#contactName").val();
            const email = $("#contactEmail").val();
            const message = $("#contactMessage").val();
            showDialog(`Mensaje enviado de: ${name} Mail:(${email}) Mensaje: ${message}`);
            form.reset();
        }
    });
});
