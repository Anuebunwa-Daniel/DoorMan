// var api_key = "AIzaSyBKJ9QfsPzsdVG4L0cygz1ylqGmVuBrYtk"


const successCallback = (position) => {
  let latlng ={
    lat:position.coords.latitude, 
    lng:position.coords.longitude
  }
  console.log(position.coords.latitude)
  console.log(position.coords.longitude)

    console.log(position);
  };
  
  const errorCallback = (error) => {
    console.log(error);
  };
  
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


  function initMap(successCallback, errorCallback) {
    
    var options ={
         center: {lat:4.8338397, lng:7.0576921},
         zoom: 18,
         mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    //map
  map = new google.maps.Map(document.getElementById("map"),options) 


  //creating the marker
  const marker =new google.maps.Marker({
    position: {lat:4.8338397, lng:7.0576921},
    map:map,
    animation:google.maps.Animation.Drop,
    draggable:true,
    icon:"marker.png"
  });
  //infowindow
  const detailWindow = new google.maps.InfoWindow({
    content: "your current posistion"
  })
  marker.addListener("mouseover", ()=>{
    detailWindow.open(map,marker)
  })
//   var line = new google.maps.Polyline()

directionsService = new google.maps.DirectionsService();
var polylineOptionsActual = new google.maps.Polyline({
    strokeColor: 'black',
    strokeOpacity: 5,
    strokeWeight: 4
});
directionsDisplay = new google.maps.DirectionsRenderer({ polylineOptions: polylineOptionsActual });

directionsDisplay.setMap(map);
// directionsDisplay.setPanel(document.getElementById('panel'));

// let places={
//   types: ["cities"],
//   fields: ["address_components", "geometry", "icon", "name"],
//   componentRestrictions: { country: "nigeria" }
// }
// const input1 = document.getElementById('from')
// const autocomplete = new google.maps.places.Autocomplete(input, places);
// const input2 = document.getElementById('to')
// const autocomplete2 = new google.maps.places.Autocomplete(input2,places)


}




function get_location() {
  var start = document.getElementById("from").value;
  var end = document.getElementById('to').value;
  var request = {
      origin:start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL
  };
  
  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
      const dis = response.routes[0].legs[0].distance.value
      const amount = document.getElementById('amount');
      let price = dis/10;
      console.log(price);
      console.log(dis);
      console.log(response.routes[0].legs[0].distance.value);

      amount.innerHTML = "Amount : " + price + "&#8358"

      const origin = document.getElementById('origin')
      origin.innerHTML = "From: " + start
      console.log(start)
      
      const destination = document.getElementById('destination')
      destination.innerHTML = "Destination: " + end

      const distance = document.getElementById('distance')
      distance.innerHTML = "Distances: " +  response.routes[0].legs[0].distance.text
       
      }
  });

  
}















  // // origin=document.getElementById('from').value,
// //   console.log(origin)

// //   function calcRoute(){
// //       //creat a direction service object
// //   let  directionService = new google.maps.DirectionsService()

// //   //create a directions renderer object which is used to display the route
// //   let directionsDisplay = new google.maps.DirectionsRenderer();
// //   //binding the directions rendere to th map

// //   directionsDisplay.setMap(map);
// //   origin=document.getElementById('from').value,
// //   console.log(origin)
// //     let request ={
// //         destination: document.getElementById('to').value,
// //         travelMode: google.maps.travelMode.DRIVING,
// //         unitSystem: google.maps.UnitSystem.IMPERIAL
// //     }

// //     //pass the request to the route method
// //     directionsService.route(request,(request,status)=>{
// //         if (status == google.maps.DirectionsService.OK){

// //             //get distance and time
// //             const output = document.querySelector('output')
// //             output.innerHTML = "from:" + document.getElementById('from').value <br> "To:" + document.getElementById('to').value <br> "driving distance:<i class='fas fa-road'></i>" + result.routes[0].legs[0].distance.text <br> "durations <i class='fas fa-road'>" + result.routes[0].legs[0].distance.duration.text;

// //             //display the route
// //             directionsDisplay.setDirections(result)

// //         }else{
// //             //direct route fro map
// //             directionsDisplay.setDirections({routes:[]})
            
// //             //center map again
// //             map.setCenter(latlng);

// //             //show error masg
// //             output.innerHTML= "could not retrive driving distance"

// //         }
       
// //     });

// //     let options={
// //         types: ["cities"],
// //         fields: ["address_components", "geometry", "icon", "name"],
// //         componentRestrictions: { country: "nigeria" }
// //     }
// //     const input1 = document.getElementById('from')
// //     const autocomplete = new google.maps.places.Autocomplete(input, options);
// //     const input2 = document.getElementById('to')
// //     const autocomplete2 = new google.maps.places.Autocomplete(input2,options)
// //   }
// // //   create auto complete for all input






