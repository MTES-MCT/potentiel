import React, { ComponentProps } from 'react';
import { Timeline, CalendarIcon, Section } from '@components';
import { ProjectEventListDTO } from '@modules/frise';

type EtapesProjetProps = ComponentProps<'section'> & {
  projectEventList: ProjectEventListDTO;
};

export const EtapesProjet = ({ projectEventList, className = '' }: EtapesProjetProps) => (
  <Section title="Étapes du projet" icon={CalendarIcon} className={`${className}`}>
    <Timeline
      {...{
        projectEventList,
      }}
    />
    {/* on teste si cette fonctionnalité est utlisée
     {userIs(['admin', 'dgec-validateur', 'dreal'])(user) && <AttachFile projectId={project.id} />} */}
  </Section>
);
