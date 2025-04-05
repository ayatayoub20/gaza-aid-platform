"use strict";
// Class definition
var KTOpenReportsList = function () {
    // Define shared variables
    var datatable;
    var table
    let dataRes
    let  CITIES, REPORTS_TYPES

    // Private functions
    var inititemList = function () {

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
                url: "/reports/open/data/get",
                "dataSrc": 'reports',
                "dataFilter": function (res) {
                    dataRes = JSON.parse(res)
                    CITIES = dataRes.CITIES
                    REPORTS_TYPES = dataRes.REPORTS_TYPES        
                    $('#openCaseCounter').text(dataRes.recordsTotal)

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
                                        <!--begin::Menu item-->
                                        <div class="menu-item px-3">
                                            <a href="/reports/page/get/${doc._id}" class="menu-link px-3">عرض</a>
                                        </div>
                                        <!--end::Menu item-->
                                         <!--begin::Menu item-->
                                         <div class="menu-item px-3">
                                            <a href="#"  class="menu-link px-3 deleteReport" id="${doc._id}">حذف</a>
                                        </div>
                                        <!--end::Menu item-->
                                    </div>
                                    <!--end::Menu 3-->
                                </div>
                                <!--end::Menu-->
                            </div>
                            <!--end::Header-->
                            <!--begin::Title-->
                            <div class="mb-2">
                                <a href="#" class="fs-4 fw-bolder mb-1 text-gray-900 text-hover-primary">${doc.stranded.fullName}</a>
                            </div>
                            <!--end::Title-->
                            <!--begin::Content-->
                            <div class="fs-6 fw-bold text-gray-600 mb-5">${doc.description}</div>
                            <!--end::Content-->
                            <!--begin::Content-->
                            <div class="fs-6 fw-bold text-gray-600 mb-5">توقيت البلاغ : ${moment(doc.createdAt).format('YYYY/MM/DD LTS')}</div>
                            <!--end::Content-->
                            <!--begin::Footer-->
                            <div class="d-flex flex-stack flex-wrapr">
                             
                                <!--begin::Stats-->
                                <div class="d-flex my-1">
                                    <!--begin::Stat-->
                                    <div class="border border-dashed border-gray-300 rounded py-2 px-3">
                                        <!--begin::Svg Icon | path: icons/duotune/communication/com008.svg-->
                                        <span class="svg-icon svg-icon-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none">
                                                <rect x="0" y="0" width="24" height="24" />
                                                <path
                                                    d="M5,10.5 C5,6 8,3 12.5,3 C17,3 20,6.75 20,10.5 C20,12.8325623 17.8236613,16.03566 13.470984,20.1092932 C12.9154018,20.6292577 12.0585054,20.6508331 11.4774555,20.1594925 C7.15915182,16.5078313 5,13.2880005 5,10.5 Z M12.5,12 C13.8807119,12 15,10.8807119 15,9.5 C15,8.11928813 13.8807119,7 12.5,7 C11.1192881,7 10,8.11928813 10,9.5 C10,10.8807119 11.1192881,12 12.5,12 Z"
                                                    fill="#000000" fill-rule="nonzero" />
                                            </svg>
                                        </span>
                                        <!--end::Svg Icon-->
                                        <span class="ms-1 fs-7 fw-bolder text-gray-600">${CITIES[doc.stranded.city] || 'مجهول'}</span>
                                    </div>
                                    <!--end::Stat-->
                                    <!--begin::Stat-->
                                    <div class="border border-dashed border-gray-300 rounded py-2 px-3 ms-3">
                                        <!--begin::Svg Icon | path: icons/duotune/communication/com012.svg-->
                                        <span class="svg-icon svg-icon-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none">
                                                <rect x="0" y="0" width="24" height="24"/>
                                                <path d="M6,2 L18,2 C19.6568542,2 21,3.34314575 21,5 L21,19 C21,20.6568542 19.6568542,22 18,22 L6,22 C4.34314575,22 3,20.6568542 3,19 L3,5 C3,3.34314575 4.34314575,2 6,2 Z M12,11 C13.1045695,11 14,10.1045695 14,9 C14,7.8954305 13.1045695,7 12,7 C10.8954305,7 10,7.8954305 10,9 C10,10.1045695 10.8954305,11 12,11 Z M7.00036205,16.4995035 C6.98863236,16.6619875 7.26484009,17 7.4041679,17 C11.463736,17 14.5228466,17 16.5815,17 C16.9988413,17 17.0053266,16.6221713 16.9988413,16.5 C16.8360465,13.4332455 14.6506758,12 11.9907452,12 C9.36772908,12 7.21569918,13.5165724 7.00036205,16.4995035 Z" fill="#000000"/>
                                                                                </svg>
                                        </span>
                                        <!--end::Svg Icon-->
                                        <span class="ms-1 fs-7 fw-bolder text-gray-600">${doc.stranded.age}</span>
                                    </div>
                                    <!--end::Stat-->
                                </div>
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
            linkDeleteReportFun()
        });
    }


    // Public methods
    return {


        init: function () {
            table = document.querySelector('#kt_report_open_table');


            if (!table) {
                return;
            }
            inititemList();
        }
    }
}();

const linkDeleteReportFun = function () {

    $('.deleteReport').on('click' , function (e) {
        const reportID = $(this).attr('id')
          // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
          Swal.fire({
            text: "هل أنت متأكد من حذف البلاغ ؟",
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
                    text: "تم حذف البلاغ بنجاح",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "حسناً",
                    customClass: {
                        confirmButton: "btn fw-bold btn-primary",
                    }
                }).then(async function () {
                    //delete request

                    const req = await fetch(`/reports/delete/${reportID}`)
                    const res = await req.json()
                    location.reload()

                });
            } else if (result.dismiss === 'cancel') {
                Swal.fire({
                    text: itemName + "تم إلغاء عملية الحذف.",
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


// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTOpenReportsList.init();

});