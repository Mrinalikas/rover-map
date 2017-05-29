var path = [[]];
var distanceB;
var map;
var date2;
var date1;
var pathNum;
var contentString;
$(document).ready(function () {
    var fromdate, todate;

      $('#datetimepicker6').datetimepicker();
     $('#datetimepicker7').datetimepicker({
     useCurrent: false
     });
     $("#datetimepicker6").data("DateTimePicker").clear(true);
     $("#datetimepicker7").data("DateTimePicker").clear(true);
     $("#datetimepicker6").on("dp.change", function (e) {
     $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
     fromdate=moment(e.date);
     });
     $("#datetimepicker7").on("dp.change", function (e) {
     $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
     todate=moment(e.date);
     });


    $(document).on('click', '#submit-date', function (e) {
        e.preventDefault();
        path = [[]];
        distanceB = [];

        var info={fromDate:fromdate.format("YYYY-MM-DD HH:mm:ss"),
         toDate:todate.format("YYYY-MM-DD HH:mm:ss")}
        /*var info = {
            fromDate: "2017-05-08 11:01:56",
            toDate: "2017-05-08 11:17:46"
        }*/
        //console.log(new Date(Date.parse(fromdate)).toGMTString());

        sendDateToServer(info);
    });
});

function initMap() {
    var bhu = {lat: 25.2639186, lng: 82.9927001};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: bhu,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        //'roadmap', 'satellite', 'hybrid', 'terrain'
    });
    google.maps.event.addListener(map, "click", function (e) {
        //lat and lng is available in e object
        var latLng = e.latLng;
        alert(latLng);
    });
}
function roundFloat(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
function drawPath(i) {

    distanceB[i] = google.maps.geometry.spherical.computeLength(path[i]);
    console.log(distanceB[i]);

    var flightPath = new google.maps.Polyline({
        path: path[i],
        geodesic: true,
        strokeColor: '#5BAED5',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);
    var startMarker = new google.maps.Marker({
        position: path[i][0],
        map: map,
        title: 'Start Point',
        icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });
    var endMarker = new google.maps.Marker({
        position: path[i][path[i].length - 1],
        map: map,
        title: 'End Point'
    });

    var startWindow=new google.maps.InfoWindow({
       content: "Start Lat,Lng: "+path[i][0].toString()
    });
    startMarker.addListener('click',function () {
        startWindow.open(map,startMarker);
    });
    var km = 0;
    var meter = 0;
    if (distanceB > 1000) {
        km = Math.trunc(distanceB[i] / 1000);
    }
    meter = roundFloat(distanceB[i] % 1000, 3);
    contentString = "Distance Traveled: ";
    if (km != 0)
        contentString += km.toString() + " km, ";
    contentString += meter.toString() + " m";
    contentString += "<br/> LatLng: "+path[i][path[i].length - 1].toString();


    var endWindow = new google.maps.InfoWindow({
        content: contentString
    });
    endMarker.addListener('click',function () {
        endWindow.open(map, endMarker);
    });

}
function greaterThan5Minutes(date2, date1) {
    date1 = moment(date1);
    date2 = moment(date2);
    if (date2.year() - date1.year() > 0) {
        console.log('year');
        return true
    }
    else if (date2.month() - date1.month() > 0) {
        console.log('month');
        return true
    }
    else if (date2.date() - date1.date() > 0) {
        console.log('date');
        return true
    }
    else if (date2.hours() - date1.hours() > 0) {
        console.log('hours');
        return true
    }
    else if (date2.minutes() - date1.minutes() >= 5) {
        console.log('minutes');
        return true
    }

}
function sendDateToServer(info) {
    $.ajax({
        url: "http://127.0.0.1:8000/date",
        type: "POST",
        data: JSON.stringify(info),
        async: true,
        success: function (response) {
            console.log(JSON.stringify(response));
            responseCopy=response;
            var l = response.data.length;
            pathNum = 0;
            x=0;
            if (response.data.length >= 2) {
                date1 = response.data[x].dateTime;
                date2 = response.data[x+1].dateTime;
                path.push(new Array());
                path[pathNum].push(new google.maps.LatLng(response.data[x].latitude, response.data[x].longitude));
                path[pathNum].push(new google.maps.LatLng(response.data[x+1].latitude, response.data[x+1].longitude));
            }

            for (var i = x+2; i < response.data.length; i++) {
                date1 = date2;
                date2 = response.data[i].dateTime;
                if (greaterThan5Minutes(date2, date1)) {
                    pathNum++;
                    path.push(new Array());

                }
                var latLng = new google.maps.LatLng(response.data[i].latitude, response.data[i].longitude);
                path[pathNum].push(latLng);
            }


        },
        error: function (response, status, error) {
            console.log('response: ' + response + '\n status: ' + status + ' \nerr:' + error);
        },
        complete: function () {
            for (var i = 0; i < path.length-1; i++)
                drawPath(i);
        },
        progress: function () {
        },
        cache: false,
        contentType: 'application/json',
        processData: false
    })
};
