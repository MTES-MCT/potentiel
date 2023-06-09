import React from 'react';
import { Request } from 'express';
import { Timeline, CalendarIcon, Section, Link, InfoBox } from '@components';
import { userIs } from '@modules/users';
import { ProjectEventListDTO } from '@modules/frise';
import routes from '@routes';
import { convertirEnIdentifiantProjet } from '@potentiel/domain';

type EtapesProjetProps = {
  project: {
    id: string;
    appelOffreId: string;
    periodeId: string;
    familleId: string;
    numeroCRE: string;
  };
  user: Request['user'];
  projectEventList: ProjectEventListDTO;
};

export const EtapesProjet = ({ user, projectEventList, project }: EtapesProjetProps) => (
  <Section
    title="Étapes du projet"
    icon={CalendarIcon}
    className="flex-auto min-w-0 lg:max-w-[60%]"
  >
    <Timeline
      {...{
        projectEventList,
      }}
    />
    {userIs(['admin', 'dgec-validateur', 'porteur-projet', 'dreal', 'acheteur-obligé', 'cre'])(
      user,
    ) && (
      <InfoBox>
        Les données de raccordement du projet sont dorénavant consultables et modifiables sur{' '}
        <Link
          href={routes.GET_LISTE_DOSSIERS_RACCORDEMENT(
            convertirEnIdentifiantProjet({
              appelOffre: project.appelOffreId,
              période: project.periodeId,
              famille: project.familleId,
              numéroCRE: project.numeroCRE,
            }).formatter(),
          )}
        >
          cette page dédiée.
        </Link>
      </InfoBox>
    )}
    {/* on teste si cette fonctionnalité est utlisée
     {userIs(['admin', 'dgec-validateur', 'dreal'])(user) && <AttachFile projectId={project.id} />} */}
  </Section>
);
