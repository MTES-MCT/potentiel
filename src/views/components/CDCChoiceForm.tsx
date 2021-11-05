import React from 'react'
import { dataId } from '../../helpers/testId'

const CDCChoiceForm = ({project, cahiersChargesURLs}) => {
    return (
        <div>
            <p>
                Pour plus d'informations sur les modalités d'instruction veuillez consulter cette &nbsp;
                <a 
                  href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-faire-une-demande-de-modification-ou-informer-le-prefet-dun-changement"
                  target='_blank'
                >
                  page d'aide &nbsp;
                  <img 
                    src="/images/icons/external/external-link-alt-solid.svg"
                    style={{width: 12, height: 12}}
                    alt="Ouvrir dans un nouvel onglet"
                  >
                  </img>
                </a>
                .
            </p>
            {!project.newRulesOptIn && (
                <>
                    <div style={{border: "1px solid #adb9c9", padding: 20, borderRadius: 3, marginBottom: 15}}>
                        <div className="inline-radio-option">
                            <input
                                type="radio"
                                name="newRulesOptIn"
                                value="Anciennes règles"
                                {...dataId('modificationRequest-oldRules')}
                                disabled={project.newRulesOptIn}
                                defaultChecked={!project.newRulesOptIn}
                            />
                            <label htmlFor="Anciennes règles" style={{flex: 1}}>
                                <strong>Instruction selon les dispositions du cahier des charges en vigueur au moment de
                                la candidature &nbsp;</strong>
                                {cahiersChargesURLs?.oldCahierChargesURL && (
                                <a href={cahiersChargesURLs?.oldCahierChargesURL}>
                                    (voir le cahier des charges)
                                </a>
                                )}.
                            </label>
                        </div>
                        <div>
                            <ul>
                                <li style={{listStyleImage: 'URL(/images/icons/external/arrow-right.svg)'}}>Je dois envoyer ma demande ou mon signalement au format papier.</li>
                                <li style={{listStyleImage: 'URL(/images/icons/external/arrow-right.svg)'}}>Je pourrai changer de mode d'instruction lors de ma prochaine demande si je le souhaite.</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
            <div style={{border: "1px solid #adb9c9", padding: 20, borderRadius: 3, marginBottom: 15}}>
                <div className="inline-radio-option">
                    {!project.newRulesOptIn && (
                        <input
                            type="radio"
                            name="newRulesOptIn"
                            value="Nouvelles règles"
                            defaultChecked={project.newRulesOptIn}
                            {...dataId('modificationRequest-newRules')}
                            disabled={project.newRulesOptIn}
                        />
                    )}

                    <label htmlFor="Nouvelles règles" style={{flex: 1}}>
                    <strong>Instruction selon le cahier des charges modifié rétroactivement et publié le 30/07/2021, 
                    pris en application du décret n° 2019-1175 du 14 novembre 2019&nbsp;</strong>
                        {cahiersChargesURLs?.newCahierChargesURL && (
                        <a href={cahiersChargesURLs?.newCahierChargesURL}>(voir le cahier des charges)</a>
                        )}.
                    </label>
                </div>
                <div>
                  <ul>
                    <li style={{listStyleImage: 'URL(/images/icons/external/arrow-right.svg)'}}>Ce choix s'appliquera à toutes les futures demandes faites sous Potentiel.</li>
                    <li style={{listStyleImage: 'URL(/images/icons/external/arrow-right.svg)'}}>Une modification ultérieure pourra toujours être instruite selon le cahier des
                        charges en vigueur au moment du dépôt de l'offre, à condition qu'elle soit soumise
                        au format papier en précisant ce choix.</li>
                  </ul>
                </div>
            </div>
        </div>  
    )
}

export default CDCChoiceForm