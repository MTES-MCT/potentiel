import { Request } from 'express';
import querystring from 'querystring';
import React, { useState } from 'react';
import { AppelOffre, Famille, Periode } from '@entities';
import { PaginatedList } from '@modules/pagination';

import {
  ProjectList,
  ExcelFileIcon,
  SecondaryLinkButton,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  PrimaryButton,
  Input,
  Label,
  Heading1,
  ListeVide,
  Dropdown,
  Form,
  Link,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import { ProjectListItem } from '@modules/project';
import routes from '@routes';
import { ListeProjetsFiltres, ListeProjetsFiltresProps } from './components/Filtres';
import { userIs } from '@modules/users';

type ListeProjetsProps = {
  request: Request;
  projects: PaginatedList<ProjectListItem>;
  appelsOffre: Array<AppelOffre>;
  existingAppelsOffres: Array<AppelOffre['id']>;
  existingPeriodes?: Array<Periode['id']>;
  existingFamilles?: Array<Famille['id']>;
  currentUrl: string;
};

export const ListeProjets = ({
  request,
  projects,
  appelsOffre,
  existingAppelsOffres,
  existingPeriodes,
  existingFamilles,
  currentUrl,
}: ListeProjetsProps) => {
  const {
    query: { error, success },
    user,
  } = request as { query: { error?: string; success?: string }; user: Request['user'] };

  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [displaySelection, setDisplaySelection] = useState(false);

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <Heading1>{request.user.role === 'porteur-projet' ? 'Mes Projets' : 'Projets'}</Heading1>
      {success && <SuccessBox title={success} />}
      {error && <ErrorBox title={error} />}

      <ListeProjetsFiltres
        query={request.query as ListeProjetsFiltresProps['query']}
        appelsOffre={appelsOffre}
        user={user}
        existingAppelsOffres={existingAppelsOffres}
        existingPeriodes={existingPeriodes}
        existingFamilles={existingFamilles}
      />
      {projects.items.length > 0 ? (
        <>
          {userIs(['admin', 'dgec-validateur', 'porteur-projet'])(user) && (
            <Dropdown
              design="link"
              text="Donner accès à un utilisateur"
              isOpen={displaySelection}
              changeOpenState={(state) => setDisplaySelection(state)}
            >
              <Form
                action={routes.INVITE_USER_TO_PROJECT_ACTION}
                method="POST"
                name="form"
                className="m-0 mt-4"
              >
                <select name="projectId" multiple hidden>
                  {selectedProjectIds.map((projectId) => (
                    <option selected key={projectId} value={projectId}>
                      {projectId}
                    </option>
                  ))}
                </select>
                <div>
                  <Label htmlFor="email" required>
                    Courrier électronique de la personne habilitée à suivre les projets selectionnés
                    ci-dessous:
                  </Label>
                  <Input required type="email" name="email" id="email" />
                </div>
                <PrimaryButton
                  type="submit"
                  name="submit"
                  id="submit"
                  disabled={!selectedProjectIds.length}
                >
                  Accorder les droits sur {selectedProjectIds.length}{' '}
                  {selectedProjectIds.length > 1 ? 'projets' : 'projet'}
                </PrimaryButton>
              </Form>
            </Dropdown>
          )}

          <div className="flex flex-col md:flex-row md:items-center py-2">
            <span>
              <strong>{projects.itemCount}</strong> projets
            </span>

            {projects.itemCount > 0 && (
              <SecondaryLinkButton
                className="inline-flex items-center m-0 md:ml-auto umami--click--telecharger-un-export-projets"
                href={`${routes.EXPORTER_LISTE_PROJETS_CSV}?${querystring.stringify(
                  request.query as any,
                )}`}
                download
              >
                <ExcelFileIcon className="mr-2" />
                Télécharger un export
              </SecondaryLinkButton>
            )}
          </div>

          <ProjectList
            displaySelection={displaySelection}
            selectedIds={selectedProjectIds}
            currentUrl={currentUrl}
            onSelectedIdsChanged={setSelectedProjectIds}
            {...(userIs('dreal') && { displayGF: true })}
            projects={projects}
            role={request.user?.role}
          />
        </>
      ) : (
        <ListeVide titre="Aucun projet à lister">
          {projects.itemCount > 0 && <Link href={routes.LISTE_PROJETS}>Voir tout les projets</Link>}
        </ListeVide>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(ListeProjets);
