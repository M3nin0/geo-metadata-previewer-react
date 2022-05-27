/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { FieldLabel, TextField } from 'react-invenio-forms';

export const PlaceField = ({ fieldPath, label, required }) => (
  <>
    <TextField
      fieldPath={fieldPath}
      label={
        <FieldLabel htmlFor={fieldPath} icon={'street view'} label={label} />
      }
      required={required}
      className="place-field"
    />
  </>
);
