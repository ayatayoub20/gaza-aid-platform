"use strict";

// Class definition
var KTCreateAccount = function () {
    // Elements
    var modal;
    var modalEl;

    var stepper;
    var form;
    var formSubmitButton;
    var formContinueButton;

    // Variables
    var stepperObj;
    var validations = [];
    const payload = {}

    // Private Functions
    var initStepper = function () {
        // Initialize Stepper
        stepperObj = new KTStepper(stepper);

        // Stepper change event
        stepperObj.on('kt.stepper.changed', function (stepper) {
            payload.nationalID = $(form).find('input[name="nationalID"]').val()
            payload.fullName = $(form).find('input[name="fullName"]').val()
            payload.phoneNumber = $(form).find('input[name="phoneNumber"]').val()
            payload.birthDate = $(form).find('input[name="birthDate"]').val()
            payload.password = $(form).find('input[name="password"]').val()
            payload.email = $(form).find('input[name="email"]').val()
            payload.city = $(form).find('select[name="city"]').val()
            payload.region = $(form).find('input[name="region"]').val()

            if (stepperObj.getCurrentStepIndex() === 4) {
                formSubmitButton.classList.remove('d-none');
                formSubmitButton.classList.add('d-inline-block');
                formContinueButton.classList.add('d-none');
                console.log(payload);
            } else if (stepperObj.getCurrentStepIndex() === 5) {
                formSubmitButton.classList.add('d-none');
                formContinueButton.classList.add('d-none');
            } else {
                formSubmitButton.classList.remove('d-inline-block');
                formSubmitButton.classList.remove('d-none');
                formContinueButton.classList.remove('d-none');
            }
        });

        // Validation before going to next page
        stepperObj.on('kt.stepper.next', function (stepper) {
            console.log('stepper.next');

            // Validate form before change stepper step
            var validator = validations[stepper.getCurrentStepIndex() - 1]; // get validator for currnt step

            if (validator) {
                validator.validate().then(function (status) {
                    console.log('validated!');

                    if (status == 'Valid') {
                        stepper.goNext();

                        KTUtil.scrollTop();
                    } else {
                        Swal.fire({
                            text: "حصل خطأ ما !",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "حسناً",
                            customClass: {
                                confirmButton: "btn btn-light"
                            }
                        }).then(function () {
                            KTUtil.scrollTop();
                        });
                    }
                });
            } else {
                stepper.goNext();

                KTUtil.scrollTop();
            }
        });

        // Prev event
        stepperObj.on('kt.stepper.previous', function (stepper) {
            console.log('stepper.previous');

            stepper.goPrevious();
            KTUtil.scrollTop();
        });
    }

    var handleForm = function () {
        formSubmitButton.addEventListener('click', function (e) {
            // Validate form before change stepper step
            var validator = validations[2]; // get validator for last form

            validator.validate().then(async function (status) {
                console.log('validated!');

                if (status == 'Valid') {
                    // Prevent default button action
                    e.preventDefault();
                    await handleFormSubmit()

                } else {
                    Swal.fire({
                        text: "حصل خطأ ما !",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً",
                        customClass: {
                            confirmButton: "btn btn-light"
                        }
                    }).then(function () {
                        KTUtil.scrollTop();
                    });
                }
            });
        });

        // Expiry month. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="card_expiry_month"]')).on('change', function () {
            // Revalidate the field when an option is chosen
            validations[3].revalidateField('card_expiry_month');
        });

        // Expiry year. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="card_expiry_year"]')).on('change', function () {
            // Revalidate the field when an option is chosen
            validations[3].revalidateField('card_expiry_year');
        });

        // Expiry year. For more info, plase visit the official plugin site: https://select2.org/
        $(form.querySelector('[name="business_type"]')).on('change', function () {
            // Revalidate the field when an option is chosen
            validations[2].revalidateField('business_type');
        });
    }

    var initValidation = function () {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        FormValidation.validators.checkValidPhoneNumber = checkValidPhoneNumber;
        FormValidation.validators.checkValidFormalID = checkValidFormalID;
        FormValidation.validators.checkIfFormalIDExist = checkIfFormalIDExist;

        // Step 1
        validations.push(FormValidation.formValidation(
            form,
            {
                fields: {
                    accept: {
                        validators: {
                            notEmpty: {
                                message: 'يجب الموافقة على سياسة الإستخدام للإستمرار'
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
        ));

        // Step 2
        validations.push(FormValidation.formValidation(
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
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));

        // Step 3
        validations.push(FormValidation.formValidation(
            form,
            {
                fields: {
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
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: '.fv-row',
                        eleInvalidClass: '',
                        eleValidClass: ''
                    })
                }
            }
        ));

    }

    var handleFormSubmit = async function () {

        // Disable button to avoid multiple click 
        formSubmitButton.disabled = true;

        // Show loading indication
        formSubmitButton.setAttribute('data-kt-indicator', 'on');
        const res = await fetch('/sign-up', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(payload)
        })

        const clb = await res.json()
        if(clb.success){
            Swal.fire({
                text: "تم تسجيل طلبك بنجاح!",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "حسناً",
                customClass: {
                    confirmButton: "btn btn-light"
                }
            }).then(function () {
                window.location = '/'
            });
        }else{
            Swal.fire({
                text: "حصل خطأ ما , حاول مرة أخرى!",
                icon: "error",
                buttonsStyling: false,
                confirmButtonText: "حسناً",
                customClass: {
                    confirmButton: "btn btn-light"
                }
            }).then(function () {
                location.reload()
            });
        }


        // Simulate form submission
        // Hide loading indication
        formSubmitButton.removeAttribute('data-kt-indicator');

        // Enable button
        formSubmitButton.disabled = false;

        stepperObj.goNext();
        //KTUtil.scrollTop();
    }

    

    return {
        // Public Functions
        init: function () {
            // Elements
            modalEl = document.querySelector('#kt_modal_create_account');
            if (modalEl) {
                modal = new bootstrap.Modal(modalEl);
            }

            stepper = document.querySelector('#kt_create_account_stepper');
            form = stepper.querySelector('#kt_create_account_form');
            formSubmitButton = stepper.querySelector('[data-kt-stepper-action="submit"]');
            formContinueButton = stepper.querySelector('[data-kt-stepper-action="next"]');
            $("#birthDate").flatpickr();


            initStepper();
            initValidation();
            handleForm();
        }
    };
}();

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


// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTCreateAccount.init();
});