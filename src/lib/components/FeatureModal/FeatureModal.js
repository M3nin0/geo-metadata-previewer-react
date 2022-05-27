/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect, useState } from 'react';

import _get from 'lodash/get';
import _map from 'lodash/map';
import _uniq from 'lodash/uniq';

import { Formik } from 'formik';
import { Form, Grid, Modal, Header } from 'semantic-ui-react';

import {
  PlaceField,
  DescriptionField,
  InteractiveGeometryField,
} from './fields';

import { ActionButton } from 'react-invenio-forms';

const ModalActions = {
  ADD: 'add',
  EDIT: 'edit',
};

const createFeature = (data) => {
  // serializing the features
  let geometryObject = {};
  const features = _get(data, 'features', []);

  if (features.length !== 0) {
    delete data.features;

    // unique geometry type
    if (features.length == 1) {
      geometryObject = features[0].geometry;
    } else {
      // multiple geometry types
      const geometryTypes = _uniq(_map(features, 'geometry.type'));

      if (geometryTypes.length == 1) {
        // multi geometries from the same type
        const geometryObjectType = geometryTypes[0];

        geometryObject = {
          type: `Multi${geometryObjectType}`,
          coordinates: _map(features, 'geometry.coordinates'),
        };
      } else {
        // multiple geometries from different type
        geometryObject = {
          type: 'GeometryCollection',
          geometries: _map(features, 'geometry'),
        };
      }
    }
  }

  return {
    fields: {
      ...data,
      geometry: geometryObject,
    },
  };
};

const deserializeFeature = (initialFeature) => {
  return {
    place: _get(initialFeature, 'place', ''),
    description: _get(initialFeature, 'description', ''),
    geometry: _get(initialFeature, 'geometry', []),
  };
};

/**
 * ToDo: Is the name 'Feature' good for this component ?
 */
export const FeatureModal = ({
  action,
  onFeatureChange,
  trigger,
  addLabel,
  editLabel,
  initialFeature,
  geometryViewerConfig,
}) => {
  const [modalState, setModalState] = useState({
    open: false,
    action: null,
    formikState: null,
  });
  const [addedMessageState, setAddedMessageState] = useState(
    'Save and add another'
  );

  const closeModal = () =>
    setModalState({ open: false, action: null, formikState: null });
  const openModal = () =>
    setModalState({ open: true, action: null, formikState: null });

  const changeContent = () => {
    setAddedMessageState('Added');

    setTimeout(() => {
      setAddedMessageState('Save and add another');
    }, 2000);
  };

  useEffect(() => {
    modalState.formikState ? modalState.formikState.handleSubmit() : null;
  }, [modalState]);

  return (
    <Formik
      initialValues={deserializeFeature(initialFeature)}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values, formikBag) => {
        onFeatureChange(createFeature(values)); // todo: should we create a 'serializer' function ? what about this name...

        formikBag.setSubmitting(false);
        formikBag.resetForm();

        switch (modalState.action) {
          case 'saveAndContinue':
            closeModal();
            openModal();
            changeContent();
            break;

          case 'saveAndClose':
            closeModal();
            break;

          default:
            break;
        }
      }}
    >
      {({ values, resetForm }) => {
        const placePath = `place`;
        const featurePath = `features`;
        const descriptionPath = `description`;

        return (
          <Modal
            centered={false}
            onOpen={openModal}
            open={modalState.open}
            trigger={trigger}
            onClose={() => {
              closeModal();
              resetForm();
            }}
            closeIcon={true}
            closeOnDimmerClick={false}
          >
            <Modal.Header as="h6" className="pt-10 pb-10">
              <Grid>
                <Grid.Column floated="left" width={4}>
                  <Header as="h2">
                    {action === ModalActions.ADD ? addLabel : editLabel}
                  </Header>
                </Grid.Column>
              </Grid>
            </Modal.Header>
            <Modal.Content>
              <Form>
                <PlaceField
                  fieldPath={placePath}
                  label={'Place'}
                  required={false}
                />

                <DescriptionField
                  fieldPath={descriptionPath}
                  editorConfig={{
                    removePlugins: [
                      'Image',
                      'ImageCaption',
                      'ImageStyle',
                      'ImageToolbar',
                      'ImageUpload',
                      'MediaEmbed',
                      'Table',
                      'TableToolbar',
                      'TableProperties',
                      'TableCellProperties',
                    ],
                  }}
                  required={false}
                />

                {/* ToDo: add identifier field here... */}

                <InteractiveGeometryField
                  fieldPath={featurePath}
                  {...geometryViewerConfig}
                />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <ActionButton
                name="cancel"
                onClick={(values, formikBag) => {
                  formikBag.resetForm();
                  closeModal();
                }}
                icon={'remove'}
                content={'Cancel'} // i18next
                floated={'left'}
              />
              {action === ModalActions.ADD && (
                <ActionButton
                  name={'submit'}
                  onClick={(event, formik) => {
                    setModalState({
                      ...modalState,
                      action: 'saveAndContinue',
                      formikState: formik,
                    });
                  }}
                  primary
                  icon={'checkmark'}
                  content={addedMessageState}
                />
              )}
              <ActionButton
                name={'submit'}
                onClick={(event, formik) => {
                  setModalState({
                    ...modalState,
                    action: 'saveAndClose',
                    formikState: formik,
                  });
                }}
                primary
                icon={'checkmark'}
                content={'Save'} // i18next
              />
            </Modal.Actions>
          </Modal>
        );
      }}
    </Formik>
  );
};
