import ReactDOMServer from 'react-dom/server';
import type { Request } from 'express';
import { getTrackerScript } from '../infra/umami';
import React from 'react';

type HasRequest = {
  request: Request;
};

type PageProps<T> = {
  Component: (props: T) => JSX.Element;
  props: T;
  title?: string;
};

const html = String.raw;

const escapeHtml = (value: string) => {
  return value.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
};

const hasRequest = (props: any): props is HasRequest => !!props.request;

function stripRequest(props: HasRequest) {
  const { query, user } = props.request;
  return {
    ...props,
    request: { query, user },
  };
}

const trackerWebsiteId = process.env.TRACKER_WEBSITE_ID;
const crispWebsiteId = process.env.CRISP_WEBSITE_ID;

const formatJsName = (name) => name.charAt(0).toLowerCase() + name.slice(1);

export const makeHtml = <T extends {}>(args: PageProps<T>) => {
  const { Component, props, title = `Suivi des Projets d'Energies Renouvelables` } = args;

  return html`
    <!DOCTYPE html>
    <html itemscope itemtype="http://schema.org/WebPage" lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        <title>${`${title} - Potentiel`}</title>

        <link href="/main.min.css" rel="stylesheet" />
        <link href="/css/index.css" rel="stylesheet" />

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

        ${html`
          <script src="/js/shared.js"></script>
          <script src="/js/${formatJsName(Component.name)}.js?${process.env
              .start_datetime}"></script>
        `}
        ${trackerWebsiteId ? getTrackerScript(trackerWebsiteId) : ''}
        ${crispWebsiteId
          ? `
        <script type="text/javascript">
          window.$crisp = [];
          CRISP_COOKIE_EXPIRE = 3600;
          window.CRISP_WEBSITE_ID = '${crispWebsiteId}'
          ;(function () {
            d = document
            s = d.createElement('script')
            s.src = 'https://client.crisp.chat/l.js'
            s.async = 1
            d.getElementsByTagName('head')[0].appendChild(s)
          })()
          $crisp.push(["on", "chat:opened", () => !$crisp.is("session:ongoing") && $crisp.push(["do", "message:send", ["text", "Bonjour !"]])])
        </script>`
          : ''}
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
          </defs>
        </svg>
        <div id="root">${ReactDOMServer.renderToString(<Component {...props} />)}</div>
        ${html`<script>
          window.__INITIAL_PROPS__ = ${escapeHtml(
            JSON.stringify(hasRequest(props) ? stripRequest(props) : props),
          )};
        </script>`}
      </body>
    </html>
  `;
};
