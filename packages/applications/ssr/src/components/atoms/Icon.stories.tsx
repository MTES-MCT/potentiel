import type { Meta, StoryObj } from '@storybook/react';
import {
  frIconClassNames,
  riIconClassNames,
} from '@codegouvfr/react-dsfr/fr/generatedFromCss/classNames';

import { Icon, IconProps } from './Icon';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component:
          "Ce composant facilite l'utilisation des icones basée sur les classes proposées par le [dsfr](https://react-dsfr.codegouv.studio/icons) et [remix icons](https://remixicon.com/)",
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      description:
        "L'identifiant de l'icone ([classe dsfr](https://www.systeme-de-design.gouv.fr/elements-d-interface/fondamentaux-techniques/icone/) ou [remix icons](https://remixicon.com/))",
      control: { type: 'select' },
      options: [...frIconClassNames, ...riIconClassNames],
    },
    size: {
      description: "La taille de l'icone, basée sur les classes dsfr (optionnel)",
      control: { type: 'select' },
      defaultValue: 'md',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    title: {
      description: "Le titre de l'icone (optionnel)",
      control: { type: 'text' },
    },
    className: {
      description: "Les classes css additionnelles à appliquer à l'icone (optionnel)",
      control: { type: 'text' },
    },
    style: {
      description:
        "Les styles css additionnels à appliquer à l'icone, notamment si on a besoin de surcharger en utilisant les couleurs provenant de l'utilitaire fr (optionnel)",
      control: { type: 'object' },
    },
  },
} satisfies Meta<IconProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'fr-icon-account-circle-fill',
    title: "Le titre de l'icone",
  },
};
