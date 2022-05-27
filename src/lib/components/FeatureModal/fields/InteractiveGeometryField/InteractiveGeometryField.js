/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useRef, isValidElement } from 'react';

import L from 'leaflet';

import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  LayersControl,
} from 'react-leaflet';

import { EditControl } from 'react-leaflet-draw';

import { Form } from 'semantic-ui-react';

import { FieldArray, useFormikContext } from 'formik';
import { GeocoderControl } from './GeocoderControl';

/**
 * Transform an Layer object into a GeoJSON object.
 */
const layerToGeoJSON = (layer) => ({
  id: layer._leaflet_id,
  ...layer.toGeoJSON(),
});

/**
 * ToDo
 */
const InteractiveGeometryForm = ({
  formikProps,
  mapContainerProps,
  required,
  error,
  className,
  label,
}) => {
  const formikContext = useRef({});
  const { values: formikContextValue } = useFormikContext();

  formikContext.current = formikContextValue;

  return (
    <Form.Field
      id={formikProps.name}
      required={required}
      error={error}
      className={className}
    >
      {isValidElement(label) ? (
        label
      ) : (
        <label htmlFor={formikProps.name}>{label}</label>
      )}

      <MapContainer {...mapContainerProps}>
        <LayersControl>
          {/* ToDo: Allow the definition of multiple layers... */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
              attribution={
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }
              maxNativeZoom={19}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Esri World Imagery">
            <TileLayer
              url={
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              }
              attribution={
                'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              }
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <GeocoderControl />

        <FeatureGroup>
          <EditControl
            position="topleft"
            onCreated={(event) => {
              const layer = event.layer;
              formikProps.push(layerToGeoJSON(layer));
            }}
            onEdited={(event) => {
              const layers = event.layers;

              layers.eachLayer((layer) => {
                const layerGeoJSON = layerToGeoJSON(layer);

                formikContext.current.geometries.map((storedLayer, index) => {
                  if (storedLayer.id === layerGeoJSON.id) {
                    formikProps.replace(index, layerGeoJSON);
                  }
                });
              });
            }}
            onDeleted={(event) => {
              const layers = event.layers;

              layers.eachLayer((layer) => {
                const layerGeoJSON = layerToGeoJSON(layer);

                formikContext.current.geometries.map((storedLayer, index) => {
                  if (storedLayer.id === layerGeoJSON.id) {
                    formikProps.remove(index);
                  }
                });
              });
            }}
            draw={{
              circle: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </Form.Field>
  );
};

export const InteractiveGeometryField = ({
  fieldPath,
  ...geometryFieldProps
}) => (
  <FieldArray
    name={fieldPath}
    render={(formikProps) => (
      <InteractiveGeometryForm
        formikProps={formikProps}
        {...geometryFieldProps}
      />
    )}
  />
);
