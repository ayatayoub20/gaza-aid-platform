"use strict";
let tableQuery = {

}
// Class definition
var KTEvaluationList = function () {
    // Define shared variables
    var datatable;
    var filterMonth;
    var filterPayment;
    var table
    let dataRes

    let dateQuery = {

    }

    // Private functions
    var inititemList = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "processing": true,
            "serverSide": true,
            "language": {
                "info": "عرض من _START_ إلى _END_ من مجموع _TOTAL_ سجل",
                "zeroRecords": "لا يوجد نتائج للبحث!",
                "infoEmpty": "لا يوجد بيانات!",
                "infoFiltered": "(تصفية من _MAX_  سجل)",
                "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">جاري جلب البيانات...</span>'
            },


            "ajax": {
                url: "/evaluations/data/get",
                "dataSrc": 'evaluations',
                "dataFilter": function (res) {
                    dataRes = JSON.parse(res)
                    return res
                }
            },


            columns: [
                {
                    data: 'type',
                    render: function (data, type, doc) {
                        let span

                        switch (data) {
                            case 'volToSt':
                                span = `<span class="badge badge-light-warning">تقييم متطوع</span>`
                                break;
                            case 'stToVol':
                                span = `<span class="badge badge-light-success">تقييم تقرير</span>`
                                break;
                        }

                        return span
                    }

                },
                {
                    data: 'rate',
                    render: function (data, type, doc) {
                        console.log(data);

                       return `<div class="d-flex align-items-center w-200px w-sm-300px flex-column">
                       <div class="rating">
                           <div class="rating-label ${(data >= 1) ? 'checked' : ''} ">
                               <span class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                       height="24" viewBox="0 0 24 24" fill="none">
                                       <path
                                           d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"
                                           fill="black"></path>
                                   </svg></span>
                           </div>
                           <div class="rating-label ${(data >= 2) ? 'checked' : ''}">
                               <span class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                       height="24" viewBox="0 0 24 24" fill="none">
                                       <path
                                           d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"
                                           fill="black"></path>
                                   </svg></span>
                           </div>
                           <div class="rating-label ${(data >= 3) ? 'checked' : ''}">
                               <span class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                       height="24" viewBox="0 0 24 24" fill="none">
                                       <path
                                           d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"
                                           fill="black"></path>
                                   </svg></span>
                           </div>
                           <div class="rating-label ${(data >= 4) ? 'checked' : ''}">
                               <span class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                       height="24" viewBox="0 0 24 24" fill="none">
                                       <path
                                           d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"
                                           fill="black"></path>
                                   </svg></span>
                           </div>
                           <div class="rating-label ${(data >= 5) ? 'checked' : ''}">
                               <span class="svg-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24"
                                       height="24" viewBox="0 0 24 24" fill="none">
                                       <path
                                           d="M11.1359 4.48359C11.5216 3.82132 12.4784 3.82132 12.8641 4.48359L15.011 8.16962C15.1523 8.41222 15.3891 8.58425 15.6635 8.64367L19.8326 9.54646C20.5816 9.70867 20.8773 10.6186 20.3666 11.1901L17.5244 14.371C17.3374 14.5803 17.2469 14.8587 17.2752 15.138L17.7049 19.382C17.7821 20.1445 17.0081 20.7069 16.3067 20.3978L12.4032 18.6777C12.1463 18.5645 11.8537 18.5645 11.5968 18.6777L7.69326 20.3978C6.99192 20.7069 6.21789 20.1445 6.2951 19.382L6.7248 15.138C6.75308 14.8587 6.66264 14.5803 6.47558 14.371L3.63339 11.1901C3.12273 10.6186 3.41838 9.70867 4.16744 9.54646L8.3365 8.64367C8.61089 8.58425 8.84767 8.41222 8.98897 8.16962L11.1359 4.48359Z"
                                           fill="black"></path>
                                   </svg></span>
                           </div>
                       </div>
                       </div>

                  `
                    }

                },{
                    data:"description"
                }


            ]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            KTMenu.createInstances();
            linkUpgradeEvaluationFun()
            linkDeleteEvaluationFun()
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-volunteer-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            tableQuery.search = e.target.value
            datatable.search(JSON.stringify(tableQuery)).draw();
        });
    }
    // Filter Datatable
    var handleFilter = function () {
        // Select filter options
        const filterForm = document.querySelector('[data-kt-volunteer-table-filter="form"]');
        const filterButton = filterForm.querySelector('[data-kt-volunteer-table-filter="filter"]');
        const resetButton = filterForm.querySelector('[data-kt-volunteer-table-filter="reset"]');
        const selectOptions = filterForm.querySelectorAll('select');
        const datepicker = filterForm.querySelector("[name=date]");

        // Filter datatable on submit
        filterButton.addEventListener('click', function () {
            let filter = {

            }
            // Get filter values
            selectOptions.forEach((item, index) => {
                if (item.value && item.value !== '') {
                    filter[item.id] = item.value
                }
            });
            if (datepicker.value && dateQuery) {
                filter.createdAt = dateQuery
            }
            tableQuery.filter = filter
            // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
            datatable.search(JSON.stringify(tableQuery)).draw();
        });

        // Reset datatable
        resetButton.addEventListener('click', function () {
            $(datepicker).val('')
            dateQuery = {}

            // Reset filter form
            selectOptions.forEach((item, index) => {
                // Reset Select2 dropdown --- official docs reference: https://select2.org/programmatic-control/add-select-clear-items
                $(item).val(null).trigger('change');
            });

            // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
            delete tableQuery.filter
            datatable.search(JSON.stringify(tableQuery)).draw();
        });



        // Handle datepicker range -- For more info on flatpickr plugin, please visit: https://flatpickr.js.org/
        $(function () {

            var start = moment().subtract(29, 'days');
            var end = moment();

            function cb(start, end) {
                dateQuery = {
                    $gte: moment(start).startOf('day').toDate(),
                    $lte: moment(end).endOf('day').toDate()
                }
                $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
            }

            $(datepicker).daterangepicker({
                clearBtn: true,
                startDate: start,
                endDate: end,
                ranges: {
                    'اليوم': [moment(), moment()],
                    'الأمس': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    'أخر 7 أيام': [moment().subtract(6, 'days'), moment()],
                    'أخر 30 يوم': [moment().subtract(29, 'days'), moment()],
                    'هذا الشهر': [moment().startOf('month'), moment().endOf('month')],
                    'الشهر الفائت': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "تطبيق",
                    "cancelLabel": "إلغاء",
                    "fromLabel": "من",
                    "toLabel": "إلى",
                    "customRangeLabel": "تاريخ مخصص",
                }

            }, cb);
            $(datepicker).val('')

            cb(start, end);
            $("div.daterangepicker").click(function (e) {
                e.stopPropagation();
            });

        });



    }
    $(document).on('click', 'body .dropdown-menu', function (e) {
        e.stopPropagation();
    });


    const linkUpgradeEvaluationFun = function () {
        $('.upgrade').on('click', function (e) {
            const volunteerID = $(this).attr('upgradeID')
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "هل أنت متأكد من ترقيه المستخدم ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "تم ترقيه المستخدم بنجاح.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(async function () {
                        //delete request

                        const req = await fetch(`/evaluations/upgrade/${volunteerID}`)
                        const res = await req.json()
                        location.reload()

                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "تم إلغاء عملية الترقيه.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        })

    }



    const linkDeleteEvaluationFun = function () {

        $('.delete').on('click', function (e) {
            const volunteerID = $(this).attr('deleteID')
            // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
            Swal.fire({
                text: "هل أنت متأكد من حذف المستخدم ؟",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "نعم",
                cancelButtonText: "لا",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "تم حذف المستخدم بنجاح.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(async function () {
                        //delete request

                        const req = await fetch(`/users/delete/${volunteerID}`)
                        const res = await req.json()
                        location.reload()

                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "تم إلغاء عملية الحذف.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    });
                }
            });
        })

    }






    // Public methods
    return {


        init: function () {
            table = document.querySelector('#kt_evaluations_table');


            if (!table) {
                return;
            }

            inititemList();
            handleSearchDatatable();
            handleFilter();


        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTEvaluationList.init();

});