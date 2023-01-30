class MapMarkers {
  static markers = []
  static activeInfoWindow

  static removeAll(map) {
    const bounds = new google.maps.LatLngBounds(map.getBounds())
    this.markers = this.markers.filter((marker) => {
      if (!bounds.contains(marker.position)) {
        marker.setMap(null)
      } else {
        return true
      }
    })
  }

  static populate(latitude, longitude, map) {
    axios.get(`/api/stations/nearest?lat=${latitude}&lng=${longitude}&radius=30`).then(({ data: nearestToCurrent }) => {
      const existingMarkers = this.markers.map(({ position: { lat, lng } }) => `${lat()},${lng()}`)
      nearestToCurrent.forEach(({ latitude, longtitude, name, owner }) => {
        const stationPosition = `${latitude},${longtitude}`
        if (!existingMarkers.includes(stationPosition)) {
          const marker = new google.maps.Marker({
            position: {
              lat: Number(latitude),
              lng: Number(longtitude),
            },
            map,
            title: name,
            icon: this.getImgPath(owner),
          })
          const infoWindow = new google.maps.InfoWindow()
          marker.addListener('click', () => {
            infoWindow.close()
            if (this.activeInfoWindow != null) this.activeInfoWindow.close()
            infoWindow.open(marker.getMap(), marker)
            infoWindow.setContent(`<h6>${name}</h6><p>${owner}</p><p>lat : ${latitude}</p><p>lng : ${longtitude}</p>`)
            this.activeInfoWindow = infoWindow
          })
          this.markers.push(marker)
        }
      })
      const clusterOptions = {
        maxZoom: 13,
        minimumClusterSize: 2,
        gridSize: 200,
        imagePath: 'images/d',
        zoomOnClick: true,
      }

      const markerClusterer = new MarkerClusterer(map, this.markers, clusterOptions)

      const styles = markerClusterer.getStyles()
      for (let i = 0; i < styles.length; i++) {
        styles[i].textColor = 'black'
        styles[i].textSize = 15
      }
    })
  }

  static getImgPath(name) {
    const img = {
      Shell: './img/shellv.png',
      Caltex: './img/caltexv.png',
      '7-Eleven Pty Ltd': './img/7evect.png',
      BP: './img/BPv.png',
      United: './img/Unitedvec.png',
    }
    return img[name] || './img/Others.png'
  }

  static getColor(name) {
    const color = {
      Shell: '#E6F39B',
      Caltex: '#FA5D5D',
      '7-Eleven Pty Ltd': '#81FBA3',
      BP: '#70D072',
      United: '#457DF0',
    }
    return color[name] || '#FCD1F5'
  }
}
