import React from 'react';
import { UserRole } from '@modules/users';
import { DropdownMenuSecondaryButton } from '@components';
import { getProjectActionsByRole } from '../helpers';
import { ProjectListItem } from '@modules/project';

/*
                     ...project,
                        isClasse: project.classe === 'Classé',
                        isAbandoned: project.abandonedOn !== 0,
                        isLegacy: project.appelOffre?.periode.type === 'legacy',
                        notifiedOn: project.notifiedOn ? new Date(project.notifiedOn) : undefined,

*/

export type ProjectActionProps = {
  project: ProjectListItem & {
    isClasse: boolean;
    isAbandoned: boolean;
    isLegacy: boolean;
    notifiedOn: number;
    certificateFile?: {
      id: string;
      filename: string;
    };
  };
  role: UserRole;
};

export const Actions = ({ project, role }: ProjectActionProps) => {
  const actions = getProjectActionsByRole(role, project);
  if (!actions || !actions.length) return null;
  return (
    <div className="relative">
      <DropdownMenuSecondaryButton buttonChildren="Actions">
        {actions.map(({ title, link, isDownload, disabled }, index) => {
          return (
            <DropdownMenuSecondaryButton.DropdownItem
              href={link}
              download={isDownload ? true : undefined}
              disabled={disabled ? true : undefined}
              key={`${title}#${index}`}
            >
              {title}
            </DropdownMenuSecondaryButton.DropdownItem>
          );
        })}
      </DropdownMenuSecondaryButton>
    </div>
  );
};
