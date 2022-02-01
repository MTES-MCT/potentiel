import React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
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

export default function Example({ project, role }: Props) {
  if (!project || !role) {
    return <div />
  }

  const actions = ACTION_BY_ROLE[role]?.call(null, project)

  if (!actions || !actions.length) {
    return <div />
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="w-full button-outline primary">Actions</Menu.Button>
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
        <Menu.Items className="absolute right-0 w-56 z-10 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md border-solid border border-blue-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="">
            {actions.map(
              ({ title, actionId, projectId, link, disabled, isDownload }, actionIndex) => (
                <Menu.Item>
                  {({ active }) => (
                    <div className={'text-center rounded-md w-full py-2 hover:bg-slate-100'}>
                      {disabled ? (
                        <i>{title}</i>
                      ) : (
                        <a
                          href={link}
                          download={isDownload}
                          data-actionid={actionId}
                          data-projectid={projectId}
                          {...dataId('item-action')}
                          className="no-underline bg-none hover:bg-none"
                        >
                          {title}
                        </a>
                      )}
                    </div>
                  )}
                </Menu.Item>
              )
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
