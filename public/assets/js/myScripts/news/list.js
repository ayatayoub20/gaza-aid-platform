"use strict";
let tableQuery = {

}
// Class definition
var KTnewsTable = function () {
    // Define shared variables
    var datatable;
    var filterMonth;
    var filterPayment;
    var table
    let dataRes
    let CITIES
    let access
    let user

    let dateQuery = {

    }

    // Private functions
    var initnewsList = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "processing": true,
            "serverSide": true,
            "ordering": false,

            "language": {
                "info": "عرض من _START_ إلى _END_ من مجموع _TOTAL_ سجل",
                "zeroRecords": "لا يوجد نتائج للبحث!",
                "infoEmpty": "لا يوجد بيانات!",
                "infoFiltered": "(تصفية من _MAX_  سجل)",
                "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">جاري جلب البيانات...</span>'
            },


            "ajax": {
                url: "/news/data/get",
                "dataSrc": 'news',
                "dataFilter": function (res) {
                    dataRes = JSON.parse(res)
                    CITIES = dataRes.CITIES
                    access = dataRes.access
                    user = dataRes.user
                    return res
                }
            },


            columns: [
                {
                    data: '',
                    render: function (data, type, doc) {
                        return `<!--begin::Card-->
                        <div class="card mb-6 mb-xl-9">
                            <!--begin::Card body-->
                            <div class="card-body">
                                <!--begin::Header-->
                                <div class="d-flex flex-stack mb-3">
                                    <!--begin::Badge-->
                                    <div class="badge badge-light">خبر جديد</div>
                                    <!--end::Badge-->
                                    ${user != null && user.type == 'admin' ? 
                                    `<!--begin::Menu-->
                                    <div>
                                        <button type="button" class="btn btn-sm btn-icon btn-color-light-dark btn-active-light-primary"
                                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                            <!--begin::Svg Icon | path: icons/duotune/general/gen024.svg-->
                                            <span class="svg-icon svg-icon-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                        <rect x="5" y="5" width="5" height="5" rx="1" fill="#000000" />
                                                        <rect x="14" y="5" width="5" height="5" rx="1" fill="#000000" opacity="0.3" />
                                                        <rect x="5" y="14" width="5" height="5" rx="1" fill="#000000" opacity="0.3" />
                                                        <rect x="14" y="14" width="5" height="5" rx="1" fill="#000000" opacity="0.3" />
                                                    </g>
                                                </svg>
                                            </span>
                                            <!--end::Svg Icon-->
                                        </button>
                                        <!--begin::Menu 3-->
                                        <div class="menu menu-sub menu-sub-dropdown text-center menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-150px py-3"
                                            data-kt-menu="true">
                                            <!--begin::Heading-->
                                            <div class="menu-item px-3">
                                                <div class="menu-content text-muted pb-2 px-3 fs-7 text-uppercase">الخيارات
                                                </div>
                                            </div>
                                            <!--end::Heading-->
                                            <!--begin::Menu item-->
                                            <div class="menu-item px-3">
                                                <a href="#" class="menu-link px-3 deleteReport" id="${doc._id}">حذف</a>
                                            </div>
                                            <!--end::Menu item-->
                                        </div>
                                        <!--end::Menu 3-->
                                    </div>
                                    <!--end::Menu-->` : ''
                                }
                                </div>
                                <!--end::Header-->
                                <!--begin::Title-->
                                <div class="mb-2">
                                    <a href="#" class="fs-4 fw-bolder mb-1 text-gray-900 text-hover-primary">${doc.title}</a>
                                </div>
                                <!--end::Title-->
                                <!--begin::Content-->
                                <div class="fs-6 fw-bold text-gray-600 mb-5">${doc.body}</div>
                                <!--end::Content-->
                                <!--begin::Footer-->
                                <div class="d-flex flex-stack flex-wrapr">
                                    <!--begin::Users-->
                                    <div class="symbol-group symbol-hover my-1">
                                        <div class="symbol symbol-35px symbol-circle" data-bs-toggle="tooltip"
                                            title="${doc.createdBy.fullName}">
                                            <span
                                                class="symbol-label bg-warning text-inverse-warning fw-bolder">${doc.createdBy.fullName[0]}</span>
                        
                                        </div>
                                        <a class=" fw-bolder p-2" href="#">${doc.createdBy.fullName}</a>
                                        <span class="text-muted">في ${moment(doc.createdAt).format('YYYY/MM/DD HH:mm A')}</span>
                        
                                    </div>
                                    <!--end::Users-->
                                    <!--begin::Stats-->
                                    <div class="d-flex my-1">
                                        <!--begin::Stat-->
                                        <div class="border border-dashed border-gray-300 rounded py-2 px-3">
                                            <!--begin::Svg Icon | path: icons/duotune/communication/com008.svg-->
                                            <span class="svg-icon svg-icon-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <rect x="0" y="0" width="24" height="24" />
                                                    <path
                                                        d="M5,10.5 C5,6 8,3 12.5,3 C17,3 20,6.75 20,10.5 C20,12.8325623 17.8236613,16.03566 13.470984,20.1092932 C12.9154018,20.6292577 12.0585054,20.6508331 11.4774555,20.1594925 C7.15915182,16.5078313 5,13.2880005 5,10.5 Z M12.5,12 C13.8807119,12 15,10.8807119 15,9.5 C15,8.11928813 13.8807119,7 12.5,7 C11.1192881,7 10,8.11928813 10,9.5 C10,10.8807119 11.1192881,12 12.5,12 Z"
                                                        fill="#000000" fill-rule="nonzero" />
                                                </svg>
                                            </span>
                                            <!--end::Svg Icon-->
                                            <span class="ms-1 fs-7 fw-bolder text-gray-600">${ CITIES[doc.createdBy.city] || 'مجهول'}</span>
                                        </div>
                                        <!--end::Stat-->
                                       
                                    </div>
                                    <!--end::Stats-->
                                </div>
                                <!--end::Footer-->
                            </div>
                            <!--end::Card body-->
                        </div>
                        <!--end::Card-->
                        `


                        

                    }
                }


            ]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            KTMenu.createInstances();
            linkDeleteFun();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-news-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            tableQuery.search = e.target.value
            datatable.search(JSON.stringify(tableQuery)).draw();
        });
    }
    // Filter Datatable
    var handleFilter = function () {
        // Select filter options
        const filterForm = document.querySelector('[data-kt-news-table-filter="form"]');
        const filterButton = filterForm.querySelector('[data-kt-news-table-filter="filter"]');
        const resetButton = filterForm.querySelector('[data-kt-news-table-filter="reset"]');
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


    const linkDeleteFun = ()=>{
        $('.deleteReport').on('click' , function (e) {
            const newsID = $(this).attr('id')
            console.log(newsID);
              // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
              Swal.fire({
                text: "هل أنت متأكد من حذف الخبر ؟",
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
                        text: "تم حذف الخبر بنجاح",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "حسناً",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary",
                        }
                    }).then(async function () {
                        //delete request
    
                        const req = await fetch(`/news/delete/${newsID}`)
                        const res = await req.json()
                        location.reload()
    
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text:  "تم إلغاء عملية الحذف.",
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
            table = document.querySelector('#kt_news_table');


            if (!table) {
                return;
            }

            initnewsList();
            handleSearchDatatable();
            handleFilter();


        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTnewsTable.init();

});