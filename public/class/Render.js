class Render {
  static breakdown(tallies) {
    return tallies
      .map(
        (tally) =>
          `<tr>
              <td>${tally.owner}</td>
              <td class="tally-total">${tally.total}</td>
           </tr>
          `
      )
      .join('')
  }

  static nearestStations(latitude, longitude) {
    axios.get(`/api/stations/nearest?lat=${latitude}&lng=${longitude}&radius=5`).then(({ data: nearestToCurrent }) => {
      const output = nearestToCurrent
        .slice(0, 5)
        .map(
          (station) =>
            `<div class ="render-station-container near-btn" style=background-color:${MapMarkers.getColor(
              station.owner
            )} data-latitude=${station.latitude} data-longtitude=${station.longtitude} data-name="${
              station.name
            }" data-owner="${station.owner}">
              <div class ="render-station" style>
                <img src=${MapMarkers.getImgPath(station.owner)}>
              </div>
              <div class ="render-station">
                <p class ="render-station"><strong>${station.name}</strong></p>   
                <p class ="render-station">${station.address}${station.suburb}</p>
                <p class ="render-station">${Math.round(station.distance * 100) / 100}KM</p>
              </div>
            </div>
            `
        )
        .join('')
      nearestFive.innerHTML = output
      if (nearestFive.innerHTML === '') {
        nearestFive.innerHTML = `<h5 style='text-align: center'>There are no petrol stations nearby!</h5>`
      }
    })
  }

  static randomStation(station) {
    const { name, owner, latitude, longtitude } = station.data
    spotlightName.dataset.latitude = latitude
    spotlightName.dataset.longtitude = longtitude
    spotlightName.textContent = name
    spotlightOwner.textContent = owner
  }

  static currentAddress(latitude, longitude) {
    return axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyADoWRWSMHfLNZHvSX406kXVEk8_MFx2pQ`
      )
      .then(({ data }) => {
        const { formatted_address } = data.results[0]
        currentAddress.textContent = formatted_address
        return formatted_address
      })
  }

  static currentLocation(latitude, longitude) {
    latitudeInput.value = latitude
    longtitudeInput.value = longitude
  }

  static currentCoordinates(map) {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords
      map.panTo({ lat: latitude, lng: longitude })
      Render.currentLocation(latitude, longitude)
      MapMarkers.populate(latitude, longitude, map)
      Render.currentAddress(latitude, longitude)
      Render.nearestStations(latitude, longitude)
    })
  }
}
