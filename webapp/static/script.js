document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    var map = L.map("map").setView([40.642887841187765, -8.656163472597399], 30); // Default center and zoom level
  
    // Add the tile layer (map tiles)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);
  
    // Define the marker
    var personIcon = L.icon({
        iconUrl: '/static/person-walking.png',
        iconSize: [32, 32], // Adjust the icon size as needed
      });
      
      var marker = L.marker([0, 0], { icon: personIcon }).addTo(map);
      
  
    // Function to update the marker position
    function updateMarker(lat, lng) {
      marker.setLatLng([lat, lng]);
    }
  
    // Example coordinates
    var coordinates = [
      [40.64298146111145, -8.656243938860625], // gran turino
      [40.642887841187765, -8.656163472597399],
      [40.64287970031862, -8.656007904488495],
      [40.642932615950244, -8.655814785456753],
      [40.64279829157265, -8.65568603943559], // cais do pescado
      [40.64263140333302, -8.655702132688235], // O bairro
      [40.64252557155021, -8.655986446818302],
      [40.642668037372594, -8.656034726576237],
    ];
  
    // Function to animate the marker along the given coordinates
    function animateMarker() {
      var index = 0;
      setInterval(function () {
        var coord = coordinates[index];
        updateMarker(coord[0], coord[1]);
        index = (index + 1) % coordinates.length;
      }, 2000); // Update every 2 seconds
    }
  
    // Start animating the marker
    animateMarker();
  });
  