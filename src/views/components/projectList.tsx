import React from 'react'

import { Project } from '../../entities'
import ROUTES from '../../routes'

const ProjectList = ({ projects }: { projects?: Array<Project> }) => {
  return (
    <div>
      <h3>Projets</h3>
      <input
        type="text"
        className="table__filter"
        placeholder="Filtrer les projets"
      />
      <a
        className="button-outline primary"
        style={{
          float: 'right',
          marginBottom: 'var(--space-s)',
          marginTop: '5px',
          marginRight: '15px'
        }}
        href={ROUTES.SEND_NOTIFICATIONS_ACTION}
      >
        Envoyer les notifications aux candidats
      </a>
      {projects && projects.length ? (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Projet</th>
                <th>Candidat</th>
                <th>Puissance</th>
                <th>Prix</th>
                <th>Evaluation Carbone</th>
                <th>Classé</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr>
                  <td valign="top">
                    <div>{project.periode}</div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12
                      }}
                    >
                      famille {project.famille}
                    </div>
                  </td>
                  <td valign="top">
                    <div>{project.nomProjet}</div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12
                      }}
                    >
                      {project.communeProjet}, {project.departementProjet},{' '}
                      {project.regionProjet}
                    </div>
                  </td>
                  <td valign="top">
                    <div>{project.nomCandidat}</div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12
                      }}
                    >
                      {project.nomRepresentantLegal} {project.email}
                    </div>
                  </td>
                  <td valign="top">
                    {project.puissance}{' '}
                    <span
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12
                      }}
                    >
                      kWc
                    </span>
                  </td>
                  <td valign="top">
                    {project.prixReference}{' '}
                    <span
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12
                      }}
                    >
                      €/MWh
                    </span>
                  </td>
                  <td valign="top">
                    {project.evaluationCarbone}{' '}
                    <span
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12
                      }}
                    >
                      kg eq CO2/kWc
                    </span>
                  </td>
                  <td
                    valign="top"
                    className={
                      'notification ' +
                      (project.classe === 'Classé' ? 'success' : 'error')
                    }
                  >
                    <div>{project.classe}</div>
                    {project.motifsElimination ? (
                      <div
                        style={{
                          fontStyle: 'italic',
                          lineHeight: 'normal',
                          fontSize: 12
                        }}
                      >
                        {project.motifsElimination}
                      </div>
                    ) : (
                      ''
                    )}
                  </td>
                  <td style={{ position: 'relative' }}>
                    <img
                      src="/images/icons/external/more.svg"
                      height="12"
                      width="12"
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      className="project-list--action-trigger"
                    />
                    <ul className="project-list--action-menu">
                      <li>
                        <a
                          href={
                            ROUTES.NOTIFICATION_EMAIL +
                            '?projectId=' +
                            project.id
                          }
                        >
                          Voir notification
                        </a>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="pagination">
            <div className="pagination__display-group">
              <label
                htmlFor="pagination__display"
                className="pagination__display-label"
              >
                Projets par page
              </label>
              <select className="pagination__display" id="pagination__display">
                <option>5</option>
                <option>10</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div className="pagination__count">
              <strong>{projects?.length}</strong> sur{' '}
              <strong>{projects?.length}</strong>
            </div>
            <ul className="pagination__pages" style={{ display: 'none' }}>
              <li className="disabled">
                <a>❮ Précédent</a>
              </li>
              <li className="active">
                <a>1</a>
              </li>
              <li>
                <a>2</a>
              </li>
              <li>
                <a>3</a>
              </li>
              <li>
                <a>4</a>
              </li>
              <li className="disabled">
                <a>5</a>
              </li>
              <li>
                <a>Suivant ❯</a>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <table className="table">
          <tbody>
            <tr>
              <td>Il n'y a pas encore de projets en base</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProjectList
