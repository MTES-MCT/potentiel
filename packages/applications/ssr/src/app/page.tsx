import React from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Sample } from './sample-select';
// (some of these imports may differ depending on what the package provides)

export default function Page() {
  return (
    <div className="m-10 max-w-md flex flex-col gap-6">
      <Sample />
      <Select
        label="Basique"
        options={[
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
          { label: 'Option 3', value: '3' },
        ]}
      />
    </div>
  );
}
