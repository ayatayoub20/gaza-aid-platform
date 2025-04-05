"use strict";

// Class definition
var KTClosedReportsList = function () {
    // Define shared variables
    var datatable;
    var table
    let dataRes
    let  CITIES, REPORTS_TYPES


    // Private functions
    var inititemList = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "processing": true,
            "serverSide": true,
            "ordering": false,
            "bPaginate": false,
            "bInfo" : false,
            "language": {
                "info": "عرض من _START_ إلى _END_ من مجموع _TOTAL_ سجل",
                "zeroRecords": "لا يوجد نتائج للبحث!",
                "infoEmpty": "لا يوجد بيانات!",
                "infoFiltered": "(تصفية من _MAX_  سجل)",
                "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">جاري جلب البيانات...</span>'
            },


            "ajax": {
                url: `/reports/stranded/closed/data/get/${strandedID}`,
                "dataSrc": 'reports',
                "dataFilter": function (res) {
                    dataRes = JSON.parse(res)
                    CITIES = dataRes.CITIES
                    REPORTS_TYPES = dataRes.REPORTS_TYPES        
                    $('#closedCaseCounter').text(dataRes.recordsTotal)

                    return res
                }
            },


            columns: [
                { data: '' ,
                render: function (data, type, doc) {
                    return `  <!--begin::Card-->
                    <div class="card mb-6 mb-xl-9">
                        <!--begin::Card body-->
                        <div class="card-body">
                            <!--begin::Header-->
                            <div class="d-flex flex-stack mb-3">
                                <!--begin::Badge-->
                                <div class="badge badge-light">${REPORTS_TYPES[doc.type] || 'مجهول'}</div>
                                <!--end::Badge-->
                                <!--begin::Menu-->
                                <div>
                                    <button type="button"
                                        class="btn btn-sm btn-icon btn-color-light-dark btn-active-light-primary"
                                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                        <!--begin::Svg Icon | path: icons/duotune/general/gen024.svg-->
                                        <span class="svg-icon svg-icon-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                                viewBox="0 0 24 24">
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <rect x="5" y="5" width="5" height="5" rx="1" fill="#000000" />
                                                    <rect x="14" y="5" width="5" height="5" rx="1" fill="#000000"
                                                        opacity="0.3" />
                                                    <rect x="5" y="14" width="5" height="5" rx="1" fill="#000000"
                                                        opacity="0.3" />
                                                    <rect x="14" y="14" width="5" height="5" rx="1" fill="#000000"
                                                        opacity="0.3" />
                                                </g>
                                            </svg>
                                        </span>
                                        <!--end::Svg Icon-->
                                    </button>
                                    <!--begin::Menu 3-->
                                    <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-150px py-3"
                                        data-kt-menu="true">
                                        <!--begin::Heading-->
                                        <div class="menu-item px-3">
                                            <div class="menu-content text-muted pb-2 px-3 fs-7 text-uppercase">الخيارات
                                            </div>
                                        </div>
                                        <!--end::Heading-->
                                      
                                        ${typeof doc.strandedEvaluation == 'undefined' ? ` <!--begin::Menu item-->
                                        <div class="menu-item px-3 rate">
                                            <a href="#" id="${doc._id}" data-bs-toggle="modal" data-bs-target="#kt_modal_report_rate" class="menu-link rateBtn px-3">تقييم المنقذ</a>
                                        </div>
                                        <!--end::Menu item-->` : ''}
 
                                       
                                    </div>
                                    <!--end::Menu 3-->
                                </div>
                                <!--end::Menu-->
                            </div>
                            <!--end::Header-->
                            <!--begin::Title-->
                            <div class="mb-2">
                            <a href="#" class="fs-4 fw-bolder mb-1 text-gray-900 text-hover-primary">${moment(doc.createdAt).format('YYYY/MM/DD LTS')}</a>
                            </div>
                            <!--end::Title-->
                            <!--begin::Content-->
                            <div class="fs-6 fw-bold text-gray-600 mb-5">${doc.description}</div>
                            <!--end::Content-->
                            <!--begin::Content-->
                            <div class="fs-6 fw-bold text-gray-600 mb-5">توقيت البلاغ : ${moment(doc.createdAt).format('YYYY/MM/DD LTS')}</div>
                            <!--end::Content-->
                            <!--begin::Content-->
                            <div class="fs-6 fw-bold text-gray-600 mb-5">توقيت الإستلام : ${moment(doc.recivedAt).format('YYYY/MM/DD LTS')}</div>
                            <!--end::Content-->
                            <!--begin::Footer-->
                            <div class="d-flex flex-stack flex-wrapr">
                                <!--begin::Users-->
                                <div class="symbol-group symbol-hover my-1">
                                    <div class="symbol symbol-35px symbol-circle" data-bs-toggle="tooltip"
                                        title="${doc.volunteer.fullName}">
                                        <span class="symbol-label bg-warning text-inverse-warning fw-bolder">${doc.volunteer.fullName[0]}</span>
                                    </div>                                 
                                </div>
                                <!--end::Users-->
                                <!--begin::Stats-->
                        
                                <!--end::Stats-->
                            </div>
                            <!--end::Footer-->
                        </div>
                        <!--end::Card body-->
                    </div>
                    <!--end::Card-->`

                }
             }

            ]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            KTMenu.createInstances();  
            linkRateBtn()
        });

        const linkRateBtn = function () {

            $('.rateBtn').on('click' , function (e) {
                e.preventDefault()
                reportID = $(this).attr('id')
                
            })
            
        }
        
    }

   


    // Public methods
    return {


        init: function () {
            table = document.querySelector('#kt_report_closed_table');


            if (!table) {
                return;
            }

            inititemList();


        }
    }
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTClosedReportsList.init();

});