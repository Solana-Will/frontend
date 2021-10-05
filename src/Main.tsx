import React, { useEffect } from 'react';
import { showWalletSelector, hideWalletSelector, createWill, navigateToDashboard } from './actions/main-page-actions';
import { connect } from 'react-redux';
import { AppState } from './reducers/index';
import WalletSelector from './WalletSelector';

const Main = (props: any) => {
    useEffect(() => {
        document.body.className = "des_13";
    });
    console.log(props);
    return (
        <><section className="block_1">
            <div className="container">
                <div className="bl_1_1">
                    <nav>
                        <ul>
                            <li><a href="#">About company</a></li>
                            <li><a href="#">Аbout the project</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contacts</a></li>
                        </ul>
                    </nav>
                    <div className="right_info">
                        {!props.walletIsConnected && <>
                            <div className="connect" onClick={props.showWalletSelector}>
                                Connect Wallet
                            </div>
                        </>}
                        {props.fetchedBalance && <>
                            <div>
                                <span>00</span> SOL
                                <img src="./icon.svg" />
                            </div>
                        </>}
                        {props.walletIsConnected && <>
                            <div>
                                <span>{props.pubkey.toString()}</span>
                                <img src="./cryp.svg" />
                            </div>
                        </>}
                    </div>
                </div>
                <div className="bl_1_2">
                    <h1>CRYPTO WILL</h1>
                    <div className="description">
                        You can leave your crypto and NFTs as an inheritance to multiple<br /> recipients. Assets are transferrable when you do<br /> not visit this page for 365 days. Fund your probate<br /> account and add recipients.
                    </div>
                    <div className="two_button">
                        <div onClick={(props.walletIsConnected && props.isWillCreated) ? props.navigateToDashboard : (() => props.createWill(props.pubkey, props.willPublicKey))}
                        >{(props.walletIsConnected && props.isWillCreated) ? 'Manage' : 'Create'} a WILL</div>
                        <div>Claim an inheritance</div>
                    </div>
                </div>
            </div>
        </section>
            {props.isShowingWalletSelector ? <WalletSelector /> : <></>}
        </>
    );
}

const mapStateToProps = (state: AppState) => ({
    isShowingWalletSelector: state.showWalletSelector,
    walletIsConnected: state.walletConnected,
    fetchedBalance: state.fetchedBalance,
    pubkey: state.pubkey,
    isWillCreated: state.willCreated,
    willPublicKey: state.willPublicKey,
});
export default connect(mapStateToProps, { showWalletSelector, hideWalletSelector, createWill, navigateToDashboard })(Main);
