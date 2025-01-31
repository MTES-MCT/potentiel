import React, { useState } from 'react';
import toNumber from '../../../../helpers/toNumber';
import { isStrictlyPositiveNumber } from '../../../../helpers/formValidators';
import {
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
  exceedsPuissanceMaxFamille,
} from '../../../../modules/demandeModification';
import {
  ErrorBox,
  Input,
  Label,
  TextArea,
  ChampsObligatoiresLégende,
  LabelDescription,
  Callout,
  AlertBox,
  InputFile,
} from '../../../components';
import { AlertePuissanceMaxDepassee } from './AlertePuissanceMaxDepassee';
import { AlertePuissanceHorsRatios } from './AlertePuissanceHorsRatios';
import { ProjectAppelOffre, parseCahierDesChargesRéférence } from '../../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { AlertePuissanceFourchetteRatioInitialEtCDC2022 } from './AlertePuissanceFourchetteRatioInitialEtCDC2022';

export type ChangementPuissanceProps = {
  unitePuissance: string;
  puissance: number;
  puissanceInitiale: number;
  justification: string;
  cahierDesChargesActuel: string;
  appelOffre: ProjectAppelOffre;
  technologie: AppelOffre.Technologie;
  puissanceSaisie?: number;
  désignationCatégorie?: 'volume-réservé' | 'hors-volume-réservé';
  familleId: string | undefined;
  onUpdateEtatFormulaire: (bloquerEnvoi: boolean) => void;
};

export const ChangementPuissance = ({
  puissance,
  justification,
  puissanceInitiale,
  cahierDesChargesActuel,
  appelOffre,
  technologie,
  puissanceSaisie,
  désignationCatégorie,
  familleId,
  onUpdateEtatFormulaire,
}: ChangementPuissanceProps) => {
  const [displayAlertOnPuissanceType, setDisplayAlertOnPuissanceType] = useState(false);
  const [displayAlertHorsRatios, setDisplayAlertHorsRatios] = useState(false);
  const [puissanceMaxVolumeReservéDépassée, setPuissanceMaxVolumeReservéDépassée] = useState(false);
  const [puissanceMaxFamilleDépassée, setPuissanceMaxFamilleDépassée] = useState(false);
  const [fichierEtJustificationRequis, setFichierEtJustificationRequis] = useState(false);
  const [
    displayAlertOnPuissancebetweenInitialAndCDC2022Ratios,
    setDisplayAlertOnPuissancebetweenInitialAndCDC2022Ratios,
  ] = useState(false);

  const handlePuissanceOnChange = (e) => {
    const isNewValueCorrect = isStrictlyPositiveNumber(e.target.value);
    const nouvellePuissance = toNumber(e.target.value);
    const exceedsActualCDCRatios = exceedsRatiosChangementPuissance({
      project: {
        puissanceInitiale,
        appelOffre,
        technologie,
        cahierDesCharges: parseCahierDesChargesRéférence(cahierDesChargesActuel),
      },
      nouvellePuissance,
    });
    const exceedInitialCDCRatio = exceedsRatiosChangementPuissance({
      project: {
        puissanceInitiale,
        appelOffre,
        technologie,
        cahierDesCharges: { type: 'initial' },
      },
      nouvellePuissance,
    });
    const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({
      project: { appelOffre, désignationCatégorie },
      nouvellePuissance,
    });
    const exceedsPuissanceMaxdeLaFamille = exceedsPuissanceMaxFamille({
      project: { appelOffre, familleId },
      nouvellePuissance,
    });
    setDisplayAlertOnPuissanceType(!isNewValueCorrect);
    setPuissanceMaxFamilleDépassée(exceedsPuissanceMaxdeLaFamille);
    setDisplayAlertHorsRatios(exceedsActualCDCRatios);
    setPuissanceMaxVolumeReservéDépassée(exceedsPuissanceMax);
    setFichierEtJustificationRequis(exceedsActualCDCRatios || exceedsPuissanceMax);
    setDisplayAlertOnPuissancebetweenInitialAndCDC2022Ratios(
      exceedInitialCDCRatio && !exceedsActualCDCRatios,
    );

    onUpdateEtatFormulaire(exceedsPuissanceMax || exceedsPuissanceMaxdeLaFamille);
  };

  const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(cahierDesChargesActuel);

  const puissanceMaxFamille = appelOffre.periode.familles.find(
    (f) => f.id === familleId,
  )?.puissanceMax;

  return (
    <>
      <Callout>
        <>
          <div>
            Puissance à la notification :{' '}
            <span className="font-bold">
              {puissanceInitiale} {appelOffre.unitePuissance}
            </span>
          </div>

          {puissance !== puissanceInitiale && (
            <div>
              Puissance actuelle :{' '}
              <span className="font-bold">
                {puissance} {appelOffre.unitePuissance}
              </span>
            </div>
          )}
        </>
      </Callout>

      <ChampsObligatoiresLégende />

      <div>
        <Label htmlFor="puissance">Nouvelle puissance (en {appelOffre?.unitePuissance})</Label>
        <Input
          type="text"
          pattern="[0-9]+([\.,][0-9]+)?"
          name="puissance"
          id="puissance"
          defaultValue={puissanceSaisie || ''}
          onChange={handlePuissanceOnChange}
          required
          aria-required="true"
        />
      </div>

      {puissanceMaxFamille && puissanceMaxFamilleDépassée && (
        <AlertBox className="mt-4">
          Les modifications de la Puissance installée ne peuvent pas dépasser le plafond de
          puissance de la famille du projet, soit {puissanceMaxFamille} {appelOffre.unitePuissance}.
        </AlertBox>
      )}

      {!puissanceMaxFamille && !puissanceMaxVolumeReservéDépassée && displayAlertHorsRatios && (
        <AlertePuissanceHorsRatios
          {...{
            project: {
              appelOffre,
              technologie,
              cahierDesCharges: parseCahierDesChargesRéférence(cahierDesChargesActuel),
            },
          }}
        />
      )}

      {!puissanceMaxVolumeReservéDépassée &&
        CDC2022choisi &&
        displayAlertOnPuissancebetweenInitialAndCDC2022Ratios && (
          <AlertePuissanceFourchetteRatioInitialEtCDC2022
            {...{
              project: {
                appelOffre,
                cahierDesCharges: parseCahierDesChargesRéférence(cahierDesChargesActuel),
              },
            }}
          />
        )}

      {puissanceMaxVolumeReservéDépassée && (
        <AlertePuissanceMaxDepassee {...{ project: { appelOffre } }} />
      )}

      {displayAlertOnPuissanceType && (
        <ErrorBox>
          Le format saisi n'est pas conforme, veuillez renseigner un nombre décimal.
        </ErrorBox>
      )}

      <div>
        <Label htmlFor="justification" optionnel={!fichierEtJustificationRequis ? true : undefined}>
          Veuillez nous indiquer les raisons qui motivent votre demande
        </Label>
        <LabelDescription>
          Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
          conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
        </LabelDescription>
        <TextArea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          required={fichierEtJustificationRequis ? true : undefined}
          aria-required={fichierEtJustificationRequis}
        />
      </div>
      <div>
        <Label
          htmlFor="file"
          className="mt-4"
          optionnel={!fichierEtJustificationRequis ? true : undefined}
        >
          Courrier explicatif ou décision administrative
        </Label>
        <InputFile required={fichierEtJustificationRequis} />
      </div>
    </>
  );
};
