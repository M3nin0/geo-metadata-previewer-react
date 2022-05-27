/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, RichInputField } from 'react-invenio-forms';
// import { i18next } from '../../i18next';
// import { i18next } from '@translations/i18next';

const i18next = { t: (t) => t };

export class DescriptionField extends Component {
  render() {
    const { fieldPath, label, labelIcon, options, editorConfig, recordUI } =
      this.props;
    return (
      <>
        <RichInputField
          className="description-field rel-mb-1"
          fieldPath={fieldPath}
          editorConfig={editorConfig}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          optimized
        />
      </>
    );
  }
}

DescriptionField.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  editorConfig: PropTypes.object,
};

DescriptionField.defaultProps = {
  fieldPath: 'metadata.description',
  label: i18next.t('Description'),
  labelIcon: 'pencil',
  editorConfig: {},
};
