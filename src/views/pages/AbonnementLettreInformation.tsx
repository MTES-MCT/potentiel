import type { Request } from 'express'
import React from 'react'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

type AbonnementLettreInformationProps = {
  request: Request
}

export const AbonnementLettreInformation = (props: AbonnementLettreInformationProps) => (
  <>
    <Header />

    <main style={{ fontFamily: 'Marianne, arial, sans-serif' }}>
      <section>
        <div className="mx-auto">
          <script src="https://app.mailjet.com/statics/js/iframeResizer.min.js"></script>
          <div
            className="container"
            dangerouslySetInnerHTML={{
              __html: `<iframe class="mj-w-res-iframe" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://app.mailjet.com/widget/iframe/5bdE/Ni6" width="100%"></iframe>`,
            }}
          ></div>
        </div>
      </section>
    </main>

    <Footer />
  </>
)
