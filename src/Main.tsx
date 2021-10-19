import React, { useEffect } from 'react';
import { hideWalletSelector, createWill, navigateToDashboard, receiveInheritance } from './actions/main-page-actions';
import { connect } from 'react-redux';
import { AppState } from './reducers/index';
import WalletSelector from './WalletSelector';
import Header from './Header';

const Main = (props: any) => {
    useEffect(() => {
        document.body.className = "des_13";
    });
    console.log(props);
    return (
        <>
        <section className="block_1">
            <div className="container">
                <Header/>
                <div className="bl_1_2">
                    <h1>SOLANA WILL</h1>
                    <div className="description">
                        You can leave your crypto and NFTs as an inheritance to multiple<br /> recipients. Assets are transferrable when you do<br /> not visit this page for 365 days. Fund your probate<br /> account and add recipients.
                    </div>
                    <div className="two_button">
                        <div onClick={(props.walletIsConnected && props.isWillCreated) ? props.navigateToDashboard : (() => props.createWill(props.pubkey, props.willPublicKey))}
                        >{(props.walletIsConnected && props.isWillCreated) ? 'Manage' : 'Create'} a WILL</div>
                        <div onClick={() => props.receiveInheritance(props.pubkey, props.claimedWillPublicKey)}>Claim an inheritance</div>
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
    claimedWillPublicKey: state.claimedWillPublicKey,
});
export default connect(mapStateToProps, { hideWalletSelector, createWill, navigateToDashboard, receiveInheritance })(Main);
