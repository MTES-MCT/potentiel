'use client';
import { useState } from 'react';

import MultipleSelect from '@/components/molecules/MultipleSelect';

export const Sample = () => {
  const [selected, setSelected] = useState([] as string[]);
  return (
    <MultipleSelect
      selected={selected}
      label="Multiple"
      options={[
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
        { label: 'Option 3', value: '3' },
      ]}
      onChange={setSelected}
      // noSearch
      // noSelectAll
    />
  );
};
