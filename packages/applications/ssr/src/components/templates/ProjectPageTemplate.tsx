import { FC } from 'react';
import { ConsulterCandidatureReadModel } from '@potentiel-domain/candidature';
import { ProjectStatusBadge } from '@/components/molecules/ProjectStatusBadge';
import { displayDate } from '@/utils/displayDate';

type ProjectPageTemplate = {
  children: React.ReactNode;
  candidature: ConsulterCandidatureReadModel;
  identifiantProjet: string;
};

export const ProjectPageTemplate: FC<ProjectPageTemplate> = ({
  children,
  identifiantProjet,
  candidature: { statut, nom, appelOffre, période, famille, numéroCRE, localité, dateDésignation },
}) => {
  return (
    <>
      <aside className="bg-blue-france-sun-base text-white py-6 mb-3">
        <div className="fr-container lg:flex justify-between gap-2">
          <div className="mb-3">
            <div className="flex justify-start items-center">
              <a
                href={`/projet/${encodeURIComponent(identifiantProjet)}/details.html`}
                className="text-xl font-bold !text-white mr-2"
              >
                {nom}
              </a>
              <ProjectStatusBadge statut={statut} />
            </div>
            <p className="text-sm font-medium p-0 m-0 mt-2">
              {localité.commune}, {localité.département}, {localité.région}
            </p>
            <div>
              désigné le {displayDate(new Date(dateDésignation))} pour la période {appelOffre}{' '}
              {période}
              {famille ? `, famille ${famille}` : ''}
            </div>
          </div>
        </div>
      </aside>
      <div className="fr-container my-10">{children}</div>
    </>
  );
};
