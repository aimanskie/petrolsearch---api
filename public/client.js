const breakdownByOwner = document.querySelector('.breakdown-table')
const latitudeInput = document.querySelector('.latitude')
const longtitudeInput = document.querySelector('.longtitude')
const currentAddress = document.querySelector('.current-address')
const spotlightName = document.querySelector('.spotlight-name')
const spotlightOwner = document.querySelector('.spotlight-owner')
const refresh = document.querySelector('.refresh-btn')
const nearestFive = document.querySelector('.near')
const mapDiv = document.getElementById('map')
const clickBtn = document.querySelector('.click-map')
const currentBtn = document.querySelector('.current-location')
const inputLatLng = document.querySelector('form')

axios.get('/api/stats').then((res) => {
  const { totalByOwner } = res.data
  breakdownByOwner.innerHTML += Render.breakdown(totalByOwner)
})

axios.get('/api/stations/random').then((res) => {
  Render.randomStation(res)
})

refresh.addEventListener('click', (event) => {
  event.preventDefault()
  axios.get('/api/stations/random').then((res) => {
    Render.randomStation(res)
  })
})

let obj = {}
function enterWith(event) {
  if (event.keyCode == 13) {
    obj.latitude = event.target.value
    console.log(obj)
  }

  if (obj.latitude !== '' && obj.longtitude !== '') {
    Render.currentAddress(obj.latitude, obj.longtitude)
    Render.nearestStations(obj.latitude, obj.longtitude)
  }
}

function enterWith1(event) {
  if (event.keyCode == 13) {
    obj.longtitude = event.target.value
    console.log(obj)
  }

  if (obj.latitude !== '' && obj.longtitude !== '') {
    Render.currentAddress(obj.latitude, obj.longtitude)
    Render.nearestStations(obj.latitude, obj.longtitude)
  }
}

window.initMap = () => {
  map = new google.maps.Map(mapDiv, {
    center: { lat: -37.8136, lng: 144.9631 },
    minZoom: 11,
    zoom: 13,
    mapId: '6e1e6e3760128692',
  })

  spotlightName.addEventListener('click', (event) => {
    event.preventDefault()
    const { latitude, longtitude } = event.target.dataset
    map.panTo({ lat: +latitude, lng: +longtitude })

    const infoWindowOptions = {
      content: `${spotlightName.textContent}<br>
      ${spotlightOwner.textContent}`,
      position: { lat: +latitude, lng: +longtitude },
    }
    const infoWindow = new google.maps.InfoWindow(infoWindowOptions)
    const infoWindowOpenOptions = {
      map,
    }
    infoWindow.open(infoWindowOpenOptions)
    setTimeout(() => {
      infoWindow.close()
    }, 3000)
    MapMarkers.populate(+latitude, +longtitude, map)
    Render.currentAddress(latitude, longtitude)
    Render.currentLocation(latitude, longtitude)
    Render.nearestStations(latitude, longtitude)
  })

  nearestFive.addEventListener('click', (event) => {
    event.preventDefault()
    console.log(event.target.dataset)
    const { latitude, longtitude, name, owner } = event.target.dataset
    map.panTo({ lat: +latitude, lng: +longtitude })

    const infoWindowOptions = {
      content: `${name}<br>
      ${owner}`,
      position: { lat: +latitude, lng: +longtitude },
    }
    const infoWindow = new google.maps.InfoWindow(infoWindowOptions)
    const infoWindowOpenOptions = {
      map,
    }
    infoWindow.open(infoWindowOpenOptions)
    setTimeout(() => {
      infoWindow.close()
    }, 3000)
  })

  map.addListener('dragend', () => {
    const { lat, lng } = map.getCenter()
    MapMarkers.removeAll(map)
    MapMarkers.populate(lat(), lng(), map)
  })

  currentCoordinates()

  function currentCoordinates() {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords
      map.panTo({ lat: latitude, lng: longitude })
      let marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        icon: './img/icons8-body-type-short-100.png',
        map,
      })
      const infoWindowOptions = {
        content: 'You are here!!',
        position: { lat: latitude, lng: longitude },
      }
      const infoWindow = new google.maps.InfoWindow(infoWindowOptions)
      const infoWindowOpenOptions = {
        map,
        anchor: marker,
      }
      infoWindow.open(infoWindowOpenOptions)
      setTimeout(() => {
        infoWindow.close()
        // marker.setMap(null);
      }, 5000)
      Render.currentLocation(latitude, longitude)
      MapMarkers.populate(latitude, longitude, map)
      Render.currentAddress(latitude, longitude)
      Render.nearestStations(latitude, longitude)
    })
  }

  currentBtn.addEventListener('click', currentCoordinates)

  clickBtn.addEventListener('click', () => {
    map.addListener('click', (mapsMouseEvent) => {
      let coordinates = mapsMouseEvent.latLng
      let lat = coordinates.lat()
      let lng = coordinates.lng()
      let marker = new google.maps.Marker({
        position: coordinates,
        map,
        animation: google.maps.Animation.DROP,
      })
      setTimeout(() => {
        marker.setMap(null)
        marker = null
      }, 2000)
      // })
      Render.currentLocation(lat, lng)
      Render.currentAddress(lat, lng)
      Render.nearestStations(lat, lng)
    })
  })
}