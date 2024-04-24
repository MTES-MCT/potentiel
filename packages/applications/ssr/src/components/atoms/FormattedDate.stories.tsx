import type { Meta, StoryObj } from '@storybook/react';

import { now } from '@potentiel-libraries/iso8601-datetime';

import { FormattedDate, FormattedDateProps } from './FormattedDate';

const meta = {
  title: 'Atoms/FormattedDate',
  component: FormattedDate,
  parameters: {
    docs: {
      description: {
        component:
          'Ce composant est basé sur un design équivalent à celui du [react-dsfr](https://components.react-dsfr.codegouv.studio/?path=/docs/components-callout--default) mais évite que le contenu soit wrappé dans un `<p>`',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<FormattedDateProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    date: now(),
  },
};
