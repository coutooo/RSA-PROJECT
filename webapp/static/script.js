document.addEventListener("DOMContentLoaded", function () {
  // Initialize the map
  var map = L.map("map").setView([40.64286, -8.65595], 18); // Default center and zoom level

  // Add the tile layer (map tiles)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 20,
  }).addTo(map);

  // Define the marker
  var personIcon = L.icon({
    iconUrl: '/static/person-walking.png',
    iconSize: [24, 24], // Adjust the icon size as needed
  });

  var marker = L.marker([0, 0], { icon: personIcon }).addTo(map);

  // Define the marker
  var rsuIcon = L.icon({
    iconUrl: '/static/rsu.png',
    iconSize: [16, 16], // Adjust the icon size as needed
  });

  var markerRSU = L.marker([40.6429, -8.65608], { icon: rsuIcon }).addTo(map);

  // Define the marker rsu2
  var markerRSU2 = L.marker([40.64255, -8.65568], { icon: rsuIcon }).addTo(map);

  // rsu coordinates
  var coordinates = [
    [40.6429, -8.65608],
    [40.64255, -8.65568]
  ];

  // Calculate the radius in meters
  var radius = L.CRS.Earth.distance(
    map.containerPointToLatLng([0, 0]),
    map.containerPointToLatLng([50, 0])
  );

  // Define the circle
  var circle = L.circle(coordinates[0], {
    radius: radius, // Adjust the radius of the circle as needed
    color: 'red', // Circle color
    fillColor: 'red', // Fill color
    fillOpacity: 0.2 // Opacity of the fill color
  }).addTo(map);

  // Define the circle
  var circle2 = L.circle(coordinates[1], {
    radius: radius, // Adjust the radius of the circle as needed
    color: 'red', // Circle color
    fillColor: 'red', // Fill color
    fillOpacity: 0.2 // Opacity of the fill color
  }).addTo(map);

  // Function to update the marker position
  function updateMarker(lat, lng) {
    marker.setLatLng([lat, lng]);
  }

  var vamCoords = []; // Initialize an empty array to store the vamCoords
  // Function to request the vam_coords from the server
  function requestVamCoords() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/get_vam_coords', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        //console.log(response); // Print the response to the console
        vamCoords = response;
        console.log(vamCoords);

        if (vamCoords.length > 0) {
          animateMarker();
        }
      }
    };
    xhr.send();
  }

  // Function to animate the marker along the given coordinates
  function animateMarker() {
    var index = 0;

    function updatePosition() {
      var coord = vamCoords[index];
      var lat = coord.latitude;
      var lng = coord.longitude;
      updateMarker(lat, lng);

      // Check if the person icon is inside the circle rsu1
      var personLatLng = marker.getLatLng();
      if (circle.getBounds().contains(personLatLng)) {
        circle.setStyle({ color: 'green', fillColor: 'green' });
      } else {
        circle.setStyle({ color: 'red', fillColor: 'red' });
      }

      // inside circle rsu2
      /*if (circle2.getBounds().contains(personLatLng)) {
        circle2.setStyle({ color: 'green', fillColor: 'green' });
      } else {
        circle2.setStyle({ color: 'red', fillColor: 'red' });
      }*/

      index = (index + 1) % vamCoords.length;

      if (index === 0) {
        // Restart the animation after a delay (adjust the delay as needed)
        setTimeout(animateMarker, 1000); // Delay in milliseconds (2 seconds-2000)
      } else {
        // Schedule the next position update without a delay
        updatePosition();
      }
    }

    // Start the animation
    updatePosition();
  }

  // Request vam_coords from the server every 5 seconds -> 5000
  setInterval(requestVamCoords, 3000);
});
