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

  var marker2 = L.marker([0, 0], { icon: personIcon }).addTo(map);

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
  function updateMarker2(lat, lng) {
    marker2.setLatLng([lat, lng]);
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

  var vamCoords2 = []; // Initialize an empty array to store the vamCoords
  // Function to request the vam_coords from the server
  function requestVamCoords2() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/get_vam_coords2', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        //console.log(response); // Print the response to the console
        vamCoords2 = response;
        console.log(vamCoords2);

        if (vamCoords2.length > 0) {
          animateMarker2();
        }
      }
    };
    xhr.send();
  }

  // Add event listener to the delete button
  const deleteButton = document.getElementById('deleteButton');
  deleteButton.addEventListener('click', () => {
    const responseElement = document.getElementById('response');
    responseElement.style.display = 'none';
  });


  var person1_inside  = 0
  var person1_inside2 = 0
  var person2_inside  = 0
  var person2_inside2 = 0
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
      if (circle.getBounds().contains(personLatLng) || person2_inside==1) {
        if(circle.getBounds().contains(personLatLng))
        {
          person1_inside=1;
        }
        else{
          person1_inside=0;
        }
        fetch('http://localhost:8080/ipfs/Qme6vrVn9NKk2SaUTMqtNxi5oLZ5zPYANq4EpJ6Kiq6hDu')
        .then(response => response.json())
        .then(data => {
          response.style.display = 'block';
          //data = JSON.parse(data);
          console.log(data);
          //console.log(data);
          // Restaurant Details
          document.getElementById('restaurant').innerText = data.restaurant;
          document.getElementById('id').innerText = data.id;
      
          
          // Menu
          const menuList = document.getElementById('menu');
          data.menu.forEach(item => {
            // Check if item already exists in the list
            const existingItem = menuList.querySelector(`[data-name="${item.name}"]`);
            if (!existingItem) {
              const li = document.createElement('li');
              li.innerHTML = `<span>Name:</span> ${item.name}, <span>Price:</span> ${item.price}, <span>Description:</span> ${item.description}`;
              li.setAttribute('data-name', item.name); // Add a data attribute to identify the item
              menuList.appendChild(li);
            }
          });
      
          // Available Tables
          const tablesList = document.getElementById('available_tables');
          data.available_tables.forEach(table => {
            // Check if table already exists in the list
            const existingTable = tablesList.querySelector(`[data-id="${table.id}"]`);
            if (!existingTable) {
              const li = document.createElement('li');
              li.innerHTML = `<span>ID:</span> ${table.id}, <span>Seats:</span> ${table.seats}`;
              li.setAttribute('data-id', table.id); // Add a data attribute to identify the table
              tablesList.appendChild(li);
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error here
        });      
        circle.setStyle({ color: 'green', fillColor: 'green' });
      } else {
        person1_inside=0;
        //document.getElementById('response').innerText = "";
        circle.setStyle({ color: 'red', fillColor: 'red' });
      }

      // inside circle rsu2
      if (circle2.getBounds().contains(personLatLng) || person2_inside2==1) {
        if(circle2.getBounds().contains(personLatLng))
        {
          person1_inside2 = 1;
        }
        else{
          person1_inside2 = 0;
        }
        fetch('http://localhost:8080/ipfs/QmfSwY59NkktLzz3eBVZAicJQNYPVPHHKkP8ZVvg9a6kL6')
        .then(response => response.json())
        .then(data => {
          response.style.display = 'block';
          //data = JSON.parse(data);
          console.log(data);
          //console.log(data);
          // Restaurant Details
          document.getElementById('restaurant').innerText = data.restaurant;
          document.getElementById('id').innerText = data.id;
      
          
          // Menu
          const menuList = document.getElementById('menu');
          data.menu.forEach(item => {
            // Check if item already exists in the list
            const existingItem = menuList.querySelector(`[data-name="${item.name}"]`);
            if (!existingItem) {
              const li = document.createElement('li');
              li.innerHTML = `<span>Name:</span> ${item.name}, <span>Price:</span> ${item.price}, <span>Description:</span> ${item.description}`;
              li.setAttribute('data-name', item.name); // Add a data attribute to identify the item
              menuList.appendChild(li);
            }
          });
      
          // Available Tables
          const tablesList = document.getElementById('available_tables');
          data.available_tables.forEach(table => {
            // Check if table already exists in the list
            const existingTable = tablesList.querySelector(`[data-id="${table.id}"]`);
            if (!existingTable) {
              const li = document.createElement('li');
              li.innerHTML = `<span>ID:</span> ${table.id}, <span>Seats:</span> ${table.seats}`;
              li.setAttribute('data-id', table.id); // Add a data attribute to identify the table
              tablesList.appendChild(li);
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error here
        });  
        circle2.setStyle({ color: 'green', fillColor: 'green' });
      } else {
        circle2.setStyle({ color: 'red', fillColor: 'red' });
      }

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

  // Function to animate the marker along the given coordinates
  function animateMarker2() {
    var index = 0;

    function updatePosition() {
      var coord = vamCoords2[index];
      var lat = coord.latitude;
      var lng = coord.longitude;
      updateMarker2(lat, lng);

      // Check if the person icon is inside the circle rsu1
      var personLatLng = marker2.getLatLng();
      if (circle.getBounds().contains(personLatLng) || person1_inside==1) {
        if(circle.getBounds().contains(personLatLng))
        {
          person2_inside = 1;
        }
        else{
          person2_inside = 0;
        }
        fetch('http://localhost:8080/ipfs/Qme6vrVn9NKk2SaUTMqtNxi5oLZ5zPYANq4EpJ6Kiq6hDu')
        .then(response => response.json())
        .then(data => {
          response.style.display = 'block';
          //data = JSON.parse(data);
          console.log(data);
          //console.log(data);
          // Restaurant Details
          document.getElementById('restaurant2').innerText = data.restaurant;
          document.getElementById('id2').innerText = data.id;
      
          
          // Menu
          const menuList = document.getElementById('menu2');
          data.menu.forEach(item => {
            // Check if item already exists in the list
            const existingItem = menuList.querySelector(`[data-name="${item.name}"]`);
            if (!existingItem) {
              const li = document.createElement('li');
              li.innerHTML = `<span>Name:</span> ${item.name}, <span>Price:</span> ${item.price}, <span>Description:</span> ${item.description}`;
              li.setAttribute('data-name', item.name); // Add a data attribute to identify the item
              menuList.appendChild(li);
            }
          });
      
          // Available Tables
          const tablesList = document.getElementById('available_tables2');
          data.available_tables.forEach(table => {
            // Check if table already exists in the list
            const existingTable = tablesList.querySelector(`[data-id="${table.id}"]`);
            if (!existingTable) {
              const li = document.createElement('li');
              li.innerHTML = `<span>ID:</span> ${table.id}, <span>Seats:</span> ${table.seats}`;
              li.setAttribute('data-id', table.id); // Add a data attribute to identify the table
              tablesList.appendChild(li);
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error here
        });      
        circle.setStyle({ color: 'green', fillColor: 'green' });
      } else {
        person2_inside = 0;
        //document.getElementById('response').innerText = "";
        circle.setStyle({ color: 'red', fillColor: 'red' });
      }

      // inside circle rsu2
      if (circle2.getBounds().contains(personLatLng) || person1_inside2 ==1) {
        if(circle2.getBounds().contains(personLatLng))
        {
          person2_inside2 = 1;
        }
        else{
          person2_inside2 = 0;
        }
        fetch('http://localhost:8080/ipfs/QmfSwY59NkktLzz3eBVZAicJQNYPVPHHKkP8ZVvg9a6kL6')
        .then(response => response.json())
        .then(data => {
          response.style.display = 'block';
          //data = JSON.parse(data);
          console.log(data);
          //console.log(data);
          // Restaurant Details
          document.getElementById('restaurant2').innerText = data.restaurant;
          document.getElementById('id2').innerText = data.id;
      
          
          // Menu
          const menuList = document.getElementById('menu2');
          data.menu.forEach(item => {
            // Check if item already exists in the list
            const existingItem = menuList.querySelector(`[data-name="${item.name}"]`);
            if (!existingItem) {
              const li = document.createElement('li');
              li.innerHTML = `<span>Name:</span> ${item.name}, <span>Price:</span> ${item.price}, <span>Description:</span> ${item.description}`;
              li.setAttribute('data-name', item.name); // Add a data attribute to identify the item
              menuList.appendChild(li);
            }
          });
      
          // Available Tables
          const tablesList = document.getElementById('available_tables2');
          data.available_tables.forEach(table => {
            // Check if table already exists in the list
            const existingTable = tablesList.querySelector(`[data-id="${table.id}"]`);
            if (!existingTable) {
              const li = document.createElement('li');
              li.innerHTML = `<span>ID:</span> ${table.id}, <span>Seats:</span> ${table.seats}`;
              li.setAttribute('data-id', table.id); // Add a data attribute to identify the table
              tablesList.appendChild(li);
            }
          });
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle the error here
        });     
        circle2.setStyle({ color: 'green', fillColor: 'green' });
      } else {
        person2_inside2 = 0;
        circle2.setStyle({ color: 'red', fillColor: 'red' });
      }

      index = (index + 1) % vamCoords2.length;

      if (index === 0) {
        // Restart the animation after a delay (adjust the delay as needed)
        setTimeout(animateMarker2, 1000); // Delay in milliseconds (2 seconds-2000)
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
  setInterval(requestVamCoords2, 3000);
});
