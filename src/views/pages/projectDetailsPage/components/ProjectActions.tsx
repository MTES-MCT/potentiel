import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, PaperClipIcon } from '@heroicons/react/solid'
import { UserRole } from '../../../../modules/users'
import { ACTION_BY_ROLE } from '../../../components'
import { dataId } from '../../../../helpers/testId'

interface Props {
  project: {
    id: string
    isClasse: boolean
    isAbandoned: boolean
    notifiedOn?: Date
    certificateFile?: {
      id: string
      filename: string
    }
    appelOffreId: string
    periodeId: string
    familleId: string | undefined
    numeroCRE: string
    email: string
    nomProjet: string
    gf?: {
      id: string
      status: 'à traiter' | 'validé'
    }
  }
  role: UserRole
}

export default function ProjectActions({ project, role }: Props) {
  if (!project || !role) {
    return <div />
  }

  const actions = ACTION_BY_ROLE[role]?.call(null, project)

  if (!actions || !actions.length) {
    return <div />
  }

  const downloadAction = actions.find((action) => action.isDownload)

  const displayedActions = actions.filter((item) => !item.disabled && !item.isDownload)
  return (
    <div className="flex flex-wrap grow-0 justify-end gap-3">
      {displayedActions.length === 1 ? (
        <a
          href={displayedActions[0].link}
          className="button-outline primary text-center inline-block pl-0 grow self-start lg:max-w-fit"
        >
          {displayedActions[0].title}
        </a>
      ) : null}
      {displayedActions.length > 1 ? (
        <Menu as="div" className="relative inline-block text-left ">
          <div>
            <Menu.Button className="w-full button-outline primary grow lg:max-w-fit self-start">
              Faire une demande
            </Menu.Button>
          </div>
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
              <div className="">
                {displayedActions.map(
                  ({ title, actionId, projectId, link, disabled, isDownload }, actionIndex) => (
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href={link}
                          download={isDownload}
                          data-actionid={actionId}
                          data-projectid={projectId}
                          {...dataId('item-action')}
                          className="no-underline bg-none hover:bg-none"
                        >
                          <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                            {title}
                          </div>
                        </a>
                      )}
                    </Menu.Item>
                  )
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      ) : null}
      {downloadAction ? (
        <a
          href={downloadAction.link}
          className="button inline-block pl-1 grow text-center lg:max-w-fit self-start"
          style={{ marginTop: 0, marginRight: 0 }}
        >
          <PaperClipIcon className="h-5 w-5 align-middle mr-2" />
          {downloadAction.title}
        </a>
      ) : null}
    </div>
  )
}
