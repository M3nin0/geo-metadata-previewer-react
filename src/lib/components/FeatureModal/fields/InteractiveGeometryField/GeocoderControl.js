/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect } from 'react';

import L from 'leaflet';
import { useMap } from 'react-leaflet';

/**
 * Geocoder Search using Nominatim API.
 */
export const GeocoderControl = () => {
  const mapContext = useMap();

  useEffect(() => {
    let nominatimProvider = L.Control.Geocoder.nominatim();

    if (typeof URLSearchParams !== 'undefined') {
      const searchParams = new URLSearchParams();
      const geocoderSearchParams = searchParams.get('geocoder');

      if (geocoderSearchParams && L.Control.Geocoder[geocoderSearchParams]) {
        nominatimProvider = L.Control.Geocoder[geocoderSearchParams]();
      } else if (geocoderSearchParams) {
        console.warn('Unsupported geocoder', geocoderSearchParams);
      }
    }

    L.Control.geocoder({
      query: '',
      placeholder: '',
      defaultMarkGeocode: false,
      nominatimProvider,
    })
      .on('markgeocode', function (e) {
        const latlng = e.geocode.center;
        L.marker(latlng)
          .addTo(mapContext)
          .bindPopup(e.geocode.name)
          .openPopup();
        mapContext.fitBounds(e.geocode.bbox);
      })
      .addTo(mapContext);
  }, []);

  return <></>;
};
