import React from 'react'
import { dataId } from '../../../../helpers/testId'


interface Action {
  title: string
  link?: string
  download?: true
  openHiddenContent?: true
  confirm?: string
}

interface FriseItemProps {
  date?: string
  title: string
  action?: Action | Action[]
  hiddenContent?: React.ReactNode
  defaultHidden?: boolean
  status?: 'nextup' | 'past' | 'future'
}
export const FriseItem = ({
  defaultHidden,
  date,
  title,
  action,
  hiddenContent,
  status = 'future',
}: FriseItemProps) => {
  const actions =
    typeof action === 'undefined'
      ? undefined
      : Array.isArray(action)
      ? action
      : [action]
  return (
    <>
      <tr
        {...dataId('frise-item')}
        className={'frise--item' + (defaultHidden ? ' frise--collapsed' : '')}
      >
        <td
          style={{
            position: 'relative',
            borderRight: '2px solid var(--lighter-grey)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: 3,
              width: 26,
              height: 26,
              textAlign: 'center',
            }}
          >
            {status === 'past' ? (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : status === 'nextup' ? (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="var(--blue)"
                viewBox="0 0 24 24"
                {...(actions &&
                actions.some((action) => action.openHiddenContent)
                  ? {
                      ...dataId('frise-action'),
                      className: 'frise-content-toggle',
                    }
                  : {})}
              >
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg
                fill="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                width="20"
                height="20"
                stroke="var(--light-grey)"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
          </div>
        </td>
        <td></td>
        <td style={{ padding: '0 5px', fontStyle: 'italic' }}>{date || ''}</td>
        <td
          style={{ padding: '0 5px' }}
          {...dataId('frise-title')}
          data-status={status}
        >
          {title}
        </td>
        <td>
          {actions ? (
            <>
              {actions.map((action, index) =>
                action.link ? (
                  <a
                    key={'action_' + index}
                    href={action.link}
                    {...dataId('frise-action')}
                    download={action.download}
                    style={{ marginRight: 10 }}
                    data-confirm={action.confirm}
                  >
                    {action.title}
                  </a>
                ) : action.openHiddenContent ? (
                  <a
                    key={'action_' + index}
                    {...dataId('frise-action')}
                    className="frise-content-toggle"
                    style={{ marginRight: 10 }}
                  >
                    {action.title}
                  </a>
                ) : (
                  <span
                    key={'action_' + index}
                    className="disabled-action"
                    style={{ marginRight: 10 }}
                  >
                    {action.title}
                  </span>
                )
              )}
            </>
          ) : (
            ''
          )}
        </td>
      </tr>
      {hiddenContent ? (
        <tr {...dataId('frise-hidden-content')} className="hidden">
          <td
            style={{
              position: 'relative',
              borderRight: '2px solid var(--lighter-grey)',
            }}
          ></td>
          <td></td>
          <td></td>
          <td colSpan={2} style={{ padding: '20px 5px 60px' }}>
            {hiddenContent}
          </td>
        </tr>
      ) : null}
    </>
  )
}