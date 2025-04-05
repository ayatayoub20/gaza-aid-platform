"use strict";
// Class definition
var KTModaladminAdd = function () {
    var submitButton;
    var cancelButton;
    var closeButton;
    var validator;
    var form;
    var modal;

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
                    'password': {
                        validators: {
                            notEmpty: {
                                message: 'كلمة المرور مطلوبة!'
                            }
                        }
                    }, 'email': {
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
                                message: 'المدينة مطلوبة.'
                            }
                        }
                    },
                    'region': {
                        validators: {
                            notEmpty: {
                                message: 'عنوان السكن التفصيلي مطلوب!'
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
                            password: $('input[name="password"]').val(),
                            email: $('input[name="email"]').val(),
                            city: $('select[name="city"]').val(),
                            region: $('input[name="region"]').val(),
                        }


                        $.post('/admins/new', { payload: JSON.stringify(payload) }).then(recipientID => {
                            submitButton.removeAttribute('data-kt-indicator');

                            Swal.fire({
                                text: "تم إضافة المسؤول بنجاح!",
                                icon: "success",
                                buttonsStyling: false,
                                confirmButtonText: "حسنا",
                                customClass: {
                                    confirmButton: "btn btn-primary"
                                }
                            }).then(function (result) {
                                if (result.isConfirmed) {
                                    // Hide modal
                                    modal.hide();

                                    // Enable submit button after loading
                                    submitButton.disabled = false;

                                    // Redirect to customers list page
                                    location.reload()

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

        cancelButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "هل تريد إلغاء العملية ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal	
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "لم يتم إلغاء نموذج الإضافة!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسنا",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        closeButton.addEventListener('click', function (e) {
            e.preventDefault();

            Swal.fire({
                text: "هل أنت متأكد من إلغاء العملية ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form	
                    modal.hide(); // Hide modal	


                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "لم يتم إلغاء العملية!",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسنا",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        })
    }

    return {
        // Public functions
        init: function () {
            // Elements
            modal = new bootstrap.Modal(document.querySelector('#kt_modal_add_admin'));

            form = document.querySelector('#kt_modal_add_admin_form');
            submitButton = form.querySelector('#kt_modal_add_admin_submit');
            cancelButton = form.querySelector('#kt_modal_add_admin_cancel');
            closeButton = form.querySelector('#kt_modal_add_admin_close');

            $("#birthDate").daterangepicker({
                singleDatePicker: true,
                showDropdowns: true,
                minYear: 1901,
                maxYear: parseInt(moment().format("YYYY"), 10)
            })


            handleForm();
        }
    };
}();


const checkIfFormalIDExist = function () {
    return {
        validate: function (input) {
            const value = input.value;
            if (value.length == 9) {
                return $.post(`/utils/check-national-ID`, { nationalID: value }).then((data, statusCode) => {

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
    KTModaladminAdd.init();
});