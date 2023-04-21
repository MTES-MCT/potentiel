import React from 'react';
import { Request } from 'express';
import { Timeline, CalendarIcon, Section } from '@components';
import { userIs } from '@modules/users';
import { ProjectEventListDTO } from '@modules/frise';

type EtapesProjetProps = {
  project: { id: string };
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
      <p>
        Les données de raccordement de votre projet sont dorénavant consultables et modifiables sur
        cette page dédiée.
      </p>
    )}
    {/* on teste si cette fonctionnalité est utlisée
     {userIs(['admin', 'dgec-validateur', 'dreal'])(user) && <AttachFile projectId={project.id} />} */}
  </Section>
);
