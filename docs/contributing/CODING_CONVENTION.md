# Convention de codage

## Application Web

### Framework/Approche utilisé :

- [NextJS](https://nextjs.org/) (App router + SSR)
- [React](https://fr.legacy.reactjs.org/)
- Atomic Web Design ([Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/))
- [react-dsfr](https://github.com/codegouvfr/react-dsfr)

### Structure :

```
├── packages
|   ├── applications
|   |   ├── ssr : Application NextJS
|   |   |   ├── src
|   |   |   |   ├── app        : emplacements des points d'entrées de l'application
|   |   |   |   ├── components : composants visuels organisés en suivant l'approche Atomic Design
|   |   |   |   ├── types
|   |   |   |   ├── utils      : fonctions utilitaires
|   |   |   ├── public : assets publics

```

### Routing (répertoire `app`)

Les répertoires permettant de formaliser les routes de l'applications sont plurialisées afin d'avoir des URLs du genre :

- pour l'accès à l'abandon d'un projet lauréat : `/laureats/[:id]/abandon`
- la liste complète des abandons : `/abandons`

### page.tsx

Pour afficher le contenu d'une URL, on utilise une `page.tsx` qui a les responsabilités suivantes :

- D'abord, récupérer les données à afficher à l'aide d'une `query` en utilisant le `mediator`
- Ensuite, convertir le `read model` en `props`
- Enfin retourner la page correspondante située dans la partie `pages` de l'Atomic Design (répertoire `components`)

### Les utilitaires clés

- Pour gérer les erreurs d'une page, il faut utiliser le composant utilitaire `PageWithErrorHandling`
- Pour récupérer l'utilisateur courant il faut utiliser l'utilitaire `withUtilisateur`
- En ce qui concerne les actions de formulaire utiliser l'utilitaire `formAction`

## Domaine métier

Toutes les fonctionnalités et règles métiers sont implémentées dans des packages dédiés situés dans le répertoire `packages/domain`.

Les fonctionnalités sont réparties en plusieurs type d'opération :

- Les requêtes aka [Queries](#queries)
- Les cas d'utilisation aka [Use cases](#usecases)
- Les commandes aka [Commands](#commands)
- Les agrégats aka [Aggregate](#aggregate)
- Les [Sagas](#sagas)

L'accès aux domaines métier se fait grâce au `mediator` dans lequel sont répertoriés toutes les opérations disponibles.

```typescript
// Lister
const results = await mediator.send<ListerDesChosesQuery>({
  type: 'LISTER_DES_CHOSES_QUERY',
  data: {},
});

// Consulter
const result = await mediator.send<ConsulterUneChoseQuery>({
  type: 'CONSULTER_UNE_CHOSE_QUERY',
  data: { identifiant },
});

// Exécuter un comportement métier
await mediator.send<ExécuterUnComportementUseCase>({
  type: 'EXECUTER_UN_COMPORTEMENT_USECASE',
  data: { identifiant },
});
```

### <a id="queries"></a>Queries

Les queries permettent de récupérer les données en lecture sous forme de `ReadModel`.
Ces données sont disponibles dans la partie `Projection` de l'application.

Exemple d'une query :

```typescript
// file: exemple.query.ts

export type ConsulterExempleReadModel = {
  propriété: string;
};

export type ExempleQuery = Message<
  'EXEMPLE_QUERY',
  {
    identifiantValue: string;
  },
  ExempleReadModel
>;

export type ExempleDependencies = {
  find: Find;
};

export const registerExempleQuery = ({ find }: ExempleDependencies) => {
  const handler: MessageHandler<ExempleQuery> = async ({ identifiant }) => {
    // Implémenter la logique ici
  };
  mediator.register('EXEMPLE_QUERY', handler);
};
```

Bonne pratique : préférer avoir des projections au plus proche du besoin afin de limiter au maximum la logique métier dans cette partie

### <a id="usecases"></a>Usecases

Les use cases permettent d'accéder depuis l'extérieur du domaine aux fonctionnalités pour appliquer des modifications en respectant les règles métiers.

La responsabilité de ces derniers est d'exécuter les différentes commandes en appliquant les conversions nécessaires sur les différents paramètres en entrée.

Exemple d'un use case :

```typescript
// file: exemple.usecase.ts

export type ExempleUseCase = Message<
  'EXEMPLE_USECASE',
  {
    identifiantValue: string;
    donnée: string;
  }
>;

export const registerExempleUseCase = () => {
  const runner: MessageHandler<ExempleUseCase> = async ({ identifiant, donnée }) => {
    const identifiant = Identifiant.convertirEnValueType(identifiantValue);

    await mediator.send<Exemple1Command>({
      type: 'EXEMPLE1_COMMAND',
      data: {
        identifiant,
        donnée,
      },
    });

    await mediator.send<Exemple2Command>({
      type: 'EXEMPLE2_COMMAND',
      data: {
        identifiant,
        donnée,
      },
    });
  };
  mediator.register('EXEMPLE_USECASE', runner);
};
```

### <a id="commands"></a>Commands

Les commandes sont des unités de travail unitaires permettant de muter les entités du domaine. Elles sont généralement appelées par un use case ou une saga.

Les paramètres en entrée d'une commande représentant des entités métier sont obligatoirement des value types

C'est ici que l'on va charger l'agrégat, faire des vérifications et exécuter le comportement (`behavior`) attendu.

Exemple d'une commande et de son comportement associé :

```typescript
// file: exemple1.command.ts

export type Exemple1Command = Message<
  'EXEMPLE1_COMMAND',
  {
    date: DateTime.ValueType;
    identifiant: Identifiant.ValueType;
    donnée: string;
  }
>;

export const registerExemple1Command = (loadAggregate: LoadAggregate) => {
  const load = loadExempleFactory(loadAggregate);
  const handler: MessageHandler<Exemple1Command> = async ({ date, identifiant, donnée }) => {
    const agrégat = await load(identifiant);

    await domaine.comportement({
      date,
      donnée,
    });
  };
  mediator.register('EXEMPLE1_COMMAND', handler);
};
```

```typescript
// file: exemple1.behavior.ts

export type ComportementArrivéEvent = DomainEvent<
  'ComportementArrivé-V1',
  {
    date: DateTime.RawType;
    donnée: string;
  }
>;

export type ComportementOptions = {
  date: DateTime.ValueType;
  donnée: string;
};

export async function comportement(this: ExempleAggregate, { date, donnée }: ComportementOptions) {
  const event: ComportementArrivéEvent = {
    type: 'ComportementArrivé-V1',
    payload: {
      date: date.formatter(),
      donnée,
    },
  };

  await this.publish(event);
}

export function applyComportementArrivé(
  this: ExempleAggregate,
  { payload: { date, identifiant, donnée } }: ComportementArrivéEvent,
) {
  this.date = DateTime.convertirEnValueType(date);
  this.donnée = donnée;
}
```

### <a id="aggregate"></a>Aggregate

Un agrégat permet le chargement de l'état actuel d'une entité métier depuis les évènements stockés dans l'event store.

```typescript
// file: exemple.aggregate.ts

export type ExempleEvent = ComportementArrivéEvent | AutreComportementArrivéEvent;

export type ExempleAggregate = Aggregate<ExempleEvent> & {
  date: DateTime.ValueType;
  donnée: string;
  readonly comportement: typeof comportement;
  readonly autreComportement: typeof autreComportement;
};

export const getDefaultExempleAggregate: GetDefaultAggregateState<
  ExempleAggregate,
  ExempleEvent
> = () => ({
  apply,
  date: DateTime.convertirEnValueType(new Date()),
  donnée: '',
  comportement,
  autreComportement,
});

function apply(this: ExempleAggregate, event: ExempleEvent) {
  switch (event.type) {
    case 'ComportementArrivé-V1':
      applyComportementArrivé.bind(this)(event);
      break;
    case 'AutreComportementArrivé-V1':
      applyAutreComportementArrivé.bind(this)(event);
      break;
  }
}

export const loadExempleFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiant: Identifiant.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `exemple|${identifiant.formatter()}`,
      getDefaultAggregate: getDefaultExempleAggregate,
      onNone: throwOnNone
        ? () => {
            throw new AucunExemple();
          }
        : undefined,
    });
  };
```

### <a id="sagas"></a>Sagas

Les sagas permettent de réagir à des évènements métier qui ont eu lieu afin d'opérer une autre opération en réaction.
Les sagas comme les use cases appellent directement les commandes.

Exemple d'une saga :

```typescript
// file: exemple.saga.ts

type ExempleSubscriptionEvent =
  | Exemple.ComportementArrivéEvent
  | Exemple.AutreComportementArrivéEvent;

export type SubscriptionEvent = ExempleSubscriptionEvent;

export type Execute = Message<'EXECUTE_EXEMPLE_SAGA', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiant },
    } = event;
    switch (event.type) {
      case 'ComportementArrivé-V1':
        await mediator.send<Exemple1Command>({
          type: 'EXEMPLE1_COMMAND',
          data: {
            identifiant: Identifiant.convertirEnValueType(identifiant),
          },
        });
        break;
    }
  };

  mediator.register('EXECUTE_EXEMPLE_SAGA', handler);
};
```

### <a id="valuetype"></a>ValueType

Un value type permet de centraliser des règles métier et de permettre également de récupérer une représentation métier depuis une valeur brute (`RawType`).

Par exemple le value type pour les dates :

```typescript
export type RawType = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;

export type ValueType = ReadonlyValueType<{
  date: Date;
  estDansLeFutur(): boolean;
  estAntérieurÀ(dateTime: ValueType): boolean;
  estUltérieureÀ(dateTime: ValueType): boolean;
  nombreJoursÉcartAvec(dateTime: ValueType): number;
  formatter(): RawType;
}>;

export const convertirEnValueType = (value: Date | string): ValueType => {
  let date: Date | undefined;

  if (typeof value === 'string') {
    estValide(value);
    date = new Date(value);
  } else {
    date = value;
  }

  return {
    date,
    estDansLeFutur() {
      return this.date.getTime() > Date.now();
    },
    estAntérieurÀ(dateTime: ValueType) {
      return this.date.getTime() < dateTime.date.getTime();
    },
    estUltérieureÀ(dateTime: ValueType) {
      return this.date.getTime() > dateTime.date.getTime();
    },
    formatter() {
      return this.date.toISOString() as RawType;
    },
    estÉgaleÀ(valueType) {
      return valueType.formatter() === this.formatter();
    },
    nombreJoursÉcartAvec(dateTime) {
      const écart = differenceInDays(this.date, dateTime.date);
      return Math.abs(écart); // Peu importe si la date est avant ou aprés, on veut l'écart positif.
    },
  };
};

export const now = () => convertirEnValueType(new Date());

const regexDateISO8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?Z$/;

function estValide(value: string): asserts value is RawType {
  const isValid = regexDateISO8601.test(value);

  if (!isValid) {
    throw new DateTimeInvalideError(value);
  }
}

class DateTimeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(
      `La date ne correspond pas au format ISO8601 sans décalage UTC ('{YYYY}-{MM}-{SS}T{HH}:{mm}:{ss}.{ms}Z`,
      {
        value,
      },
    );
  }
}
```

## Tests/Spécifications

Dans le package `@potentiel/specifications` sont centralisés tous les scénarios des fonctionnalités implémentés dans le projet.

L'exécution est faite grâce à librairie [@cucumber/cucumber-js](https://cucumber.io/docs/installation/javascript/)

Les scénarios eux sont écrits en langage [Gherkin](https://cucumber.io/docs/gherkin/reference/)

## Infrastructure

### Adapters

Package regroupant les implémentations des `Ports` nécessaire et définis dans le domaine qui font appels à des librairies tierces. Cette séparation permet de ne pas coupler la couche domaine à des parties spécifique à l'infrastructure, comme par exemple l'accès à un bucket s3 pour le stockage de fichiers.

### Notifications

Package permettant la notification par email de certains évènements ayant lieu dans le domaine.

### Projectors

Cette partie de l'infrastructure permet l'alimentation de la partie `Query` et donc des projections du projet.

```typescript
// file: exemple.projector.ts

export type SubscriptionEvent = (ExempleEvent & Event) | RebuildTriggered;

export type Execute = Message<'EXECUTE_EXEMPLE_PROJECTOR', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { type, payload } = event;

    if (type === 'RebuildTriggered') {
      await removeProjection<ExempleProjection>(`exemple|${payload.id}`);
    } else {
      const { identifiant } = payload;

      const exemple = await findProjection<ExempleProjection>(`exemple|${identifiant}`);

      const exempleDefaultValue = {
        identifiant,
        donnée: '',
        date: DateTime.now().formatter(),
      };

      const exempleToUpsert: Omit<ExempleProjection, 'type'> = isSome(exemple)
        ? exemple
        : exempleDefaultValue;

      switch (type) {
        case 'ExempleSupprimé-V1':
          await removeProjection<ExempleProjection>(`exemple|${identifiant}`);
          break;
        case 'ExempleAjouté-V1':
          await upsertProjection<ExempleProjection>(`exemple|${identifiant}`, {
            ...exempleToUpsert,
            donnée: payload.donnée,
            date: payload.date,
          });
          break;
      }
    }
  };

  mediator.register('EXECUTE_EXEMPLE_PROJECTOR', handler);
};
```
