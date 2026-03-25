import { DocumentProjet } from '../../index.js';

import { ChangementProducteurEnregistréEvent } from './changement/enregistrerChangement/enregistrerChangement.event.js';
import { ProducteurModifiéEvent } from './modifier/modifierProducteur.event.js';

export const pièceJustificative =
  DocumentProjet.documentFactoryV3<ChangementProducteurEnregistréEvent>()(
    'producteur/pièce-justificative',
    'pièceJustificative',
    'enregistréLe',
  );

export const pièceJustificativeModification =
  DocumentProjet.documentFactoryV3<ProducteurModifiéEvent>()(
    'producteur/pièce-justificative',
    'pièceJustificative',
    'modifiéLe',
  );
