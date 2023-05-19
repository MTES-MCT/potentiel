import React from 'react';
import { Input } from './Input';

export default {
  title: 'Components/Atoms/Inputs',
  components: { Input },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

const InputTemplate = (args) => <Input {...args} />;
export const Text = InputTemplate.bind({});
Text.args = {
  placeholder: 'Ceci est un input text',
};
