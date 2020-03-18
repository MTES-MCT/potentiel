import React from 'react'

import { Project } from '../../entities'

import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'

interface PageProps {
  action: string
  project: Project
  error?: string
  success?: string
}

const titlePerAction = {
  fournisseur: 'un changement de fournisseur',
  delais: 'un délais supplémentaire',
  actionnaire: "un changement d'actionnaire",
  puissance: 'un changement de puissance',
  abandon: "l'abandon de mon projet"
}

/* Pure component */
export default function ModificationRequestPage({
  action,
  project,
  error,
  success
}: PageProps) {
  return (
    <>
      <div className="hero" role="banner">
        <div className="hero__container" style={{ minHeight: '10em' }}>
          <h1>Portail Porteur de Projet</h1>
        </div>
      </div>
      <main role="main">
        <section className="section section-white">
          <div className="container">
            <form
              action={ROUTES.IMPORT_PROJECTS_ACTION}
              method="post"
              encType="multipart/form-data"
            >
              <div className="form__group">
                <h4>Je demande {titlePerAction[action]}</h4>
                <div style={{ marginBottom: 5 }}>Concerant le projet:</div>
                <div
                  className="text-quote"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    marginBottom: 10
                  }}
                >
                  <div {...dataId('modificationRequest-item-nomProjet')}>
                    {project.nomProjet}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12
                    }}
                  >
                    <span {...dataId('modificationRequest-item-communeProjet')}>
                      {project.communeProjet}
                    </span>
                    ,{' '}
                    <span
                      {...dataId('modificationRequest-item-departementProjet')}
                    >
                      {project.departementProjet}
                    </span>
                    ,{' '}
                    <span {...dataId('modificationRequest-item-regionProjet')}>
                      {project.regionProjet}
                    </span>
                  </div>
                </div>
                {error ? (
                  <div
                    className="notification error"
                    {...dataId('modificationRequest-errorMessage')}
                  >
                    {error}
                  </div>
                ) : (
                  ''
                )}
                {success ? (
                  <div
                    className="notification success"
                    {...dataId('modificationRequest-successMessage')}
                  >
                    {success}
                  </div>
                ) : (
                  ''
                )}
                {action === 'puissance' ? (
                  <>
                    <label>Puissance actuelle (en kWc)</label>
                    <input type="number" disabled value={project.puissance} />
                    <label className="required" htmlFor="puissance">
                      Nouvelle puissance (en kWc)
                    </label>
                    <input
                      type="number"
                      name="puissance"
                      id="puissance"
                      {...dataId('modificationRequest-puissanceField')}
                    />
                  </>
                ) : (
                  ''
                )}
                {action === 'fournisseur' ? (
                  <>
                    <label>Ancien fournisseur</label>
                    <input type="text" disabled value={project.fournisseur} />
                    <label className="required" htmlFor="fournisseur">
                      Nouveau fournisseur
                    </label>
                    <input
                      type="text"
                      name="fournisseur"
                      id="fournisseur"
                      {...dataId('modificationRequest-fournisseurField')}
                    />
                  </>
                ) : (
                  ''
                )}
                {action === 'actionnaire' ? (
                  <>
                    <label>Ancien actionnaire</label>
                    <input type="text" disabled value={project.actionnaire} />
                    <label className="required" htmlFor="actionnaire">
                      Nouvel actionnaire
                    </label>
                    <input
                      type="text"
                      name="actionnaire"
                      id="actionnaire"
                      {...dataId('modificationRequest-actionnaireField')}
                    />
                  </>
                ) : (
                  ''
                )}
                {action === 'delais' || action === 'abandon' ? (
                  <>
                    <label className="required" htmlFor="motivation">
                      Pour la raison suivante:
                    </label>
                    <textarea
                      name="motivation"
                      id="motivation"
                      {...dataId('modificationRequest-motivation-field')}
                    />
                  </>
                ) : (
                  ''
                )}

                <label htmlFor="candidats">Pièce jointe (si nécessaire)</label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-file-field')}
                  id="file"
                />
                <button
                  className="button"
                  type="submit"
                  name="submit"
                  id="submit"
                  {...dataId('modificationRequest-submit-button')}
                >
                  Envoyer
                </button>
                <a
                  className="button-outline primary"
                  // style={{
                  //   float: 'right',
                  //   marginBottom: 'var(--space-s)',
                  //   marginTop: '5px',
                  //   marginRight: '15px'
                  // }}
                  {...dataId('modificationRequest-cancel-button')}
                  href={ROUTES.USER_LIST_PROJECTS}
                >
                  Annuler
                </a>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}
