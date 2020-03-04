import React from 'react'

const Component = (props: string) => {
  return (
    <main role="main">
      <section className="section section-grey">
        <div className="container">
          <div>Hello from jsx component, my name is {props}</div>
        </div>
      </section>
    </main>
  )
}

export default Component
