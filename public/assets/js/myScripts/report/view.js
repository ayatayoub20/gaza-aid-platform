"use strict";


// Class definition
var KTModalReportView = function () {
    var followBtn = document.querySelector('#kt_user_recive_button');

    // followBtn button
    var initUserfollowBtnButton = function () {
        if (followBtn) {
            followBtn.addEventListener('click', async function (e) {
                // Prevent default action 
                e.preventDefault();

                // Show indicator
                followBtn.setAttribute('data-kt-indicator', 'on');

                // Disable button to avoid multiple click 
                followBtn.disabled = true;

                // Check button state
                if (followBtn.classList.contains("btn-success")) {
                    const req = await fetch(`/reports/recive/${reportID}?action=cancel`)
                    const res = await req.json()
                    if (res.success) {
                        followBtn.removeAttribute('data-kt-indicator');
                        followBtn.classList.remove("btn-success");
                        followBtn.classList.add("btn-light");
                        followBtn.querySelector(".svg-icon").classList.add("d-none");
                        followBtn.querySelector(".indicator-label").innerHTML = 'إستلام';
                        followBtn.disabled = false;
                    }

                } else {
                    const req = await fetch(`/reports/recive/${reportID}?action=recive`)
                    const res = await req.json()
                    if (res.success) {
                        followBtn.removeAttribute('data-kt-indicator');
                        followBtn.classList.add("btn-success");
                        followBtn.classList.remove("btn-light");
                        followBtn.querySelector(".svg-icon").classList.remove("d-none");
                        followBtn.querySelector(".indicator-label").innerHTML = 'مستلم';
                        followBtn.disabled = false;
                    }

                }
                location.reload()
            });


        }
    }
    function initMap(lat, lng) {
        // Map options
        var options = {
            zoom: 15,
            center: { lat, lng }
        }

        // New map
        var map = new google.maps.Map(document.getElementById('map'), options);
        // Add marker
        var marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
        });

    }


    const recived = $(followBtn).attr('recived')
    if (recived == "true") {
        followBtn.removeAttribute('data-kt-indicator');
        followBtn.classList.add("btn-success");
        followBtn.classList.remove("btn-light");
        followBtn.querySelector(".svg-icon").classList.remove("d-none");
        followBtn.querySelector(".indicator-label").innerHTML = 'مستلم';
        followBtn.disabled = false;
    } else {
        followBtn.removeAttribute('data-kt-indicator');
        followBtn.classList.remove("btn-success");
        followBtn.classList.add("btn-light");
        followBtn.querySelector(".svg-icon").classList.add("d-none");
        followBtn.querySelector(".indicator-label").innerHTML = 'إستلام';
        followBtn.disabled = false;
    }

    return {
        // Public functions
        init: function () {
            // Elements
            initUserfollowBtnButton()
            const lat = $('#latitude').val()
            const lng = $('#longitude').val()

            initMap(Number(lat), Number(lng))


        }
    };
}();








// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTModalReportView.init();
});