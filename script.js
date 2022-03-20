var map = L.map('map').setView([51.0450, -114.0732], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const geojsonFeature = {

}



var layerGroup = L.geoJSON(geojsonFeature, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup('<h3>Issued Date:' + feature.properties.issueddate + '</h3><p>Work Class Group: ' + feature.properties.workclassgroup + '</p><p>Contractor Name:' + feature.properties.contractorname + '</p><p>Community Name:' + feature.properties.communityname + '</p><p>Original Address:' + feature.properties.originaladdress + '</p>');
  }
});


var markers = L.layerGroup();

var oms = new OverlappingMarkerSpiderfier(map);

var points = L.geoJSON(geojsonFeature, {
  pointToLayer: function (feature, latlng) {
    return new L.Marker(latlng);
  },
  onEachFeature: function (feature, latlng) {
    markers.addLayer(latlng), oms.addMarker(latlng)
  }
});


L.markerClusterGroup.layerSupport().addTo(map).checkIn(markers)

var popup = new L.Popup();

oms.addListener('click', function(marker) {
    popup.setContent('<h3>Issued Date:'+marker.feature.properties.issueddate+'</h3><p>Work Class Group: ' + marker.feature.properties.workclassgroup + '</p><p>Contractor Name:' + marker.feature.properties.contractorname + '</p><p>Community Name:' + marker.feature.properties.communityname + '</p><p>Original Address:' + marker.feature.properties.originaladdress + '</p>');
    popup.setLatLng(marker.getLatLng());
    map.openPopup(popup);
});


var sliderControl = L.control.sliderControl({
  position: "topright",
  layer: markers,
  range: true
});


map.addControl(sliderControl);
sliderControl.startSlider();