import { Optional } from 'utility-types';
import { AggregateRoot, DomainError, DomainEvent, UniqueEntityID } from '../../core/domain';
import { ok, Result } from '../../core/utils';
import { AppelOffre } from '@potentiel-domain/appel-offre';

type BaseNotification = {
  message: {
    email: string;
    name?: string;
    subject: string;
  };
  status: 'sent' | 'error' | 'retried' | 'cancelled';
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type Designation = {
  type: 'designation';
  context: {
    appelOffreId: string;
    periodeId: string;
  };
  variables: {
    invitation_link: string;
  };
};

type PP_GF_Notification = {
  type: 'pp-gf-notification';
  context: {
    projectId: string;
    userId: string;
  };
  variables: {
    nomProjet: string;
    dreal: string;
    date_depot: string;
  };
};

type DREAL_GF_déposée_Notification = {
  type: 'dreal-gf-déposée-notification';
  context: {
    projectId: string;
    userId?: string;
    dreal: string;
  };
  variables: {
    nomProjet: string;
    departementProjet: string;
    invitation_link: string;
  };
};

type DREAL_GF_enregistrée_Notification = {
  type: 'dreal-gf-enregistrée-notification';
  context: {
    projectId: string;
    userId?: string;
    dreal: string;
  };
  variables: {
    nomProjet: string;
    departementProjet: string;
    invitation_link: string;
  };
};

type ModificationRequestStatusUpdate = {
  type: 'modification-request-status-update';
  context: {
    modificationRequestId: string;
    userId: string;
  };
  variables: {
    nom_projet: string;
    status: string;
    type_demande: string;
    document_absent: string | undefined;
    modification_request_url: string;
  };
};

type PP_DélaiAccordéCorrigé = {
  type: 'pp-délai-accordé-corrigé';
  context: {
    modificationRequestId: string;
    userId: string;
  };
  variables: {
    nom_projet: string;
    modification_request_url: string;
    explications?: string;
  };
};

type DrealModificationReceived = {
  type: 'dreal-modification-received';
  context: {
    modificationRequestId: string;
    dreal: string;
    userId: string;
    projectId: string;
  };
  variables: {
    nom_projet: string;
    departement_projet: string;
    type_demande: string;
    modification_request_url: string;
  };
};

type DrealModificationPuissanceCDC2022 = {
  type: 'dreal-modification-puissance-cdc-2022';
  context: {
    modificationRequestId: string;
    dreal: string;
    userId: string;
    projectId: string;
  };
  variables: {
    nom_projet: string;
    departement_projet: string;
    modification_request_url: string;
  };
};

type CreRecoursAccepté = {
  type: 'cre-recours-accepté';
  context: {};
  variables: {
    nom_projet: string;
    modification_request_url: string;
  };
};

type AdminModificationRequested = {
  type: 'admin-modification-requested';
  context: {
    modificationRequestId: string;
    dreal: string;
    userId: string;
    projectId: string;
  };
  variables: {
    nom_projet: string;
    departement_projet: string;
    type_demande: string;
    modification_request_url: string;
  };
};

type PPModificationReceived = {
  type: 'pp-modification-received';
  context: {
    modificationRequestId: string;
    userId: string;
    projectId: string;
  };
  variables: {
    nom_projet: string;
    type_demande: string;
    button_url: string;
    button_title: string;
    demande_action_pp?: string;
    button_instructions: string;
  };
};

type PPCDCModifiéChoisi = {
  type: 'pp-cdc-modifié-choisi';
  context: {
    modificationRequestId: string;
    userId: string;
    projectId: string;
  };
  variables: {
    nom_projet: string;
    cdc_date: AppelOffre.RéférenceCahierDesCharges.DateParutionCahierDesChargesModifié;
    cdc_alternatif: 'alternatif' | '';
    projet_url: string;
  };
};

type PPCDCInitialChoisi = {
  type: 'pp-cdc-initial-choisi';
  context: {
    modificationRequestId: string;
    userId: string;
    projectId: string;
  };
  variables: {
    nom_projet: string;
    projet_url: string;
  };
};

type ModificationRequestConfirmedByPP = {
  type: 'modification-request-confirmed';
  context: {
    modificationRequestId: string;
    userId: string;
  };
  variables: {
    nom_projet: string;
    type_demande: string;
    modification_request_url: string;
  };
};

type ModificationRequestCancelled = {
  type: 'modification-request-cancelled';
  context: {
    modificationRequestId: string;
  };
  variables: {
    nom_projet: string;
    type_demande: string;
    departement_projet: string;
    modification_request_url: string;
  };
};

type LegacyCandidateNotification = {
  type: 'legacy-candidate-notification';
  context: {
    importId: string;
  };
  variables: {};
};

type AccèsUtilisateurRévoqués = {
  type: 'accès-utilisateur-révoqués';
  context: {
    projetId: string;
    utilisateurId: string;
  };
  variables: {
    nom_projet: string;
    mes_projets_url: string;
    cause?: string;
  };
};

type PP_DélaiCDC2022Appliqué = {
  type: 'pp-delai-cdc-2022-appliqué';
  context: { projetId: string; utilisateurId: string };
  variables: { nom_projet: string; projet_url: string };
};

type Dreals_DélaiCDC2022Appliqué = {
  type: 'dreals-delai-cdc-2022-appliqué';
  context: { projetId: string; utilisateurId: string };
  variables: { nom_projet: string; projet_url: string };
};

type ChangementCDCAnnuleDélaiCDC2022 = {
  type: 'changement-cdc-annule-delai-cdc-2022';
  context: { projetId: string; utilisateurId: string };
  variables: {
    nom_projet: string;
    projet_url: string;
  };
};

type DateMiseEnServiceTransmiseAnnuleDélaiCDC2022 = {
  type: 'date-mise-en-service-transmise-annule-delai-cdc-2022';
  context: { projetId: string; utilisateurId: string };
  variables: {
    nom_projet: string;
    projet_url: string;
  };
};

type DemandeComplèteRaccordementTransmiseAnnuleDélaiCDC2022 = {
  type: 'demande-complete-raccordement-transmise-annule-delai-Cdc-2022';
  context: { projetId: string; utilisateurId: string };
  variables: {
    nom_projet: string;
    projet_url: string;
  };
};

type NouvellePériodeNotifiée = {
  type: 'tous-rôles-sauf-dgec-et-porteurs-nouvelle-periode-notifiée';
  context: { userId: string };
  variables: { periode: string; appel_offre: string; date_notification: string };
};

type NotificationVariants =
  | Designation
  | PP_GF_Notification
  | DREAL_GF_déposée_Notification
  | DREAL_GF_enregistrée_Notification
  | ModificationRequestStatusUpdate
  | ModificationRequestConfirmedByPP
  | ModificationRequestCancelled
  | DrealModificationReceived
  | PPModificationReceived
  | PPCDCModifiéChoisi
  | PPCDCInitialChoisi
  | AdminModificationRequested
  | LegacyCandidateNotification
  | AccèsUtilisateurRévoqués
  | PP_DélaiCDC2022Appliqué
  | Dreals_DélaiCDC2022Appliqué
  | NouvellePériodeNotifiée
  | ChangementCDCAnnuleDélaiCDC2022
  | DateMiseEnServiceTransmiseAnnuleDélaiCDC2022
  | DemandeComplèteRaccordementTransmiseAnnuleDélaiCDC2022
  | PP_DélaiAccordéCorrigé
  | DrealModificationPuissanceCDC2022
  | CreRecoursAccepté;

export type NotificationProps = BaseNotification & NotificationVariants;

// No idea why: Optional<NotificationProps, 'status'> does not work
export type NotificationArgs = Optional<BaseNotification, 'status'> & NotificationVariants;

export class Notification extends AggregateRoot<NotificationProps, DomainEvent> {
  private constructor(props: NotificationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get type() {
    return this.props.type;
  }

  get status() {
    return this.props.status;
  }

  get message() {
    return this.props.message;
  }

  get error() {
    return this.props.error;
  }

  get context() {
    return this.props.context;
  }

  get variables() {
    return this.props.variables;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public sent() {
    this.props.status = 'sent';
  }

  public retried() {
    this.props.status = 'retried';
  }

  public cancelled() {
    this.props.status = 'cancelled';
  }

  public setError(error: string) {
    this.props.status = 'error';
    this.props.error = error;
  }

  public static clone(notification: Notification): Notification {
    const { type, message, context, variables, status } = notification;

    const clone = new Notification({
      type,
      message,
      context,
      variables,
      status,
    } as any);

    return clone;
  }

  public static create(
    args: NotificationArgs,
    id?: UniqueEntityID,
  ): Result<Notification, DomainError> {
    const notification = new Notification(
      {
        ...args,
        status: args.status || 'sent',
        createdAt: args.createdAt || new Date(),
      },
      id,
    );

    return ok(notification);
  }
}
