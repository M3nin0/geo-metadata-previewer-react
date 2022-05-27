/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Global } from '@emotion/react';

import { LocationField as LocationFieldComponent } from './LocationField';
import { FieldLabel } from 'react-invenio-forms';
import { Formik } from 'formik';

export default {
  title: 'Forms/Geospatial/Location Field',
  component: LocationFieldComponent,
};

/**
 * Component template
 */
const Template = (args) => {
  return (
    <Formik initialValues={{ location: [] }}>
      <>
        {/* How can I handle this "leaflet-container" inside the library ? */}
        <Global
          styles={{
            '.leaflet-container': {
              height: '50vh',
            },
          }}
        />
        <LocationFieldComponent {...args} />
      </>
    </Formik>
  );
};

/**
 * Component stories
 */
export const LocationField = Template.bind({});
LocationField.args = {
  fieldPath: 'location',
  label: 'Location',
  labelIcon: 'map marker alternate',
  modal: {
    addLabel: 'Add location',
    editLabel: 'Edit location',
  },
  addButtonLabel: 'Add location',
  geometryViewerConfig: {
    mapContainerProps: {
      center: [42.09618442380296, -71.5045166015625],
      zoom: 2,
      zoomControl: true,
    },
    label: (
      <FieldLabel htmlFor={'geometry'} icon={'map marker'} label={'Geometry'} />
    ),
  },
};
