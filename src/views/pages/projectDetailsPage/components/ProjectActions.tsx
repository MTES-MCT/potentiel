import { LinkButton } from '@components'
import { User } from '@entities'
import { Menu, Transition } from '@headlessui/react'
import { InboxInIcon, PaperClipIcon } from '@heroicons/react/solid'
import { ProjectDataForProjectPage } from '@modules/project'
import { userIs } from '@modules/users'
import routes from '@routes'
import React, { Fragment } from 'react'

type ProjectActionsProps = {
  project: ProjectDataForProjectPage
  user: User
}

type EnregistrerUneModificationProps = {
  project: ProjectDataForProjectPage
}

const EnregistrerUneModification = ({ project }: EnregistrerUneModificationProps) => (
  <Menu as="div" className="self-stretch relative grow md:grow-0 text-left mx-auto">
    <Menu.Button className="inline-flex w-full items-center px-6 py-2 border border-solid text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base">
      Enregistrer une modification
    </Menu.Button>
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute w-full z-10 lg:origin-top-right origin-top-left bg-white divide-y divide-gray-400 border-solid border border-blue-france-sun-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-t-0">
        <Menu.Item key={`signaler_demande_delai`}>
          <a
            href={routes.ADMIN_SIGNALER_DEMANDE_DELAI_PAGE(project.id)}
            className="no-underline bg-none hover:bg-none"
          >
            <div
              className={
                'text-center rounded-md w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
              }
            >
              Demande de délai
            </div>
          </a>
        </Menu.Item>
        <Menu.Item key={`signaler_demande_abandon`}>
          <a
            href={routes.ADMIN_SIGNALER_DEMANDE_ABANDON_PAGE(project.id)}
            className="no-underline bg-none hover:bg-none"
          >
            <div
              className={
                'text-center rounded-md w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
              }
            >
              Demande d'abandon
            </div>
          </a>
        </Menu.Item>
        {getProjectStatus(project) === 'éliminé' && (
          <Menu.Item key={`signaler_demande_recours`}>
            <a
              href={routes.ADMIN_SIGNALER_DEMANDE_RECOURS_PAGE(project.id)}
              className="no-underline bg-none hover:bg-none"
            >
              <div
                className={
                  'text-center rounded-md w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                }
              >
                Demande de recours
              </div>
            </a>
          </Menu.Item>
        )}
      </Menu.Items>
    </Transition>
  </Menu>
)

const getProjectStatus = (project: ProjectDataForProjectPage) =>
  !project.notifiedOn
    ? 'non-notifié'
    : project.isAbandoned
    ? 'abandonné'
    : project.isClasse
    ? 'lauréat'
    : 'éliminé'

type PorteurProjetActionsProps = {
  project: ProjectDataForProjectPage
}
const PorteurProjetActions = ({ project }: PorteurProjetActionsProps) => (
  <div className="flex flex-col xl:flex-row gap-2">
    {!project.isClasse && (
      <LinkButton href={routes.DEPOSER_RECOURS(project.id)}>
        Faire une demande de recours
      </LinkButton>
    )}

    {project.isClasse && (
      <Menu as="div" className="m-auto self-stretch relative grow md:grow-0 text-left">
        <Menu.Button className="inline-flex items-center px-6 py-2 border border-solid text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base">
          <InboxInIcon className="h-5 w-5 align-middle mr-2" />
          Faire une demande
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            style={{ width: 216.76 }}
            className="absolute xs:left-0 lg:right-0 z-10 lg:origin-top-right origin-top-left bg-white divide-y divide-gray-400 border-solid border border-blue-france-sun-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border-t-0"
          >
            <Menu.Item key={`action_demande_delai`}>
              <a
                href={routes.DEMANDER_DELAI(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div
                  className={
                    'text-center w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                  }
                >
                  Demander un délai
                </div>
              </a>
            </Menu.Item>
            {project.appelOffre.type !== 'eolien' && (
              <Menu.Item key={`action_changer_producteur`}>
                <a
                  href={routes.CHANGER_PRODUCTEUR(project.id)}
                  className="no-underline bg-none hover:bg-none"
                >
                  <div
                    className={
                      'text-center w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                    }
                  >
                    Changer de producteur
                  </div>
                </a>
              </Menu.Item>
            )}
            <Menu.Item key={`action_changer_fournisseur`}>
              <a
                href={routes.CHANGER_FOURNISSEUR(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div
                  className={
                    'text-center w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                  }
                >
                  Changer de fournisseur
                </div>
              </a>
            </Menu.Item>
            <Menu.Item key={`action_changer_actionnaire`}>
              <a
                href={routes.CHANGER_ACTIONNAIRE(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div
                  className={
                    'text-center w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                  }
                >
                  Changer d'actionnaire
                </div>
              </a>
            </Menu.Item>
            <Menu.Item key={`action_changer_puissance`}>
              <a
                href={routes.CHANGER_PUISSANCE(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div
                  className={
                    'text-center w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                  }
                >
                  Changer de puissance
                </div>
              </a>
            </Menu.Item>
            <Menu.Item key={`action_demande_abandon`}>
              <a
                href={routes.DEMANDER_ABANDON(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div
                  className={
                    'text-center w-full py-2 hover:bg-blue-france-975-base focus:bg-blue-france-975-base text-blue-france-sun-base'
                  }
                >
                  Demander un abandon
                </div>
              </a>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    )}

    {project.notifiedOn && project.certificateFile && (
      <LinkButton
        href={routes.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
          id: project.id,
          certificateFileId: project.certificateFile.id,
          nomProjet: project.nomProjet,
          potentielIdentifier: project.potentielIdentifier,
        })}
        download
        primary={true}
        className="m-auto"
      >
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Télécharger mon attestation
      </LinkButton>
    )}
  </div>
)

type AdminActionsProps = {
  project: ProjectDataForProjectPage
}
const AdminActions = ({ project }: AdminActionsProps) => (
  <div className="flex flex-col md:flex-row gap-2">
    <EnregistrerUneModification {...{ project }} />

    {project.notifiedOn && project.certificateFile ? (
      <LinkButton
        href={routes.CANDIDATE_CERTIFICATE_FOR_ADMINS({
          id: project.id,
          certificateFileId: project.certificateFile.id,
          email: project.email,
          potentielIdentifier: project.potentielIdentifier,
        })}
        download
        primary
        className="m-auto"
      >
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Voir attestation
      </LinkButton>
    ) : (
      !project.isLegacy && (
        <LinkButton
          href={routes.PREVIEW_CANDIDATE_CERTIFICATE(project)}
          download
          primary
          className="m-auto"
        >
          <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
          Aperçu attestation
        </LinkButton>
      )
    )}
  </div>
)

export const ProjectActions = ({ project, user }: ProjectActionsProps) => (
  <div className="whitespace-nowrap">
    {userIs(['admin', 'dgec'])(user) && <AdminActions {...{ project }} />}
    {userIs(['porteur-projet'])(user) && <PorteurProjetActions {...{ project }} />}
    {userIs(['dreal'])(user) && <EnregistrerUneModification {...{ project }} />}
  </div>
)
