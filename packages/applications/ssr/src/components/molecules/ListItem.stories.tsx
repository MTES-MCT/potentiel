import type { Meta, StoryObj } from '@storybook/react';
import Badge from '@codegouvfr/react-dsfr/Badge';

import { ListItem, ListItemProps } from './ListItem';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Molecules/List/Item',
  component: ListItem,
  parameters: {},
  tags: ['autodocs'],
  argTypes: {},
  args: {},
} satisfies Meta<ListItemProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: (
      <div className="bg-dsfr-background-alt-blueFrance-default w-full gap-2 p-2">
        <b>Heading</b>
      </div>
    ),
    children: (
      <div className="bg-dsfr-background-alt-redMarianne-default w-full gap-2 p-2">
        <b>Body</b>
        <br />
        Text
        <br />
        <Badge severity="success">Badge</Badge>
      </div>
    ),
    actions: (
      <div>
        <a href="/" aria-label={`voir le détail`}>
          voir le détail
        </a>
      </div>
    ),
  },
};
