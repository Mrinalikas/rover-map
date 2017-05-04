

function initMap(path) {
    console.log(JSON.stringify(path));
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: {lat: path[0].lat, lng: path[0].lng},
        mapTypeId: 'roadmap'
        //'roadmap', 'satellite', 'hybrid', 'terrain'
    });

    var flightPath = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#5BAED5',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
}
