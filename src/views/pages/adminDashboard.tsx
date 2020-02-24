import * as React from 'react'

/* Pure component */
export default function LoginPage({ adminName }: { adminName: string }) {
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <div className="notification success">Bienvenue {adminName} !</div>
        </div>
      </section>
    </main>
  )
}
