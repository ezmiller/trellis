import React from "react";
import { MainMenu } from "components/MainMenu";
import { connect } from 'react-redux';

import UserModal from "containers/UserModal";
import UserMenuWidget from "containers/UserMenuWidget";

import { getExtensions } from "config/extensions";

import styles from "./styles/twitterApp.scss";

export default class Application extends React.Component {
    static getProps(stores, params) {
        var transition = stores.Router.getItem("transition");
        return {
            loading: !!transition
        };
    }
    render() {
        var { loading } = this.props;
        return <div className={styles.this + (loading ? " " + styles.loading : "")}>
            <div className={styles.loadingElement}>loading...</div>
            <UserModal />
            <MainMenu
              title="Twitter"
              logo='http://svgporn.com/logos/twitter.svg'
              MainNavigationTools={<UserMenuWidget />}
            >
                {getExtensions('MainMenuItem').map(x=>x.call(this))}
            </MainMenu>
            {this.props.children}
        </div>;
    }
};
