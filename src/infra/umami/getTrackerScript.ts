const html = String.raw
export const getTrackerScript = (trackerWebsiteId: string) => {
  return html`<script
    async
    defer
    data-website-id="${trackerWebsiteId}"
    src="https://analytics.potentiel.beta.gouv.fr/umami.js"
  ></script>`
}
