import React, { useState } from 'react';
import {
  AlertBox,
  PrimaryButton,
  Input,
  Checkbox,
  Label,
  Table,
  Td,
  Th,
  Form,
  Pagination,
} from ".";
import { logger } from '../../core/utils';
import { Project, User } from '../../entities';
import routes from '../../routes';
import { PaginatedList } from '../../modules/pagination';

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
    <Td className="align-top missingOwnerProjectList-projet-column">
      <div>{project.nomProjet}</div>
      <div className="italic text-xs">
        <div>{project.departementProjet}</div>
        <div>{project.nomCandidat}</div>
        <div>
          {project.appelOffreId} - {project.periodeId}
        </div>
      </div>
    </Td>
  ),
  Candidat: ({ project }) => (
    <Td className="align-top projectList-candidat-column">
      <div>{project.nomCandidat}</div>
      <div className="italic text-xs">
        <span>{project.nomRepresentantLegal}</span> <span>{project.email}</span>
      </div>
    </Td>
  ),
  Puissance: ({ project }) => (
    <Td className="align-top projectList-puissance-column">
      <span>{project.puissance}</span>{' '}
      <span className="italic text-xs">{project.appelOffre?.unitePuissance}</span>
    </Td>
  ),
  Region: ({ project }) => (
    <Td className="align-top projectList-puissance-column">
      <span>{project.regionProjet}</span>{' '}
    </Td>
  ),
  'Projet pre-affecte': ({ project, email }) => (
    <Td className="align-top projectList-projet-pre-affecte-column">
      <span>{project.email === email ? 'Oui' : 'Non'}</span>
    </Td>
  ),
  'N° CRE': ({ project, email }) =>
    email !== project.email ? (
      <Td className="align-top projectList-numero-cre-column">
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
      </Td>
    ) : (
      <Td>--</Td>
    ),
  Prix: ({ project, email }) =>
    email !== project.email ? (
      <Td className="align-top projectList-prix-column">
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
      </Td>
    ) : (
      <Td>--</Td>
    ),
  'Attestation de designation': ({ project, email }) =>
    email !== project.email ? (
      <Td className="align-top projectList-attestation-designation-column">
        <Label htmlFor={`attestation-designation|${project.id}`} className="mb-1">
          Ajouter l'attestation de désignation
        </Label>
        <Input
          type="file"
          id={`attestation-designation|${project.id}`}
          name={`attestation-designation|${project.id}`}
          className="min-w-[110px]"
        />
      </Td>
    ) : (
      <Td>--</Td>
    ),
};

type Props = {
  projects: PaginatedList<Project> | Array<Project>;
  displayColumns: Array<string>;
  user: User;
  currentUrl: string;
};

export const MissingOwnerProjectList = ({ projects, displayColumns, user, currentUrl }: Props) => {
  const { email } = user;

  let items: Array<Project>;
  if (Array.isArray(projects)) {
    items = projects;
  } else {
    items = projects.items;
  }

  const [selectedProjectList, setSelectedProjectList] = useState<string[]>([]);
  const [swornStatement, setSwornStatement] = useState(false);

  const séléctionnerUnProjet =
    (projetId: string): React.ChangeEventHandler<HTMLInputElement> =>
    (event) => {
      if (event.target.checked) {
        setSelectedProjectList([...selectedProjectList, projetId]);
        return;
      }
      setSelectedProjectList([...selectedProjectList].filter((selected) => selected !== projetId));
    };

  return (
    <>
      <Form
        action={routes.USER_CLAIM_PROJECTS}
        encType="multipart/form-data"
        className="!max-w-full"
        method="post"
      >
        <Table>
          <thead>
            <tr>
              <Th></Th>
              {displayColumns?.map((column) => (
                <Th key={column}>{column}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((project) => {
              return (
                <tr key={`project_${project.id}`}>
                  <Td>
                    <Checkbox
                      value={project.id}
                      id={project.id}
                      checked={selectedProjectList.includes(project.id)}
                      onChange={séléctionnerUnProjet(project.id)}
                    />
                  </Td>
                  {displayColumns?.map((column) => {
                    const Column = ColumnComponent[column];
                    if (!Column) {
                      logger.error(`Column ${column} could not be found`);
                      return <Td></Td>;
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
        </Table>

        <input type="hidden" name="projectIds" value={selectedProjectList} />

        <AlertBox className="my-4">
          <>
            <Checkbox
              name="swornStatement"
              id="swornStatement"
              onChange={() => setSwornStatement(!swornStatement)}
            >
              J'atteste sur l'honneur que je suis bien la personne désignée pour suivre le/les
              projet(s) sélectionné(s). En cas de fausse déclaration, je m'expose à un risque de
              poursuites judiciaires.
            </Checkbox>
            {selectedProjectList.length > 0 && swornStatement && (
              <PrimaryButton type="submit" name="submit" id="submit" className="my-4">
                Réclamer la propriété{' '}
                {selectedProjectList.length === 1
                  ? 'du project séléctionné'
                  : `des ${selectedProjectList.length} projets séléctionnés`}
              </PrimaryButton>
            )}
          </>
        </AlertBox>
      </Form>

      {!Array.isArray(projects) && (
        <Pagination
          currentPage={projects.pagination.page}
          pageCount={projects.pageCount}
          currentUrl={currentUrl}
        />
      )}
    </>
  );
};
