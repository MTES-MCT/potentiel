import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { ClipboardCheckIcon, Section } from '../../../components';

type ResultatsAppelOffreInnovationProps = {
  note: ProjectDataForProjectPage['note'];
  notePrix: ProjectDataForProjectPage['notePrix'];
  notesInnovation: ProjectDataForProjectPage['notesInnovation'];
};

export const ResultatsAppelOffreInnovation = ({
  note,
  notePrix,
  notesInnovation,
}: ResultatsAppelOffreInnovationProps) => (
  <Section title="Résultats de l'appel d'offres" icon={<ClipboardCheckIcon />}>
    <div className="mb-3">
      <b>Note totale</b>: {note || 'N/A'}
    </div>
    <ul>
      <li>
        <b>Note prix</b> : {notePrix}
      </li>
      <li>
        <b>Note innovation</b> : {notesInnovation?.note}
        <ul>
          <li>
            <b>Note degré d’innovation (/20pt)</b> : {notesInnovation?.degréInnovation}
          </li>
          <li>
            <b>Note positionnement sur le marché (/10pt)</b> : {notesInnovation?.positionnement}
          </li>
          <li>
            <b>Note qualité technique (/5pt)</b> : {notesInnovation?.qualitéTechnique}
          </li>
          <li>
            <b>Note adéquation du projet avec les ambitions industrielles (/5pt)</b> :{' '}
            {notesInnovation?.adéquationAmbitionsIndustrielles}
          </li>
          <li>
            <b>Note aspects environnementaux et sociaux (/5pt)</b> :{' '}
            {notesInnovation?.aspectsEnvironnementauxEtSociaux}
          </li>
        </ul>
      </li>
    </ul>
  </Section>
);
