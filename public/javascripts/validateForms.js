
// A self-invoking function, also known as an immediately invoked function expression (IIFE), 
//      is a JavaScript function that is defined and executed immediately after it is created. 
// search more for wtf is self-invoking function in JS, very clunky

(function () {
    'use strict'

    bsCustomFileInput.init()

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()

