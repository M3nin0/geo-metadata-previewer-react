/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { Global } from '@emotion/react';
import { Button, Icon } from 'semantic-ui-react';
import { FeatureModal as FeatureModalComponent } from './FeatureModal';
import { FieldLabel } from 'react-invenio-forms';

export default {
  title: 'Forms/Geospatial/Location Form (in-Modal)',
  component: FeatureModalComponent,
};

/**
 * Component template
 */
const Template = (args) => {
  return (
    <>
      <Global
        styles={{
          '.leaflet-container': {
            height: '50vh',
          },
        }}
      />
      <FeatureModalComponent {...args} />
    </>
  );
};

/**
 * Component stories
 */
export const FeatureModal = Template.bind({});
FeatureModal.args = {
  action: 'add',
  onFeatureChange: (changedFeature) => {
    console.log('Feature changed!');
    console.log(changedFeature);
  },
  addLabel: 'Add location',
  editLabel: 'Edit location',
  initialFeature: {},
  trigger: (
    <Button type="button" icon labelPosition="left">
      <Icon name="add" /> Add location
    </Button>
  ),
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
