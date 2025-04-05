"use strict";
// Class definition
var KTModalUserEdit = function () {
    var submitButton;
    var validator;
    var form;
    var modal;
    var id = $("#id").val();

    // Init form inputs
    var handleForm = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        FormValidation.validators.checkIfFormalIDExist = checkIfFormalIDExist;
        FormValidation.validators.checkValidPhoneNumber = checkValidPhoneNumber;
        FormValidation.validators.checkValidFormalID = checkValidFormalID;


        validator = FormValidation.formValidation(
            form,
            {
                fields: {
                    'nationalID': {
                        validators: {
                            checkValidFormalID: {
                                message: 'رقم الهوية غير صالح'

                            },
                            notEmpty: {
                                message: 'رقم الهوية الوطنية مطلوبة!'
                            },
                            checkIfFormalIDExist: {
                                message: 'رقم الهوية موجود مسبقاً.'

                            }
                        }
                    },
                    'fullName': {
                        validators: {
                            notEmpty: {
                                message: 'الاسم رباعي مطلوب!'
                            }
                        }
                    },
                    'phoneNumber': {
                        validators: {
                            notEmpty: {
                                message: 'رقم الجوال مطلوب'
                            },
                            stringLength: {
                                min: 10,
                                max: 10,
                                message: 'رقم الجوال يجب أن يحتوي على 10 رقم.'
                            },
                            checkValidPhoneNumber: {
                                message: 'رقم الجوال غير صالح'
                            }
                        }
                    },
                    'birthDate': {
                        validators: {
                            notEmpty: {
                                message: 'تاريخ الميلاد مطلوب!'
                            }
                        }
                    },
                    'email': {
                        validators: {
                            notEmpty: {
                                message: 'عنوان البريد الإلكتروني مطلوب!'
                            },
                            emailAddress: {
                                message: 'البريد الإلكتروني غير صالح!'
                            }
                        }
                    },
                    
                    'city': {
                        validators: {
                            notEmpty: {
                                message: 'المدينة مطلوبة'
                            }
                        }
                    },
                    'region': {
                        validators: {
                            notEmpty: {
                                message:  'العنوان التفصيلي'
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
        );/*

		// Revalidate country field. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="country"]')).on('change', function() {
            // Revalidate the field when an option is chosen
            validator.revalidateField('country');
        });
*/
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
                            nationalID: $('input[name="nationalID"]').val(),
                            fullName: $('input[name="fullName"]').val(),
                            phoneNumber: $('input[name="phoneNumber"]').val(),
                            birthDate: $('input[name="birthDate"]').val(),
                            email: $('input[name="email"]').val(),
                            city: $('select[name="city"]').val(),
                            region: $('input[name="region"]').val(),
                        }
                       

                        $.post(`/users/profile/edit/${id}`, { payload: JSON.stringify(payload) }).then(recipientID => {
                            submitButton.removeAttribute('data-kt-indicator');

                            Swal.fire({
                                text: "تم تعديل البيانات بنجاح!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {

                                    // Enable submit button after loading
                                    submitButton.disabled = false;

                                    // Redirect to Employees list page
                                    window.location = `/users/profile/${id}`
                                }
                            })
                        }).catch(err => {
                            Swal.fire({
                                text: `${err.responseJSON.msg}`,
                                icon: "error",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            });

                            submitButton.removeAttribute('data-kt-indicator');

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
            }
        });




    }

    return {
        // Public functions
        init: function () {
            // Elements

            form = document.querySelector('#kt_modal_edit_user_form');
            submitButton = form.querySelector('#kt_modal_edit_user_submit');

            const fp = flatpickr("#birthDate_datepicker", {

            });

            fp.setDate($('#birthDate_datepicker').val())


            $('#city').val($('#city').attr('selected-item')).change()



            handleForm();
        }
    };
}();




const checkIfFormalIDExist = function () {
    return {
        validate: function (input) {
            const value = input.value;
            if (value.length == 9) {
                return $.post(`/utils/check-national-ID`, { nationalID: value , id}).then((data, statusCode) => {

                    if (data.isExisted) {
                        return {
                            valid: false,
                        };
                    } else {
                        return {
                            valid: true,
                        };
                    }

                }).catch(console.log)
            }

        },
    };
};

const checkValidPhoneNumber = function () {
    return {
        validate: function (input) {
            const value = input.value;
            if (!isNaN(Number(value)) && ((value.indexOf('059') === 0 || value.indexOf('056') === 0))) {
                return {
                    valid: true,
                };
            } else {
                return {
                    valid: false,
                };
            }
        },
    };
};



const checkValidFormalID = function () {
    return {
        validate: function (input) {
            const value = input.value;
            console.log(value);
            if (!isNaN(Number(value)) && value.length == 9 && value.indexOf('0') !== 0) {
                return {
                    valid: true,
                };


            }
            return {
                valid: false,
            };

        },
    };
};



// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTModalUserEdit.init();
});