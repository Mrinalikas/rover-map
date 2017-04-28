

function initMap(path) {
    console.log(JSON.stringify(path));
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 30,
        center: {lat: 25.2632708, lng: 82.9932026},
        mapTypeId: 'terrain'
    });


    var flightPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
}
