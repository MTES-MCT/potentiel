import React from 'react';
import { Request } from 'express';
import { Timeline, CalendarIcon, Section, Link, InfoBox } from '../../../components';
import { userIs } from '../../../../modules/users';
import { ProjectEventListDTO } from '../../../../modules/frise';
import { formatProjectAODataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';

import { Routes } from '@potentiel-libraries/routes';

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

export const EtapesProjet = ({ user, projectEventList, project }: EtapesProjetProps) => (
  <Section
    title="Étapes du projet"
    icon={<CalendarIcon />}
    className="flex-auto min-w-0 lg:max-w-[60%]"
  >
    <Timeline
      {...{
        projectEventList,
      }}
    />
    {project.isClasse &&
      !project.isAbandoned &&
      userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'])(
        user,
      ) && (
        <InfoBox className="print:hidden">
          Les données de raccordement du projet sont dorénavant consultables et modifiables sur{' '}
          <Link
            href={Routes.Raccordement.détail(
              formatProjectAODataToIdentifiantProjetValueType({
                appelOffreId: project.appelOffreId,
                periodeId: project.periodeId,
                familleId: project.familleId,
                numeroCRE: project.numeroCRE,
              }).formatter(),
            )}
            aria-label="Accéder aux données de raccordement"
          >
            cette page dédiée.
          </Link>
        </InfoBox>
      )}
    {/* on teste si cette fonctionnalité est utlisée
     {userIs(['admin', 'dgec-validateur', 'dreal'])(user) && <AttachFile projectId={project.id} />} */}
  </Section>
);
