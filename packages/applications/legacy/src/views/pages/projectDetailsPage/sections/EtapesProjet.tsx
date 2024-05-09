import React from 'react';
import { Request } from 'express';
import { Timeline, CalendarIcon, Section, Link, InfoBox } from '../../../components';
import { userIs } from '../../../../modules/users';
import { ProjectEventListDTO } from '../../../../modules/frise';
import { formatProjectDataToIdentifiantProjetValueType } from '../../../../helpers/dataToValueTypes';

import { Routes } from '@potentiel-applications/routes';
import { AttestationConformiteItemProps } from '../../../components/timeline/components';

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
  attestationConformité?: AttestationConformiteItemProps['attestationConformité'];
};
export const EtapesProjet = ({
  user,
  projectEventList,
  project,
  attestationConformité,
}: EtapesProjetProps) => (
  <Section
    title="Étapes du projet"
    icon={<CalendarIcon />}
    className="flex-auto min-w-0 lg:max-w-[60%]"
  >
    <Timeline
      {...{
        projectEventList,
        attestationConformité,
        project,
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
              formatProjectDataToIdentifiantProjetValueType({
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
