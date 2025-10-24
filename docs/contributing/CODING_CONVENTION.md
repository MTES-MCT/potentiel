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

Les répertoires permettant de formaliser les routes de l'application sont plurialisés afin d'avoir des URLs du genre :

- pour l'accès à l'abandon d'un projet lauréat : `/laureats/[:id]/abandon`
- la liste complète des abandons : `/abandons`

### page.tsx

Pour afficher le contenu d'une URL, on utilise une `page.tsx` qui a les responsabilités suivantes :

- D'abord, récupérer les données à afficher à l'aide d'une `query` en utilisant le `mediator`
- Ensuite, convertir le `read model` en `props`
- Enfin retourner la page correspondante en lui passant les props

Exemple d'une page listant des exemples :

```typescript
// file: page.tsx

type PageProps = {
  searchParams?: Record<string, string>;
};

export const metadata: Metadata = {
  title: 'Titre de la page',
  description: 'Description de la page',
};

export default async function Page({ searchParams }: IdentifiantParameter & PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const page = searchParams?.page ? parseInt(searchParams.page) : 1;

      const exemples = await mediator.send<ListerExemplesQuery>({
        type: 'Exemple.Query.ListerExemples',
        data: {
          pagination: { page, itemsPerPage: 10 },
          email: utilisateur.identifiantUtilisateur.email,
        },
      });

      const filters = [
        {
          label: `Un filtre`,
          searchParamKey: 'filtre',
          options: [...],
        },
      ];

      return <ExempleListPage list={mapToListProps(exemples)} filters={filters} />;
    }),
  );
}

const mapToListProps = (readModel: ListerExemplesReadModel): ExempleListPageProps['list'] => {
  const items = readModel.items.map(
    ({
      identifiant,
      date,
      donnée,
    }) => ({
      identifiant: identifiant.formatter(),
      date: displayDate(date),
      donnée,
    }),
  );

  return {
    items,
    currentPage: readModel.currentPage,
    itemsPerPage: readModel.itemsPerPage,
    totalItems: readModel.totalItems,
  };
};
```

### Convention de nommage des composants

- Avoir un nom clair
- Les termes liés au métier ne sont pas traduits et donc en français
- Les termes techniques eux restent en anglais

Exemple :

```typescript
// file: StatutConventionCodageBadge.tsx

export const StatutConventionCodageBadge = () => {
  return <div>Statut</div>;
};
```

### Bonnes pratiques :

- Les `props` des composants sont exportées afin d'être réutilisable dans les composants parents
- Les `props` sont définis explicitement dans des types

Exemple :

```typescript
// file: StatutConventionCodageBadge.tsx

export type StatutConventionCodageBadgeProps = {
  statut: 'en-cours' | 'terminée';
};

export const StatutConventionCodageBadge: FC<StatutConventionCodageBadgeProps> = ({ statut }) => {
  return <div>{statut}</div>;
};
```

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
  type: 'Exemple.Query.ListerDesChoses',
  data: {},
});

// Consulter
const result = await mediator.send<ConsulterUneChoseQuery>({
  type: 'Exemple.Query.ConsulterUneChose',
  data: { identifiant },
});

// Exécuter un comportement métier
await mediator.send<ExécuterUnComportementUseCase>({
  type: 'Exemple.Query.ExecuterUnComportement',
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
  'Exemple.Query.Executer',
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
  mediator.register('Exemple.Query.Executer', handler);
};
```

> Si une query n'arrive pas à récupérer des données elle doit retourner une Option. Le symbol `none` permet de préciser qu'il n'y a aucune Option correspondante aux paramètres de la query lors de la récupération des données. Toutefois, si le retour de la query est une liste il faut retourner un tableau vide à la place d'une Option.

Bonnes pratiques :

- préférer avoir des projections au plus proche du besoin afin de limiter au maximum la logique métier dans cette partie
- limiter les tableaux dans les projections aux types primitifs (string...). Pour les types complexes, il faut généralement créer une projection spécifique.

### <a id="usecases"></a>Usecases

Les use cases permettent d'accéder depuis l'extérieur du domaine aux fonctionnalités pour appliquer des modifications en respectant les règles métiers.

La responsabilité de ces derniers est d'exécuter les différentes commandes en appliquant les conversions nécessaires sur les différents paramètres en entrée.

Exemple d'un use case :

```typescript
// file: exemple.usecase.ts

export type ExempleUseCase = Message<
  'Exemple.UseCase.Execute1',
  {
    identifiantValue: string;
    donnée: string;
  }
>;

export const registerExempleUseCase = () => {
  const runner: MessageHandler<ExempleUseCase> = async ({ identifiant, donnée }) => {
    const identifiant = Identifiant.convertirEnValueType(identifiantValue);

    await mediator.send<Exemple1Command>({
      type: 'Exemple.Command.Execute1',
      data: {
        identifiant,
        donnée,
      },
    });

    await mediator.send<Exemple2Command>({
      type: 'Exemple.Command.Execute2',
      data: {
        identifiant,
        donnée,
      },
    });
  };
  mediator.register('Exemple.Command.Execute1', runner);
};
```

### <a id="commands"></a>Commands

Les commandes sont des unités de travail unitaires permettant de muter les entités du domaine. Elles sont généralement appelées par un use case ou une saga.

Les paramètres en entrée d'une commande représentant des éléments métier sont obligatoirement des values types

C'est ici que l'on va charger l'agrégat, exécuter le comportement (`behavior`) attendu.

Le `behavior` lui fait les vérifications nécessaires, publie les évènements ou lève des erreurs si les vérifications n'ont pas abouti via des exceptions héritant de `InvalidOperationError` ou OperationRejectedError (cette dernière est réservée au contrôle des accès à la fonctionnalité).

Exemple d'une commande et de son comportement associé :

```typescript
// file: exemple1.command.ts

export type Exemple1Command = Message<
  'Exemple.Command.Execute1',
  {
    date: DateTime.ValueType;
    identifiant: Identifiant.ValueType;
    donnée: string;
  }
>;

export const registerExemple1Command = (loadAggregate: LoadAggregate) => {
  const handler: MessageHandler<Exemple1Command> = async ({ date, identifiant, donnée }) => {
    const agrégat = await loadAggregate(ExempleAggregate, `exemple|${identifiant.formatter()}`);

    await domaine.comportement({
      date,
      donnée,
    });
  };
  mediator.register('Exemple.Command.Execute1', handler);
};
```

```typescript
// file: exemple1.event.ts

export type ComportementArrivéEvent = DomainEvent<
  'ComportementArrivé-V1',
  {
    date: DateTime.RawType;
    donnée: string;
  }
>;
```

```typescript
// file: exemple1.options.ts

export type ComportementOptions = {
  date: DateTime.ValueType;
  donnée: string;
};
```

### <a id="aggregate"></a>Aggregate

Un agrégat permet le chargement de l'état actuel d'une entité métier depuis les évènements stockés dans l'event store.

```typescript
// file: exemple.aggregate.ts

export type ExempleEvent = ComportementArrivéEvent | AutreComportementArrivéEvent;

export class ExempleAggregate extends AbstractAggregate<ExempleEvent, 'exemple'> {
  #donnée = '';
  #date = DateTime.now();

  async comportement({ date, donnée }: ComportementOptions) {
    if (!this.exists) {
      throw new AucuneExempleError();
    }

    const event: ComportementArrivéEvent = {
      type: 'ComportementArrivé-V1',
      payload: {
        date: date.formatter(),
        donnée,
      },
    };

    await this.publish(event);
  }

  autreComportement() {
    // ...
  }

  apply(event: ExempleEvent) {
    match(event.type)
      .when({ type: 'ComportementArrivé-V1' }, this.applyComportementArrivé.bind(this))
      .when({ type: 'AutreComportementArrivé-V1' }, this.applyAutreComportementArrivé.bind(this));
  }

  applyComportementArrivé(
    this: ExempleAggregate,
    { payload: { date, identifiant, donnée } }: ComportementArrivéEvent,
  ) {
    this.date = DateTime.convertirEnValueType(date);
    this.donnée = donnée;
  }
}

export class AucuneExempleError extends AggregateNotFoundError {}
```

> ⚠ AggregateNotFoundError ne doit être utilisée que pour renvoyer une erreur lors du chargement de l'agrégat.

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

export type Execute = Message<'Exemple.Saga.Execute', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const {
      payload: { identifiant },
    } = event;
    switch (event.type) {
      case 'ComportementArrivé-V1':
        await mediator.send<Exemple1Command>({
          type: 'Exemple.Command.Execute1',
          data: {
            identifiant: Identifiant.convertirEnValueType(identifiant),
          },
        });
        break;
    }
  };

  mediator.register('Exemple.Saga.Execute', handler);
};
```

### <a id="valuetype"></a>ValueType

Un value type (ou value object) est un type immuable qui se distingue uniquement par l'état de ses propriétés. Autrement dit, contrairement à une entité métier, qui possède un identifiant unique et reste distincte même si ses propriétés sont par ailleurs identiques, deux objets de valeur ayant exactement les mêmes propriétés peuvent être considérés comme égaux.

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
      `La date ne correspond pas au format ISO8601 sans décalage UTC ('{YYYY}-{MM}-{SS}T{HH}:{mm}:{ss}.{ms}Z')`,
      {
        value,
      },
    );
  }
}
```

Une convention existe pour les value type `Statut`
On met toujours les statuts conjugués au singulier masculin, même pour des domains féminins et/ou pluriel.

Par exemple pour `Garanties Financières`

```typescript
export const statut = ['validé', 'levé'] as const;

export type RawType = (typeof statut)[number];

export type ValueType = ReadonlyValueType<{
  statut: RawType;
  estValidé: () => boolean;
  estLevé: () => boolean;
}>;
```

## Tests/Spécifications

Dans le package `@potentiel/specifications` sont centralisés tous les scénarii des fonctionnalités implémentés dans le projet.

L'exécution est faite grâce à librairie [@cucumber/cucumber-js](https://cucumber.io/docs/installation/javascript/)

Les scénarios eux sont écrits en langage [Gherkin](https://cucumber.io/docs/gherkin/reference/)

## Infrastructure

### Adapters

Package regroupant les implémentations des `Ports` nécessaire et définis dans le domaine qui font appels à des librairies tierces. Cette séparation permet de ne pas coupler la couche domaine à des parties spécifique de l'infrastructure, comme par exemple l'accès à un bucket s3 pour le stockage de fichiers.

### Notifications

Package permettant la notification par email de certains évènements ayant lieu dans le domaine.

### Projectors

Cette partie de l'infrastructure permet l'alimentation de la partie `Query` et donc des projections. C'est ici que l'on opère des transformations de donnée si beosin.

```typescript
// file: exemple.projector.ts

export type SubscriptionEvent = (ExempleEvent & Event) | RebuildTriggered;

export type Execute = Message<'System.Projector.Exemple', SubscriptionEvent>;

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

  mediator.register('System.Projector.Exemple', handler);
};
```
