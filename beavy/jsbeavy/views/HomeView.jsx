import React from 'react'
import i18n from 'utils/i18n'

console.log({i18n:i18n})

export class HomeView extends React.Component {
  render () {
    let n = 1
    return (
      <div className='container text-center'>
        <img src='http://beavy.xyz/logos/logo.svg' alt='beavy logo' width='150' />
        <h1>{i18n.gettext('Welcome to Beavy!')}</h1>
        <p>
        {i18n.gettext('Please take a look at the')} <a href='https://beavyhq.gitbooks.io/beavy-documentation/content/' target='_blank'>{i18n.gettext('documentation')}</a>.
        </p>
      </div>
    )
  }
}

export default HomeView
