var appId = '05b2a8bb';
var appKey = '15d4f32508a17b4b8730de19265d81c4';
var airport = 'PEE';
var date = new Date();
var hour = date.getHours();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

var cities = [];
var airlines = [];

function getStatus(shortStatus) {
    switch (shortStatus) {
        case 'A':
            return 'Active';
        case 'C':
            return 'Canceled';
        case 'D':
            return 'Diverted';
        case 'DN':
            return 'Data source needed';
        case 'L':
            return 'Landed';
        case 'NO':
            return 'Not Operational';
        case 'R':
            return 'Redirected';
        case 'S':
            return 'Scheduled';
    }
    return 'Unknown';
}

function getTime(time) {
    var minutes = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes();
    var hours = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours();
    return hours + ':' + minutes;
}

function getFlights(type) {
    $('#flightTable').hide();
    $('.sk-circle').show();
    $('#flightTable tr:not(:first)').remove();
    $.ajax({
        method: "GET",
        url: 'getInfo.php',
        data: {
            type: type,
            appId: appId,
            appKey: appKey,
            hour: hour,
            day: day,
            month: month,
            year: year,
            airport: airport
        }
    })
        .done(function (response) {
            var result = jQuery.parseJSON(response);

            $.each(result.appendix.airports, function (index, airport) {
                if (cities[airport.fs] === undefined) {
                    cities[airport.fs] = airport.city;
                }
            });

            $.each(result.appendix.airlines, function (index, airline) {
                if (airlines[airline.fs] === undefined) {
                    airlines[airline.fs] = airline.name;
                }
            });

            $.each(result.flightStatuses, function (index, flight) {
                if (type !== 'delay' || type === 'delay' && flight.delays !== undefined) {
                    var flightDate = new Date(type === 'arrive' ? flight.arrivalDate.dateLocal : flight.departureDate.dateLocal);
                    $('#flightTable tr:last').after('<tr>' +
                        '<td>' + getTime(flightDate) + '</td>' +
                        '<td>' + cities[flight.departureAirportFsCode] + '</td>' +
                        '<td>' + cities[flight.arrivalAirportFsCode] + '</td>' +
                        '<td>' + airlines[flight.carrierFsCode] + '</td>' +
                        '<td>' + flight.flightNumber + '</td>' +
                        '<td>' + getStatus(flight.status) +'</td>' +
                        '</tr>');
                }
            });

            $('#flightTable').show();
            $('.sk-circle').hide();
        });
}

$('#search').keyup(function() {
    var flightNumber = document.getElementById('search');
    var table = document.getElementById('flightTable');
    var regPhrase = new RegExp(flightNumber.value, 'i');
    var flag = false;
    for (var i = 1; i < table.rows.length; i++) {
        flag = false;
        for (var j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = regPhrase.test(table.rows[i].cells[j].innerHTML);
            if (flag) break;
        }
        if (flag) {
            table.rows[i].style.display = "";
        } else {
            table.rows[i].style.display = "none";
        }

    }
});

$('.link').click(function(){
    getFlights($(this).data('value'));
    $('.nav li').removeClass('active');
    $(this).parent().addClass('active');

    return false;
});

$(document).ready(getFlights('arrive'));