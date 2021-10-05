import React from 'react';
import logo from './logo.svg';
import Main from './Main';
import { connect } from 'react-redux';
import { AppState } from './reducers/index';
import { hideWalletSelector, connectPhantomWallet } from './actions/main-page-actions';

const WalletSelector = (props: any) => {
    return (<>
        <div className="connect_wallet active">
            <div className="head_p">
                By connecting the wallet, you agree to the Terms of Service and confirm that you have read and understood the disclaimer under the protocol.
            </div>
            <div className="item_wallet" onClick={props.connectPhantomWallet}>
                <div>Phantom Wallet</div>
                <img src="./phantom-icon-purple.svg"/>
            </div>
            {/* <div className="item_wallet">
                <div>WalletConnect</div>
                <img src="img/m_2.svg"/>
            </div>
            <div className="item_wallet">
                <div>Coinbase Wallet</div>
                <img src="img/m_3.svg"/>
            </div>
            <div className="item_wallet">
                <div>Formatic</div>
                <img src="img/m_4.svg"/>
            </div>
            <div className="item_wallet">
                <div>Portis</div>
                <img src="img/m_5.svg"/>
            </div> */}
        </div>
        <div className="blur active" onClick={props.hideWalletSelector}></div></>
    );
}

export default connect(null, {hideWalletSelector, connectPhantomWallet})(WalletSelector);
