mapboxgl.accessToken = mpxToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: campground.geometry.coordinates, 
  zoom: 7, 
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({offset: 25})
        .setHTML(
          `<h4>${campground.title}</h4><p>${campground.location}</P>`
        )
    )
    .addTo(map)