import type { Meta, StoryObj } from '@storybook/react';

import { CallOut, CallOutProps } from './CallOut';

const meta = {
  title: 'Atoms/Callout',
  component: CallOut,

  parameters: {
    docs: {
      description: {
        component:
          'Ce composant est basé sur un design équivalent à celui du [react-dsfr](https://components.react-dsfr.codegouv.studio/?path=/docs/components-callout--default) mais évite que le contenu soit wrappé dans un `<p>`',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Le titre du callout (<b>ReactNode</b>)',
      control: { type: 'text' },
      defaultValue: false,
    },
    content: {
      description: 'Le contenu du callout  (<b>ReactNode</b>)',
      control: { type: 'text' },
      defaultValue: false,
    },
    iconId: {
      description:
        "L'identifiant de l'icône à afficher, cf. [la liste](https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-techniques/icone/)",
      control: {
        type: 'text',
      },
      defaultValue: false,
    },
  },
} satisfies Meta<CallOutProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Le titre du callout',
    content: 'Le contenu du callout',
    iconId: 'ri-information-line',
  },
};
