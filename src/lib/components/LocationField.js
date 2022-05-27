/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';

import { FieldArray, getIn } from 'formik';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FieldLabel } from 'react-invenio-forms';
import { Button, Icon, List, Form } from 'semantic-ui-react';
import { FeatureModal } from './FeatureModal/FeatureModal';
import { LocationFieldItem } from './LocationFieldItem';

const LocationFieldForm = ({
  form: { values, errors, initialErrors, initialValues },
  remove: formikArrayRemove,
  replace: formikArrayReplace,
  move: formikArrayMove,
  push: formikArrayPush,
  name: fieldPath,
  label,
  labelIcon,
  modal,
  addButtonLabel,
  geometryViewerConfig,
  //   schema, (ToDo: implement)
}) => {
  // extracting the formik values
  const formikValues = getIn(values, fieldPath, []);
  const formikInitialValues = getIn(initialValues, fieldPath, []);

  const error = getIn(errors, fieldPath, null);
  const initialError = getIn(initialErrors, fieldPath, null);

  const locationsError =
    error || (formikValues === formikInitialValues && initialError);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* // required= (ToDo: implement) */}
      <Form.Field className={'error'}>
        <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        <List>
          {getIn(values, fieldPath, []).map((value, index, array) => {
            const key = `${fieldPath}.${index}`;

            return (
              <LocationFieldItem
                key={key}
                {...{
                  index,
                  compkey: key,
                  initialFeature: value,
                  removeLocation: formikArrayRemove,
                  replaceLocation: formikArrayReplace,
                  moveLocation: formikArrayMove,
                  addLabel: modal.addLabel,
                  editLabel: modal.editLabel,
                  geometryViewerConfig: geometryViewerConfig,
                }}
              />
            );
          })}
          <FeatureModal
            onFeatureChange={(selectedFeature) => {
              formikArrayPush(selectedFeature);
            }}
            action="add"
            addLabel={modal.addLabel}
            editLabel={modal.editLabel}
            // schema (ToDo)
            trigger={
              <Button type="button" icon labelPosition="left">
                <Icon name="add" />
                {addButtonLabel}
              </Button>
            }
            geometryViewerConfig={geometryViewerConfig}
          />
        </List>
      </Form.Field>
    </DndProvider>
  );
};

/**
 *
 */
export const LocationField = ({ fieldPath, ...locationFieldProps }) => {
  return (
    <FieldArray
      name={fieldPath}
      render={(formikProps) => (
        <LocationFieldForm {...formikProps} {...locationFieldProps} />
      )}
    />
  );
};
