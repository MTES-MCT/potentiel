import React from 'react';
import { UserRole } from '@modules/users';
import { ACTION_BY_ROLE } from './actions';
import { DropdownMenu } from './UI';
import { ProjectAppelOffre } from '@entities';

type Props = {
  project: {
    id: string;
    appelOffre?: {
      type: ProjectAppelOffre['type'];
      unitePuissance: ProjectAppelOffre['unitePuissance'];
      periode: ProjectAppelOffre['periode'];
    };
    isClasse: boolean;
    isAbandoned: boolean;
    isLegacy: boolean;
    notifiedOn?: Date;
    certificateFile?: {
      id: string;
      filename: string;
    };
    email: string;
    nomProjet: string;
    garantiesFinancières?: {
      id: string;
      statut: 'à traiter' | 'validé' | 'en attente';
    };
  };
  role: UserRole;
};

export const ProjectActions = ({ project, role }: Props) => {
  const actions = ACTION_BY_ROLE[role].call(null, project);
  if (!actions || !actions.length) return null;
  return (
    <div className="relative">
      <ul>
        <DropdownMenu buttonChildren="Actions">
          {actions.map(({ title, link, isDownload, disabled }, index) => {
            return (
              <DropdownMenu.DropdownItem
                href={link}
                download={isDownload ? true : undefined}
                disabled={disabled ? true : undefined}
                key={`${title}#${index}`}
              >
                {title}
              </DropdownMenu.DropdownItem>
            );
          })}
        </DropdownMenu>
      </ul>
    </div>
  );
};
