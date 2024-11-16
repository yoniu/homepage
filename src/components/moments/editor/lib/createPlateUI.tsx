// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import {
  type NodeComponent,
  PlateLeaf,
} from '@udecode/plate-common/react';

export const createPlateUI = ({
  draggable,
  placeholder,
}: { draggable?: boolean; placeholder?: boolean } = {}) => {
  let components: Record<string, NodeComponent> = {
    [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
    [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  };

  if (placeholder) {
    components = withPlaceholders(components);
  }
  if (draggable) {
    components = withDraggables(components);
  }

  return components;
};
