import React, { Fragment } from 'react'
import ROUTES from '../../../../routes'
import { Menu, Transition } from '@headlessui/react'
import { PaperClipIcon } from '@heroicons/react/solid'
import { ProjectDataForProjectPage } from '@modules/project'
import { LinkButton } from '../../../components/buttons'
import { userIs } from '@modules/users'
import { User } from '@entities'

type ProjectActionsProps = {
  project: ProjectDataForProjectPage
  user: User
}

export const ProjectActions = ({ project, user }: ProjectActionsProps) => (
  <div className="whitespace-nowrap">
    {userIs(['admin', 'dgec'])(user) && <AdminActions {...{ project }} />}
    {userIs(['porteur-projet'])(user) && <PorteurProjetActions {...{ project }} />}
    {userIs(['dreal'])(user) && <SignalerUnChangement {...{ project }} />}
  </div>
)

type SignalerUnChangementProps = {
  project: ProjectDataForProjectPage
}
const SignalerUnChangement = ({ project }: SignalerUnChangementProps) => (
  <Menu as="div" className="self-stretch relative grow md:grow-0 text-left">
    <Menu.Button className="w-full button-outline primary lg:max-w-fit">
      Signaler un changement
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
      <Menu.Items className="absolute xs:left-0 lg:right-0 w-56 z-10 mt-2 lg:origin-top-right origin-top-left bg-white divide-y divide-gray-400 rounded-md border-solid border border-blue-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item key={`signaler_demande_delai`}>
          <a
            href={ROUTES.ADMIN_SIGNALER_DEMANDE_DELAI_PAGE(project.id)}
            className="no-underline bg-none hover:bg-none"
          >
            <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
              Demande de délai
            </div>
          </a>
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
)

type PorteurProjetActionsProps = {
  project: ProjectDataForProjectPage
}
const PorteurProjetActions = ({ project }: PorteurProjetActionsProps) => (
  <>
    {!project.isClasse && (
      <LinkButton href={ROUTES.DEPOSER_RECOURS(project.id)}>
        Faire une demande de recours
      </LinkButton>
    )}

    {project.notifiedOn && project.certificateFile && (
      <LinkButton
        href={ROUTES.CANDIDATE_CERTIFICATE_FOR_CANDIDATES({
          id: project.id,
          certificateFileId: project.certificateFile.id,
          nomProjet: project.nomProjet,
          potentielIdentifier: project.potentielIdentifier,
        })}
        download
      >
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Télécharger mon attestation
      </LinkButton>
    )}

    {project.isClasse && (
      <Menu as="div" className="self-stretch relative grow md:grow-0 text-left">
        <Menu.Button className="w-full button-outline primary whitespace-nowrap lg:max-w-fit">
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
          <Menu.Items className="absolute xs:left-0 lg:right-0 w-56 z-10 mt-2 lg:origin-top-right origin-top-left bg-white divide-y divide-gray-400 rounded-md border-solid border border-blue-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item key={`action_demande_delai`}>
              <a
                href={ROUTES.DEMANDE_DELAIS(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                  Demander un délai
                </div>
              </a>
            </Menu.Item>
            {project.appelOffre.type !== 'eolien' && (
              <Menu.Item key={`action_changer_producteur`}>
                <a
                  href={ROUTES.CHANGER_PRODUCTEUR(project.id)}
                  className="no-underline bg-none hover:bg-none"
                >
                  <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                    Changer de producteur
                  </div>
                </a>
              </Menu.Item>
            )}
            <Menu.Item key={`action_changer_fournisseur`}>
              <a
                href={ROUTES.CHANGER_FOURNISSEUR(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                  Changer de fournisseur
                </div>
              </a>
            </Menu.Item>
            <Menu.Item key={`action_changer_actionnaire`}>
              <a
                href={ROUTES.CHANGER_ACTIONNAIRE(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                  Changer d'actionnaire
                </div>
              </a>
            </Menu.Item>
            <Menu.Item key={`action_changer_puissance`}>
              <a
                href={ROUTES.CHANGER_PUISSANCE(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                  Changer de puissance
                </div>
              </a>
            </Menu.Item>
            <Menu.Item key={`action_demande_abandon`}>
              <a
                href={ROUTES.DEMANDER_ABANDON(project.id)}
                className="no-underline bg-none hover:bg-none"
              >
                <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                  Demander un abandon
                </div>
              </a>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    )}
  </>
)

type AdminActionsProps = {
  project: ProjectDataForProjectPage
}
const AdminActions = ({ project }: AdminActionsProps) => (
  <div className="flex flex-col xl:flex-row gap-2 items-center">
    <SignalerUnChangement {...{ project }} />

    {project.notifiedOn && project.certificateFile ? (
      <LinkButton
        href={ROUTES.CANDIDATE_CERTIFICATE_FOR_ADMINS({
          id: project.id,
          certificateFileId: project.certificateFile.id,
          email: project.email,
          potentielIdentifier: project.potentielIdentifier,
        })}
        download
        primary
      >
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Voir attestation
      </LinkButton>
    ) : (
      <LinkButton href={ROUTES.PREVIEW_CANDIDATE_CERTIFICATE(project)} download primary>
        <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
        Aperçu attestation
      </LinkButton>
    )}
  </div>
)
