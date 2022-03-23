import ReactDOMServer from 'react-dom/server'
import type { Request } from 'express'
import { getTrackerScript } from '../infra/umami'
interface HasRequest {
  request: Request
}

type PageProps<T> = {
  Component: (props: T) => JSX.Element
  props: T
} & ({ hydrate: false } | { hydrate: true; pageName: string })

const html = String.raw

function stripRequest(props: HasRequest) {
  const { query, user } = props.request
  return {
    ...props,
    request: { query, user },
  }
}

const trackerWebsiteId = process.env.TRACKER_WEBSITE_ID

export const makeHtml = <T extends HasRequest>(args: PageProps<T>) => {
  const { Component, props } = args
  return html`
    <!DOCTYPE html>
    <html itemscope itemtype="http://schema.org/WebPage" lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <title>Potentiel - Suivi des Projets d'Energies Renouvelables</title>

        <link href="/main.min.css" rel="stylesheet" />
        <link href="/css/index.css" rel="stylesheet" />
        <link href="/css/dsfr.css" rel="stylesheet" />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />

        <meta name="theme-color" content="#000091" />
        <!-- Défini la couleur de thème du navigateur (Safari/Android) -->
        <link rel="apple-touch-icon" href="/dsfr/favicon/apple-touch-icon.png" />
        <!-- 180×180 -->
        <link rel="icon" href="/dsfr/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/dsfr/favicon/favicon.ico" type="image/x-icon" />
        <!-- 32×32 -->
        <link
          rel="manifest"
          href="/dsfr/favicon/manifest.webmanifest"
          crossorigin="use-credentials"
        />
        <script src="/scripts.js"></script>

        ${args.hydrate
          ? html`
              <script src="/js/shared.js"></script>
              <script src="/js/${args.pageName}.js?${process.env.npm_package_version}"></script>
            `
          : ''}
        ${trackerWebsiteId ? getTrackerScript(trackerWebsiteId) : ''}
      </head>

      <body style="min-height: 100vh; display: flex; flex-direction: column;">
        <svg aria-hidden="true" focusable="false" style="display:none">
          <defs>
            <symbol
              viewBox="0 0 32 32"
              fill-rule="evenodd"
              clip-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="1.414"
              id="expand"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                style="
                stroke: none;
                fill-rule: nonzero;
                fill: rgb(0%, 0%, 0%);
                fill-opacity: 1;
              "
                d="M 28.265625 6.132812 L 16 18.398438 L 3.734375 6.132812 L 0 9.867188 L 16 25.867188 L 32 9.867188 Z M 28.265625 6.132812 "
              />
            </symbol>
            <symbol
              id="building"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </symbol>
            <symbol
              id="user-circle"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </symbol>
            <symbol
              id="cog"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </symbol>
            <symbol
              id="clipboard-check"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </symbol>
            <symbol
              id="dots-vertical"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              ></path>
            </symbol>
          </defs>
        </svg>
        <div id="root">${ReactDOMServer.renderToString(Component(props))}</div>
        ${args.hydrate
          ? html`<script>
              window.__INITIAL_PROPS__ = ${props ? JSON.stringify(stripRequest(props)) : '{}'}
            </script>`
          : ''}
      </body>
    </html>
  `
}
