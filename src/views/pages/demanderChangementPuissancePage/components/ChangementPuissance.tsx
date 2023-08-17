import React, { useState } from 'react';
import toNumber from '../../../../helpers/toNumber';
import { isStrictlyPositiveNumber } from '../../../../helpers/formValidators';
import {
  exceedsRatiosChangementPuissance,
  exceedsPuissanceMaxDuVolumeReserve,
} from '../../../../modules/demandeModification';
import {
  ErrorBox,
  FormulaireChampsObligatoireLégende,
  Input,
  Label,
  TextArea,
} from '../../../components';
import { AlertePuissanceMaxDepassee } from './AlertePuissanceMaxDepassee';
import { AlertePuissanceHorsRatios } from './AlertePuissanceHorsRatios';
import { ProjectAppelOffre, Technologie } from '../../../../entities';

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

  const tousLesChampsRequis = !CDC2022choisi && fichierEtJustificationRequis;

  return (
    <>
      <div>
        <input
          type="hidden"
          name="puissance-a-la-notification"
          id="puissance-a-la-notification"
          value={puissanceInitiale}
        />
        <div>
          Puissance à la notification :{' '}
          <span className="font-bold">
            {puissanceInitiale} {appelOffre.unitePuissance}
          </span>
        </div>

        {puissance !== puissanceInitiale && (
          <>
            <input
              type="hidden"
              name="puissance-actuelle"
              id="puissance-actuelle"
              value={puissance}
            />
            <div>
              Puissance actuelle :{' '}
              <span className="font-bold">
                {puissance} {appelOffre.unitePuissance}
              </span>
            </div>
          </>
        )}
      </div>

      {tousLesChampsRequis ? (
        <div className="text-error-425-base italic">Tous les champs sont obligatoires</div>
      ) : (
        <FormulaireChampsObligatoireLégende />
      )}
      <div>
        <Label
          htmlFor="puissance"
          required={!tousLesChampsRequis ? true : undefined}
          className="font-bold"
        >
          Nouvelle puissance (en {appelOffre?.unitePuissance})
        </Label>
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
          <span className="font-bold">
            Veuillez nous indiquer les raisons qui motivent votre demande
          </span>
          <br />
          <span className="italic">
            Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
            conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
          </span>
        </Label>
        <TextArea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          required={!CDC2022choisi && fichierEtJustificationRequis ? true : undefined}
          aria-required={!CDC2022choisi && fichierEtJustificationRequis}
        />
      </div>
      <div>
        <Label htmlFor="file" className="mt-4 font-bold">
          Courrier explicatif ou décision administrative
        </Label>
        <Input
          type="file"
          name="file"
          id="file"
          required={!CDC2022choisi && fichierEtJustificationRequis}
          aria-required={!CDC2022choisi && fichierEtJustificationRequis}
        />
      </div>
    </>
  );
};
