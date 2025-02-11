import { useEffect, useState } from 'react';
import React from 'react';
import { useDispatch } from 'react-redux';
export const MapWrapper = React.memo(() => {
    const dispatch=useDispatch()

  return <div id='map-container' style={{ width: '100%', height: '100%' }}></div>;
}, () => true);

export const GisMap = ({ onMarkerPositionChange }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  useEffect(() => {
    var DG = require('2gis-maps');
    var map = null;

    // Function to initialize the map if it's not already initialized
    const initializeMap = () => {
      if (!map) {
        map = DG.map('map', {
          center: [43.238566, 76.899828],
          zoom: 16,
        });

        var markersLayer = DG.featureGroup().addTo(map);

        map.on('click', function (e) {
          const latlng = e.latlng;
          setMarkerPosition(latlng);
          
          console.log('MARKER POSITION=',latlng)
          const newMarkerPosition = { lat: latlng.lat, lng: latlng.lng };
          onMarkerPositionChange(newMarkerPosition);

          var marker = DG.marker(latlng).addTo(markersLayer);
          marker.bindPopup('This is the clicked location').openPopup();
        });
      }
    };

    initializeMap();

  

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <div>
      {markerPosition ? (
        <>
          <div id="map" style={{ width: '100%', height: '400px','pointerEvents': 'none' }}></div>
          <div>
            <h3>Marker Position:</h3>
            <p>Latitude: {markerPosition.lat.toFixed(6)}</p>
            <p>Longitude: {markerPosition.lng.toFixed(6)}</p>
          </div>
        </>
      ) : (
        <div id="map" style={{ width: '100%', height: '400px' }} ></div>
      )}
    </div>
  );
};
