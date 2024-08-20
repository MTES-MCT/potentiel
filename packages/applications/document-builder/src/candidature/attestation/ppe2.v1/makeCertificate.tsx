import React from 'react';

import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Certificate } from '../Certificate';
import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';
import { Footnote, makeAddFootnote } from '../helpers/makeAddFootnotes';

import { Lauréat } from './Laureat';
import { Elimine } from './Elimine';

const makeCertificate = (
  project: AttestationCandidatureOptions,
  validateur: AppelOffre.Validateur,
): React.JSX.Element => {
  const footnotes: Array<Footnote> = [];
  const addFootNote = makeAddFootnote(footnotes);
  const content = project.isClasse ? (
    <Lauréat project={project} addFootNote={addFootNote} />
  ) : (
    <Elimine project={project} />
  );
  return (
    <Certificate project={project} validateur={validateur} footnotes={footnotes}>
      {content}
    </Certificate>
  );
};

export { makeCertificate };
