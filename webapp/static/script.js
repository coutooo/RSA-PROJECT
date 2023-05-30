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
  
    // Example coordinates
    /*var coordinates = [
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
    */
    // Request vam_coords from the server every 5 seconds -> 5000
    setInterval(requestVamCoords, 3000);
  });
  