import {
  AlertBox,
  Button,
  Input,
  InputCheckbox,
  Label,
  ListeVide,
  PaginationPanel,
} from '@components';
import { logger } from '@core/utils';
import { Project, User } from '@entities';
import routes from '@routes';
import React from 'react';
import { dataId } from '../../helpers/testId';
import { PaginatedList } from '../../types';
import { ACTION_BY_ROLE } from './actions';

type Columns =
  | 'Projet'
  | 'Candidat'
  | 'Puissance'
  | 'Region'
  | 'N° CRE'
  | 'Projet pre-affecte'
  | 'Prix'
  | 'Attestation de designation';

type ColumnRenderer = (props: { project: Project; email: User['email'] }) => React.ReactNode;

const ColumnComponent: Record<Columns, ColumnRenderer> = {
  Projet: ({ project }) => (
    <td valign="top" className="missingOwnerProjectList-projet-column">
      <div {...dataId('missingOwnerProjectList-item-nomProjet')}>{project.nomProjet}</div>
      <div className="italic text-xs">
        <div>{project.departementProjet}</div>
        <div>{project.nomCandidat}</div>
        <div>
          {project.appelOffreId} - {project.periodeId}
        </div>
      </div>
    </td>
  ),
  Candidat: ({ project }) => (
    <td valign="top" className="projectList-candidat-column">
      <div {...dataId('projectList-item-nomCandidat')}>{project.nomCandidat}</div>
      <div className="italic text-xs">
        <span {...dataId('projectList-item-nomRepresentantLegal')}>
          {project.nomRepresentantLegal}
        </span>{' '}
        <span {...dataId('projectList-item-email')}>{project.email}</span>
      </div>
    </td>
  ),
  Puissance: ({ project }) => (
    <td valign="top" className="projectList-puissance-column">
      <span {...dataId('projectList-item-puissance')}>{project.puissance}</span>{' '}
      <span className="italic text-xs">{project.appelOffre?.unitePuissance}</span>
    </td>
  ),
  Region: ({ project }) => (
    <td valign="top" className="projectList-puissance-column">
      <span {...dataId('projectList-item-region')}>{project.regionProjet}</span>{' '}
    </td>
  ),
  'Projet pre-affecte': ({ project, email }) => (
    <td valign="top" className="projectList-projet-pre-affecte-column">
      <span {...dataId('projectList-item-pre-affecte')}>
        {project.email === email ? 'Oui' : 'Non'}
      </span>
    </td>
  ),
  'N° CRE': ({ project, email }) =>
    email !== project.email ? (
      <td valign="top" className="projectList-numero-cre-column">
        <Label htmlFor={`numeroCRE|${project.id}`} className="mb-1">
          Renseigner le numéro CRE
        </Label>
        <Input
          type="text"
          id={`numeroCRE|${project.id}`}
          name={`numeroCRE|${project.id}`}
          placeholder="N° CRE"
          className="min-w-[110px]"
        />
      </td>
    ) : (
      <td>--</td>
    ),
  Prix: ({ project, email }) =>
    email !== project.email ? (
      <td valign="top" className="projectList-prix-column">
        <Label htmlFor={`prix|${project.id}`} className="mb-1">
          Renseigner le prix (€/MWh)
        </Label>
        <Input
          type="number"
          step="any"
          id={`prix|${project.id}`}
          name={`prix|${project.id}`}
          placeholder="0.00"
          className="min-w-[110px]"
        />
      </td>
    ) : (
      <td>--</td>
    ),
  'Attestation de designation': ({ project, email }) =>
    email !== project.email ? (
      <td valign="top" className="projectList-attestation-designation-column">
        <Label htmlFor={`attestation-designation|${project.id}`} className="mb-1">
          Ajouter l'attestation de désignation
        </Label>
        <Input
          type="file"
          id={`attestation-designation|${project.id}`}
          name={`attestation-designation|${project.id}`}
          className="min-w-[110px]"
        />
      </td>
    ) : (
      <td>--</td>
    ),
};

interface Props {
  projects: PaginatedList<Project> | Array<Project>;
  displayColumns: Array<string>;
  user: User;
}

export const MissingOwnerProjectList = ({ projects, displayColumns, user }: Props) => {
  const { role, email } = user;

  let items: Array<Project>;
  if (Array.isArray(projects)) {
    items = projects;
  } else {
    items = projects.items;
  }

  if (!items.length) {
    return <ListeVide titre="Aucun projet à lister" />;
  }

  return (
    <>
      <form
        action={routes.USER_CLAIM_PROJECTS}
        encType="multipart/form-data"
        className="max-w-full"
        method="post"
      >
        <table className="table missingOwnerProjectList">
          <thead>
            <tr>
              <th {...dataId('missingOwnerProjectList-checkbox')}>
                <InputCheckbox {...dataId('missingOwnerProjectList-selectAll-checkbox')} />
              </th>
              {displayColumns?.map((column) =>
                column === 'N° CRE' ? (
                  <th key={column}>
                    <a className="tooltip">
                      (?)
                      <img src="/images/numeroCRE_tooltip.jpg" className="tooltiptext w-[700px]" />
                    </a>
                    &nbsp;
                    {column}
                  </th>
                ) : (
                  <th key={column}>{column}</th>
                ),
              )}
              {ACTION_BY_ROLE[role] ? <th></th> : ''}
            </tr>
          </thead>
          <tbody>
            {items.map((project) => {
              return (
                <tr key={'project_' + project.id} {...dataId('missingOwnerProjectList-item')}>
                  <td {...dataId('missingOwnerProjectList-checkbox')}>
                    <InputCheckbox
                      {...dataId('missingOwnerProjectList-item-checkbox')}
                      data-projectid={project.id}
                    />
                  </td>
                  {displayColumns?.map((column) => {
                    const Column = ColumnComponent[column];
                    if (!Column) {
                      logger.error(`Column ${column} could not be found`);
                      return <td></td>;
                    }
                    return (
                      <Column
                        key={`project_${project.id}_${column}`}
                        project={project}
                        email={email}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        <select name="projectIds" multiple {...dataId('claimed-project-list')} className="hidden" />

        <AlertBox className="my-8">
          <Label htmlFor="swornStatement">
            <InputCheckbox
              name="swornStatement"
              id="swornStatement"
              {...dataId('sworn-statement')}
              className="mr-1"
            />
            J'atteste sur l'honneur que je suis bien la personne désignée pour suivre le/les
            projet(s) sélectionné(s). En cas de fausse déclaration, je m'expose à un risque de
            poursuites judiciaires.
          </Label>
        </AlertBox>
        <Button
          type="submit"
          name="submit"
          id="submit"
          disabled
          {...dataId('claim-projects-submit-button')}
          className="my-1"
        >
          Réclamer la propriété des projets sélectionnés
        </Button>
      </form>

      {!Array.isArray(projects) && (
        <PaginationPanel
          pagination={{
            limiteParPage: projects.pagination.pageSize,
            page: projects.pagination.page,
          }}
          nombreDePage={projects.pageCount}
          titreItems="Projets"
        />
      )}
    </>
  );
};
