"use strict";

// Class definition
var KTReportsSearch = function() {
    // Elements
    var form;
    var submitButton;
    var validator;
    const errDisplay = ({ responseJSON }) => {
        const message = responseJSON.message
        if (message.constructor == Array) {
            return message.map((msg)=>`${msg}`).join(' , ')
        }
        return message
    }
        // Handle form
    var handleForm = function(e) {
        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
        validator = FormValidation.formValidation(
			form,
			{
				fields: {					
					'query': {
                        validators: {
							notEmpty: {
								message: 'الإستعلام مطلوب.'
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
                        query: $("input[name=query]").val(),                       
                    }


                    $.post('/reports/stranded/search', payload).then(res=> {
                        submitButton.removeAttribute('data-kt-indicator');
                        window.location = `/reports/stranded/page/get/${res.stranded}`

                      
                    }).catch(err=> {
                        Swal.fire({
                            text: errDisplay(err),
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "حسنا",
                            customClass: {
                                confirmButton: "btn btn-primary"
                            }
                        });
                        $('#query').val('')
                       
                        submitButton.removeAttribute('data-kt-indicator');
                         // Enable submit button after loading
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
                     // Enable submit button after loading
                     submitButton.disabled = false;

                }
            });
        }
    });

    }

    // Public functions
    return {
        // Initialization
        init: function() {
            form = document.querySelector('#kt_reports_search_form');
            submitButton = document.querySelector('#kt_reports_search_submit');
            
            handleForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTReportsSearch.init();
});
