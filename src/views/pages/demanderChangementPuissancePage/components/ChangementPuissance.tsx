import React, { useState } from 'react';
import toNumber from '../../../../helpers/toNumber';
import { isStrictlyPositiveNumber } from '../../../../helpers/formValidators';
import {
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
} from '@modules/demandeModification';
import { Astérisque, ErrorBox, Input, Label, TextArea } from '@components';
import { AlertePuissanceMaxDepassee } from './AlertePuissanceMaxDepassee';
import { AlertePuissanceHorsRatios } from './AlertePuissanceHorsRatios';
import { ProjectAppelOffre, Technologie } from '@entities';

type ChangementPuissanceProps = {
  unitePuissance: string;
  puissance: number;
  puissanceInitiale: number;
  justification: string;
  cahierDesChargesActuel: string;
  appelOffre: ProjectAppelOffre;
  technologie: Technologie;
  puissanceSaisie?: number;
};

export const ChangementPuissance = ({
  puissance,
  justification,
  puissanceInitiale,
  cahierDesChargesActuel,
  appelOffre,
  technologie,
  puissanceSaisie,
}: ChangementPuissanceProps) => {
  const [displayAlertOnPuissanceType, setDisplayAlertOnPuissanceType] = useState(false);
  const [displayAlertHorsRatios, setDisplayAlertHorsRatios] = useState(false);
  const [displayAlertPuissanceMaxVolumeReserve, setDisplayAlertPuissanceMaxVolumeReserve] =
    useState(false);
  const [fichierEtJustificationRequis, setFichierEtJustificationRequis] = useState(false);

  const handlePuissanceOnChange = (e) => {
    const isNewValueCorrect = isStrictlyPositiveNumber(e.target.value);
    const nouvellePuissance = toNumber(e.target.value);
    const exceedsRatios = exceedsRatiosChangementPuissance({
      project: { puissanceInitiale, appelOffre, technologie },
      nouvellePuissance,
    });
    const exceedsPuissanceMax = exceedsPuissanceMaxDuVolumeReserve({
      project: { puissanceInitiale, appelOffre },
      nouvellePuissance,
    });

    setDisplayAlertOnPuissanceType(!isNewValueCorrect);
    setDisplayAlertHorsRatios(exceedsRatios);
    setDisplayAlertPuissanceMaxVolumeReserve(exceedsPuissanceMax);
    setFichierEtJustificationRequis(exceedsRatios || exceedsPuissanceMax);
  };

  const CDC2022choisi = ['30/08/2022', '30/08/2022-alternatif'].includes(cahierDesChargesActuel);

  return (
    <>
      <div>
        <Label htmlFor="puissance-a-la-notification">
          Puissance à la notification (en {appelOffre.unitePuissance})
        </Label>
        <Input
          type="text"
          disabled
          value={puissanceInitiale}
          name="puissance-a-la-notification"
          id="puissance-a-la-notification"
        />
      </div>
      {puissance !== puissanceInitiale && (
        <div>
          <Label htmlFor="puissance-actuelle">
            Puissance actuelle ({appelOffre?.unitePuissance})
          </Label>
          <Input
            type="text"
            disabled
            value={puissance}
            name="puissance-actuelle"
            id="puissance-actuelle"
          />
        </div>
      )}
      <div>
        <Label htmlFor="puissance">
          Nouvelle puissance (en {appelOffre?.unitePuissance}) <Astérisque />
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]+([\.,][0-9]+)?"
          name="puissance"
          id="puissance"
          defaultValue={puissanceSaisie || ''}
          onChange={handlePuissanceOnChange}
          required={true}
        />
      </div>

      {!CDC2022choisi && displayAlertHorsRatios && (
        <AlertePuissanceHorsRatios {...{ project: { appelOffre, technologie } }} />
      )}

      {displayAlertPuissanceMaxVolumeReserve && (
        <AlertePuissanceMaxDepassee {...{ project: { appelOffre } }} />
      )}

      {displayAlertOnPuissanceType && (
        <ErrorBox title="Le format saisi n'est pas conforme, veuillez renseigner un nombre décimal." />
      )}

      <div>
        <Label htmlFor="justification">
          <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
          <br />
          Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
          conduit à ce besoin de modification (contexte, facteurs extérieurs, etc){' '}
          {!CDC2022choisi && fichierEtJustificationRequis && <Astérisque />}
        </Label>
        <TextArea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          required={!CDC2022choisi && fichierEtJustificationRequis ? true : undefined}
        />
      </div>
      <div>
        <Label
          htmlFor="candidats"
          className="mt-4"
          required={!CDC2022choisi && fichierEtJustificationRequis ? true : undefined}
        >
          Courrier explicatif ou décision administrative.{' '}
          {!CDC2022choisi && fichierEtJustificationRequis && <Astérisque />}
        </Label>
        <Input
          type="file"
          name="file"
          id="file"
          required={!CDC2022choisi && fichierEtJustificationRequis}
        />
      </div>
    </>
  );
};
