/*
 * This file is part of GEO-Metadata-Previewer.
 * Copyright (C) 2022 GEO Secretariat.
 *
 * GEO-Metadata-Previewer is free software; you can redistribute it and/or modify it
 * under the terms of the MIT License; see LICENSE file for more details.
 */

import React, { useRef } from 'react';

import _get from 'lodash/get';

import { useDrag, useDrop } from 'react-dnd';
import { Button, Label, List, Ref } from 'semantic-ui-react';
import { FeatureModal } from './FeatureModal/FeatureModal';

export const LocationFieldItem = ({
  compKey,
  index,
  replaceLocation,
  removeLocation,
  moveLocation,
  addLabel,
  editLabel,
  initialFeature, // ToDo: Review this name!
  //   schema, (ToDo: Implement)
}) => {
  const dropRef = useRef(null);
  const [_, drag, preview] = useDrag({
    type: 'location',
    item: { index },
  });

  const [{ hidden }, drop] = useDrop({
    accept: 'location',
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      if (monitor.isOver({ shallow: true })) {
        moveLocation(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
    collect: (monitor) => ({
      hidden: monitor.isOver({ shallow: true }),
    }),
  });

  // Initialize the ref explicitely
  drop(dropRef);
  return (
    <Ref innerRef={dropRef} key={compKey}>
      <List.Item
        key={compKey}
        className={
          hidden ? 'deposit-drag-listitem hidden' : 'deposit-drag-listitem'
        }
      >
        <List.Content floated={'right'}>
          <FeatureModal
            addLabel={addLabel}
            editLabel={editLabel}
            onFeatureChange={(selectedFeature) => {
              // is the name "feature" good for this component ?
              replaceLocation(index, selectedFeature);
            }}
            initialFeature={initialFeature}
            // schema (ToDo)
            action="edit"
            trigger={
              <Button size={'mini'} primary type="button">
                {'Edit'} // i18next
              </Button>
            }
          />
          <Button
            size={'mini'}
            type={'button'}
            onClick={() => removeLocation(index)}
          >
            {'Remove'} // i18next
          </Button>
        </List.Content>
        <Ref innerRef={drag}>
          <List.Icon name={'bars'} className={'drag-anchor'} />
        </Ref>
        <Ref innerRef={preview}>
          <List.Content>
            <List.Description>
              {_get(initialFeature, 'place', 'Empty place name')}

              {_get(initialFeature, 'description', 'Empty description')}

              {/* Implement a way to visualize the geometry...maybe a kind of 'popup viewer' */}
            </List.Description>
          </List.Content>
        </Ref>
      </List.Item>
    </Ref>
  );
};
