"use strict";

// Class definition
var KTforgetPassword = function () {
    // Elements
    var form;
    var submitButton;
    var validator;
    const errDisplay = ({ responseJSON }) => {
        const message = responseJSON.message
        if (message.constructor == Array) {
            return message.map((msg) => `${msg}`).join(' , ')
        }
        return message
    }
    // Handle form
    var handleForm = function (e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'email': {
                        validators: {
                            notEmpty: {
                                message: 'البريد الإلكتروني مطلوب.'
                            },
                            emailAddress: {
                                message: 'البريد الإلكتروني غير صالح!'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row'
                    })
                }
            }
        );

        // Handle form submit
        // Action buttons
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Validate form before submit
            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable submit button whilst loading
                        submitButton.disabled = true;
                        const payload = {
                            email: $("input[name=email]").val(),
                        }


                        $.post('/forget-password', payload).then(res => {
                            submitButton.removeAttribute('data-kt-indicator');
                            Swal.fire({
                                text: "تم إرسال إعدادت الدخول إلى البريد الإلكتروني.",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {



                                    // Redirect to customers list page
                                    location.reload()
                                    // Enable submit button after loading
                                    submitButton.disabled = false;

                                }
                            })


                        }).catch(err => {
                            Swal.fire({
                                text: errDisplay(err),
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });
                            submitButton.removeAttribute('data-kt-indicator');
                            // Enable submit button after loading
                            submitButton.disabled = false;
                            $('#email').val('')
                        })
                    } else {
                        Swal.fire({
                            text: "حصل خطأ ما ، يرجى المحاولة مرة أخرى!",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "حسنا",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        submitButton.removeAttribute('data-kt-indicator');
                        // Enable submit button after loading
                        submitButton.disabled = false;
                        $('#email').val('')
                    }
                });
            }
        });

    }

    // Public functions
    return {
        // Initialization
        init: function () {
            form = document.querySelector('#kt_forget_password_form');
            submitButton = document.querySelector('#kt_forget_password_submit');

            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTforgetPassword.init();
});
