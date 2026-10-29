import Accordion from '@codegouvfr/react-dsfr/Accordion';

import { Icon } from '@/components/atoms/Icon';

export const Contexte = () => (
  <section className="mt-5 mb-10 xl:mx-auto xl:max-w-5xl px-2 lg:px-4">
    <h2 className="sr-only">Présentation de Potentiel et des appels d'offres</h2>
    <Accordion label="Objectif de la Programmation pluriannuelle de l'énergie (PPE)" className="">
      <div className="flex flex-col gap-4 text-justify">
        <div>
          La{' '}
          <span className="font-semibold">
            Stratégie française pour l’énergie et le climat (SFEC)
          </span>{' '}
          a pour ambition de garantir la disponibilité de l’énergie à un coût maîtrisé, tout en
          accompagnant la transition vers une économie décarbonée et en renforçant l’adaptation de
          la France au changement climatique. Son objectif central est d’atteindre la{' '}
          <span className="font-semibold">neutralité carbone à l’horizon 2050</span>, puis d’assurer
          son maintien au-delà.
        </div>
        <div>
          Afin de répondre à ces enjeux, l’État a adopté la troisième{' '}
          <span className="font-semibold">Programmation pluriannuelle de l’énergie (PPE 3)</span>,
          publiée le 13 février 2026. Ce document fixe les orientations de la politique énergétique
          française pour la période 2026-2035, tant en matière de consommation que de production
          d’énergie. La PPE 3 prévoit une augmentation significative de la production d’énergies
          souveraines et décarbonées afin de{' '}
          <span className="font-semibold">
            réduire la dépendance de la France aux énergies fossiles
          </span>
          . Le développement des énergies renouvelables constitue ainsi un axe majeur de cette
          stratégie.
        </div>
        <div>
          <Icon id="fr-icon-arrow-right-line" size="sm" />
          Concernant l’éolien terrestre, les objectifs de puissance installée sont fixés à 31 GW en
          2030, puis entre 35 et 40 GW à l’horizon 2035.
        </div>
        <div>
          <Icon id="fr-icon-arrow-right-line" size="sm" />
          Pour le solaire photovoltaïque, la trajectoire retenue prévoit une capacité installée de
          48 GW en 2030 et comprise entre 55 et 80 GW en 2035. Les rythmes de déploiement pourront
          toutefois être ajustés en fonction de l’évolution prévisionnelle de la consommation
          d’électricité.
        </div>
        <div>
          À titre de comparaison, au 30 juin 2026, le parc éolien terrestre français atteignait une
          puissance installée de 24,4 GW, tandis que le parc solaire photovoltaïque représentait
          34,0 GW (SDES).
        </div>
      </div>
    </Accordion>

    <Accordion label="Le soutien de l'État aux énergies renouvelables électriques">
      <div className="flex flex-col gap-4 text-justify">
        <div>
          Afin d'accompagner le développement des énergies renouvelables à hauteur des objectifs de
          transition énergétique français et européen, plusieurs mécanismes de soutien ont été mis
          en place par l'État.
        </div>
        <div className="flex flex-col gap-2">
          <div>On distingue deux grands mécanismes de soutien :</div>
          <ul className="flex flex-col gap-2">
            <li>
              <Icon id="fr-icon-arrow-right-line" size="sm" />
              <span className="font-semibold">Les contrats d’obligation d’achat </span>: ils
              consistent en un rachat à un tarif fixe et défini à l'avance de l'intégralité de la
              production électrique injectée par un acheteur obligé qui est par la suite compensé
              par l’État.
            </li>
            <li>
              <Icon id="fr-icon-arrow-right-line" size="sm" />
              <span className="font-semibold">Les contrats de complément de rémunération</span> : le
              producteur vend l’électricité produite directement sur le marché et perçoit ensuite un
              complément de rémunération qui compense la différence entre le prix du marché et un
              tarif préalablement fixé qui lui est garanti.
            </li>
          </ul>
        </div>
        <div>
          Historiquement, l’ensemble des mécanismes de soutien étaient des contrats d'obligation
          d'achat, ce qui explique qu’une grande partie des installations en service bénéficient
          encore aujourd’hui de ce type de contrat.{' '}
          <span className="font-semibold">
            Aujourd’hui la majorité des nouveaux contrats sont signés sous le régime du complément
            de rémunération
          </span>
          , les contrats de type obligation d’achat étant désormais exclusivement utilisés pour les
          installations de petite taille.
        </div>

        <div className="flex flex-col gap-2">
          <div>Deux modes d’attribution de ces contrats existent :</div>
          <ul className="flex flex-col gap-2">
            <li>
              <Icon id="fr-icon-arrow-right-line" size="sm" />
              <span className="font-semibold">Guichet ouvert / arrêté tarifaire</span> : mécanisme
              administratif où le tarif ou l'aide est fixé à l'avance par l'État. Tout projet qui
              remplit les critères d'éligibilité administratifs et techniques est éligible au
              mécanisme de soutien
            </li>
            <li>
              <Icon id="fr-icon-arrow-right-line" size="sm" />
              <span className="font-semibold">Appel d’offres</span> : procédure de mise en
              concurrence. Les candidats doivent soumettre une offre tarifaire. Seuls les dossiers
              les plus compétitifs et répondant le mieux aux critères fixés par l'État sont
              sélectionnés, dans la limite d'un volume ou d'un budget global prédéfini par l'État.
              Tous les projets ne sont donc pas garantis d'être lauréats.{' '}
              <span className="font-semibold">
                C'est dans le cadre de cette deuxième catégorie uniquement que Potentiel joue un
                rôle
              </span>
              .
            </li>
          </ul>
        </div>
      </div>
    </Accordion>
    <Accordion label="Les étapes de vie d'un projet candidat d'un appel d'offres">
      <div className="flex flex-col gap-4 text-justify">
        <div>
          Le développement d’un projet d’énergie renouvelable dans le cadre d’un appel d’offres suit
          plusieurs étapes successives, depuis l’identification du site jusqu’à l’exploitation de
          l’installation soutenue par l’État.
        </div>
        <div>
          Le projet débute par l’
          <span className="font-semibold">identification d’un emplacement adapté</span> par le
          porteur de projet. Cette phase préalable comprend notamment les études de faisabilité
          technique, environnementale et économique, ainsi que les premiers échanges avec les
          acteurs locaux et les gestionnaires de réseau.
        </div>
        <div>
          Le porteur de projet engage ensuite les démarches nécessaires à l’
          <span className="font-semibold">obtention des autorisations administratives</span>{' '}
          requises pour le développement de l’installation (autorisations d’urbanisme,
          environnementales etc.)
        </div>
        <div>
          Une fois ces autorisations obtenues ou suffisamment avancées, le projet peut{' '}
          <span className="font-semibold">postuler à un appel d’offres</span>. Le dossier de
          candidature est instruit conformément aux critères définis dans le cahier des charges de
          l’appel d’offres. À l’issue de cette phase d’instruction,{' '}
          <span className="font-semibold">l’État désigne les projets lauréats</span>. Les candidats
          retenus bénéficient alors du mécanisme de soutien prévu par l’appel d’offres, sous réserve
          du respect des conditions fixées par le cahier des charges.
        </div>
        <div>
          Le porteur de projet engage ensuite la phase de{' '}
          <span className="font-semibold">construction de l’installation</span> ainsi que les
          travaux de <span className="font-semibold">raccordement au réseau électrique</span>. Cette
          étape comprend l’ensemble des opérations techniques nécessaires à la mise en service du
          parc, incluant une <span className="font-semibold">phase d'essais</span> préalable à son
          exploitation commerciale.
        </div>
        <div>
          Suite à un <span className="font-semibold">contrôle de conformité</span> permettant de
          vérifier le respect des exigences prévues par le cahier des charges, le{' '}
          <span className="font-semibold">contrat correspondant au mécanisme de soutien</span> est
          signé et l’installation entre en phase d’exploitation et de production d’électricité.
        </div>
      </div>
    </Accordion>
    <Accordion label="Le rôle de Potentiel dans ce processus d'appels offres">
      <div className="flex flex-col gap-4 text-justify">
        <div>
          Potentiel occupe une place centrale dans le suivi des projets d’énergies renouvelables
          candidats aux appels d’offres, depuis le dépôt de leur candidature auprès de la CRE et
          jusqu’à leur achèvement, le cas échéant.
        </div>
        <div>
          Dans un premier temps, la plateforme{' '}
          <span className="font-semibold">réceptionne les candidatures instruites par la CRE</span>{' '}
          et <span className="font-semibold">permet de notifier, au nom de l’État</span>, les
          décisions relatives aux projets, qu’il s’agisse des candidatures éliminées ou des projets
          désignés lauréats.
        </div>
        <div>
          Une fois les projets retenus, Potentiel devient la plateforme de référence pour les
          <span className="font-semibold">
            échanges entre les porteurs de projets et l’administration
          </span>
          . Elle{' '}
          <span className="font-semibold">centralise l’ensemble des démarches et demandes</span>{' '}
          intervenant au cours de la vie du projet afin d’en faciliter le déploiement : gestion des
          recours, demandes de prolongation de délais, modifications encadrées par le cahier des
          charges, entre autres.
        </div>
        <div>
          Au-delà de son rôle de portail pour les porteurs de projets, Potentiel constitue également
          un{' '}
          <span className="font-semibold">
            outil de suivi stratégique du développement des projets
          </span>
          . La plateforme permet de centraliser les principales données de pilotage tout au long du
          cycle de vie des installations : puissance installée, informations de raccordement, dates
          de mise en phase d’essai, date d’achèvement, etc.
        </div>
        Cela permet à Potentiel de contribuer au suivi des objectifs de la politique publique de
        développement des énergies renouvelables des filières éolienne et photovoltaïque, dans le
        cadre des appels d’offres pilotés par l’État.
      </div>
    </Accordion>
  </section>
);
