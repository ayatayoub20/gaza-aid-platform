"use strict";
// Class definition
var KTModalCustomersAdd = function () {
    var submitButton;
    var validator;
    var form;

    // Init form inputs
    var handleForm = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/



        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'حقل كلمة المرور مطلوب'
                            }
                        }
                    },
                    'confirmPassword': {
                        validators: {
                            notEmpty: {
                                message: 'حقل تاكيد كلمة المرور مطلوب'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        );
        // Action buttons
        submitButton.addEventListener('click', function (e) {
            e.preventDefault();

            var confirmPassword = function () {
                var password = $("input[name=password]").val();
                var confirmPassword= $("input[name=confirmPassword]").val();
                if (password == confirmPassword) {
                    return true ;
                }else {
                    return false;
                }

            }
            

            // Validate form before submit
            if (validator && confirmPassword()) {
                validator.validate().then(function (status) {
                    
                    console.log('validated!');
                    if (status == 'Valid') {
                        submitButton.setAttribute('data-kt-indicator', 'on');

                        // Disable submit button whilst loading
                        submitButton.disabled = true;
                        const payload = {
                            password: $("input[name=password]").val(),
                            confirmPassword: $("input[name=confirmPassword]").val(),
                        }

                        var id = $("#id").val();
                        $.post(`/users/password/change/${id}`, {payload: JSON.stringify(payload)}).then(recipientID=> {
                            submitButton.removeAttribute('data-kt-indicator');

                            Swal.fire({
                                text: "تم تعديل كلمة المرور بنجاح!",
                                icon: "success",
                                buttonsSstyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {

                                    // Redirect to customers list page
                                    window.location = `/users/profile/${id}`
                                }
                            })
                        }).catch(error=> {
                            Swal.fire({
                                text: error.responseJSON.error,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                },
                                
                            })
                           
                            submitButton.removeAttribute('data-kt-indicator');
                            submitButton.disabled = false;

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

                    }
                });
            }else {
                Swal.fire({
                    text: "كلمتي السر غير متطابقتان",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "حسنا",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    },
                    
                })
               
                submitButton.removeAttribute('data-kt-indicator');
                submitButton.disabled = false;

            }
        });


    }

    return {
        // Public functions
        init: function () {
            // Elements

            form = document.querySelector('#kt_new_password_form');
            submitButton = form.querySelector('#kt_new_password_submit');

         


            handleForm();
        }
    };
}();






// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTModalCustomersAdd.init();
});