import React, { PropTypes } from 'react'
import { MainMenu, styles as MainMenuStyles } from 'components/MainMenu'
import UserModal from 'containers/UserModal'
import UserMenuWidget from 'containers/UserMenuWidget'

import { Link } from 'react-router'

import { setupViews } from './setup'
import { getExtensions } from 'config/extensions'
import { FormattedMessage } from 'react-intl'

setupViews()

// This is your app entry point
export default class TrellisApplication extends React.Component {
  static propTypes = {
    children: PropTypes.object
  }

  render () {
    return <div>
            <UserModal />
              <MainMenu
                logo='http://beavy.xyz/logos/logo.svg'
                navigationTools={<UserMenuWidget />} >
                {getExtensions('MainMenuItem').map(x => x.call(this))}>
                <Link to='/submit/'>
                  <FormattedMessage id='submit' deafultMessage='submit' />
                </Link>
              </MainMenu>
              {this.props.children}
           </div>
  }
}
