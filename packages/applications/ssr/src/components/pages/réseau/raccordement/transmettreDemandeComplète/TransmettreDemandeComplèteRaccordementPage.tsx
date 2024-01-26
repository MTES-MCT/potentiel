import React, { FC, useState } from 'react';
import {
  GestionnaireRéseauSelect,
  GestionnaireRéseauSelectProps,
} from '../modifierGestionnaireRéseau/GestionnaireRéseauSelect';
import {
  FormForProjetPageTemplate,
  FormForProjetPageTemplateProps,
} from '@/components/templates/FormForProjetPageTemplate';
import { TitrePageRaccordement } from '../TitreRaccordement';
import { Form } from '@/components/atoms/form/Form';

import { Routes } from '@potentiel-libraries/routes';
import { useRouter } from 'next/navigation';
import { transmettreDemandeComplèteRaccordementAction } from './transmettreDemandeComplèteRaccordement.action';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import Input from '@codegouvfr/react-dsfr/Input';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Link from 'next/link';

type TransmettreDemandeComplèteRaccordementProps = {
  listeGestionnairesRéseau: GestionnaireRéseauSelectProps['gestionnairesRéseau'];
  identifiantGestionnaireRéseauActuel: string;
  projet: FormForProjetPageTemplateProps['projet'];
  delaiDemandeDeRaccordementEnMois: { texte: string; valeur: number };
};

export const TransmettreDemandeComplèteRaccordementPage: FC<
  TransmettreDemandeComplèteRaccordementProps
> = ({
  listeGestionnairesRéseau,
  identifiantGestionnaireRéseauActuel,
  projet,
  delaiDemandeDeRaccordementEnMois,
}) => {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  const { identifiantProjet } = projet;
  const gestionnaireActuel = listeGestionnairesRéseau.find(
    (gestionnaire) =>
      gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseauActuel,
  );

  const [format, setFormat] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement.format ?? '',
  );
  const [légende, setLégende] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement.légende ?? '',
  );
  const [expressionReguliere, setExpressionReguliere] = useState(
    gestionnaireActuel?.aideSaisieRéférenceDossierRaccordement.expressionReguliere,
  );

  return (
    <FormForProjetPageTemplate
      heading={<TitrePageRaccordement />}
      projet={projet}
      form={
        <Form
          method="POST"
          encType="multipart/form-data"
          action={transmettreDemandeComplèteRaccordementAction}
          heading="Transmettre une demande complète de raccordement"
          onSuccess={() => router.push(Routes.Raccordement.détail(projet.identifiantProjet))}
          onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        >
          <input type="hidden" value={identifiantProjet} />

          <GestionnaireRéseauSelect
            id="identifiantGestionnaireReseau"
            name="identifiantGestionnaireReseau"
            label="Gestionnaire de réseau"
            disabled={gestionnaireActuel ? true : undefined}
            identifiantGestionnaireRéseauActuel={identifiantGestionnaireRéseauActuel}
            gestionnairesRéseau={listeGestionnairesRéseau}
            state={validationErrors.includes('identifiantGestionnaireRéseau') ? 'error' : 'default'}
            onGestionnaireRéseauSelected={({
              aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
            }) => {
              setFormat(format);
              setLégende(légende);
              setExpressionReguliere(expressionReguliere);
            }}
          />

          <Input
            label="Référence du dossier de raccordement du projet *"
            hintText={
              <div>
                {légende && <div>Format attendu : {légende}</div>}
                {format && <div className="italic">Exemple : {format}</div>}
              </div>
            }
            state={validationErrors.includes('referenceDossier') ? 'error' : 'default'}
            nativeInputProps={{
              name: 'referenceDossier',
              required: true,
              'aria-required': true,
              placeholder: format ? `Exemple: ${format}` : `Renseigner l'identifiant`,
              pattern: expressionReguliere || undefined,
              className: 'uppercase placeholder:capitalize',
            }}
          />

          <Input
            label="Date de l'accusé de réception"
            state={validationErrors.includes('dateQualification') ? 'error' : 'default'}
            nativeInputProps={{
              type: 'date',
              name: 'dateQualification',
              max: new Date().toISOString().split('T').shift(),
              required: true,
              'aria-required': true,
            }}
          />

          <Upload
            label="Accusé de réception de la demande complète de raccordement **"
            hint="Vous pouvez transmettre un fichier compressé si il y a plusieurs documents"
            nativeInputProps={{ name: 'accuseReception', required: true, 'aria-required': true }}
            state={validationErrors.includes('accuseReception') ? 'error' : 'default'}
            stateRelatedMessage="Erreur sur le fichier transmis"
          />

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <SubmitButton>Transmettre</SubmitButton>
            <Link href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
              Retour au dossier de raccordement
            </Link>
          </div>
        </Form>
      }
      information={{
        description: (
          <>
            <p>
              <span className="font-bold">* Où trouver la référence de mon dossier ?</span>
              <br />
              Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre
              demande complète de raccordement (
              <a href="https://docs.potentiel.beta.gouv.fr/faq/ou-trouver-la-reference-du-dossier-de-raccordement-de-mon-projet">
                voir un exemple d'accusé de réception
              </a>
              )
            </p>
            <p>
              <span className="font-bold">** Quel document transmettre dans Potentiel ?</span>
              <br />
              Vous devez déposer une demande de raccordement dans les{' '}
              {delaiDemandeDeRaccordementEnMois.texte} ({delaiDemandeDeRaccordementEnMois.valeur})
              mois suivant la date de désignation du projet auprès de votre gestionnaire de réseau.
              <br />
              Votre gestionnaire de réseau vous retourne un{' '}
              <span className="italic">accusé de réception</span> lorsque votre demande de
              raccordement est jugée complète.
              <br />
              Cet accusé de réception transmis sur Potentiel facilitera vos démarches
              administratives avec les différents acteurs connectés à Potentiel (DGEC, DREAL,
              Cocontractant, etc.), il est nécessaire dans le cadre de l’instruction selon les
              cahiers des charges modificatifs et publié le 30/08/2022.
            </p>
          </>
        ),
      }}
    />
  );
};
