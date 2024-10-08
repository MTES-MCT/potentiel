import React from 'react';
import { Request } from 'express';
import { Timeline, CalendarIcon, Section } from '../../../components';
import { ProjectEventListDTO } from '../../../../modules/frise';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';

type EtapesProjetProps = {
  project: {
    id: string;
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
    isClasse: boolean;
    isAbandoned: boolean;
  };
  user: Request['user'];
  projectEventList: ProjectEventListDTO;
};

export const EtapesProjet = ({ projectEventList, project }: EtapesProjetProps) => (
  <Section
    title="Étapes du projet"
    icon={<CalendarIcon />}
    className="flex-auto min-w-0 lg:max-w-[60%]"
  >
    <Timeline
      projectEventList={projectEventList}
      identifiantProjet={formatProjectDataToIdentifiantProjetValueType({
    appelOffreId: project.appelOffreId,
    periodeId: project.periodeId,
    familleId: project.familleId,
    numeroCRE: project.numeroCRE,
  }).formatter()}
    />
  </Section>
);
