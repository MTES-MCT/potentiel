import React from 'react'
import { dataId } from '../../../../helpers/testId'

interface FriseProps {
  children: React.ReactNode
  displayToggle: boolean
}

export const Frise = ({ children, displayToggle }: FriseProps) => (
  <table
    className="frise"
    style={{ borderCollapse: 'collapse', marginBottom: 20 }}
  >
    <thead>
      <tr>
        <td style={{ width: 16 }} />
        <td style={{ width: 16 }} />
        <td />
        <td />
        <td />
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          style={{
            position: 'relative',
            borderRight: '2px solid var(--lighter-grey)',
            height: 10,
          }}
        ></td>
        <td></td>
      </tr>
      {children}
      {displayToggle ? (
        <tr>
          <td
            style={{
              position: 'relative',
              borderRight: '2px solid var(--lighter-grey)',
            }}
          ></td>
          <td></td>
          <td colSpan={3} style={{ paddingLeft: 5 }}>
            <a
              className="frise--toggle-show"
              href="#"
              {...dataId('frise-show-timeline')}
            >
              Afficher les étapes suivantes
            </a>
            <a
              className="frise--toggle-hide"
              href="#"
              {...dataId('frise-hide-timeline')}
            >
              Masquer les étapes à venir
            </a>
          </td>
        </tr>
      ) : (
        ''
      )}
    </tbody>
  </table>
)