// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

export const createPlateUI = () => {
  const components: Record<string, NodeComponent> = {
    [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
    [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  };

  return components;
};
