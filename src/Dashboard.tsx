import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AppState, InheritorInfo } from './reducers/index';
import { addInheritor, removeInheritor, changeInheritorName, changeInheritorWallet, changeInheritorShare, saveWill, showDepositTokensSelector, showWithdrawTokensSelector, refresh } from './actions/main-page-actions';
import { Pie } from 'react-chartjs-2';
import TokenTransferDialog from './TokenTransferDialog';

const Dashboard = (props: any) => {
    useEffect(() => {
        document.body.className = '';
    });

    const data = {
        labels: props.inheritors.map((i: InheritorInfo) => i.name),
        datasets: [
            {
                label: 'Share',
                data: props.inheritors.map((i: InheritorInfo) => i.share),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    let sharePrice = props.totalBalance / props.inheritors.reduce((acc: number, val: InheritorInfo) => (acc + val.share), 0);
    console.debug('sharePrice', sharePrice, 'shares', props.inheritors.reduce((acc: number, val: InheritorInfo) => (acc + val.share), 0));

    return (<>
        <section className="block_1">
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
                        {/* <div>
                            <span>00</span> SOL
                            <img src="icon.svg" />
                        </div> */}
                        <div>
                            <span>{props.pubkey.toString()}</span>
                            <img src="cryp.svg" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="block_2">
            <div className="container">
                <h1>MY WILL</h1>
            </div>
        </section>
        <section className="block_3">
            <div className="container">
                <div className="bl_3_1">
                    <div onClick={() => props.saveWill(props.pubkey, props.willAccount, props.inheritors)}>
                        Save
                    </div>
                    <div onClick={props.addInheritor}>
                        Add inheritor
                    </div>
                    {/* <div>
                        <img src="img/share.svg" />
                        Share
                    </div> */}
                    {/* <div>
                        <img src="delete.svg" />
                        Delete
                    </div> */}
                </div>
            </div>
        </section>
        <section className="block_4">
            <div className="container">
                <div className="bl_4_1">
                    <div className="table">
                        <div className="head">
                            <div>Will ID</div>
                            <div></div>
                            <div>Release date</div>
                        </div>
                        <div className="content">
                            <div>{props.willAccount.toString()}</div>
                            <div></div>
                            <div>{props.releaseDate.toLocaleString()}</div>
                        </div>
                        <div className="button">
                            <div className="item">
                                <div onClick={props.showDepositTokensSelector}>Deposit</div>
                            </div>
                            <div className="item">
                                <div onClick={props.showWithdrawTokensSelector}>Withdraw</div>
                            </div>
                            <div className="item">
                                <div onClick={() => props.refresh(props.pubkey, props.willAccount, props.willSolBalance)}>Refresh</div>
                            </div>
                        </div>
                        <div className="line"></div>
                        <div className="head_with_icon">
                            <div className="def">Total</div>
                            <div className="cryp">
                                <div><img src="cr_1.svg" /> SOL</div>
                                {/* <div><img src="img/cr_2.svg" /> ETH</div>
                                <div><img src="img/cr_1.svg" /> SOL</div>
                                <div><img src="img/cr_2.svg" /> ETH</div> */}
                            </div>
                        </div>
                        <div className="body">
                            <div className="def">$ {props.totalBalance.toFixed(2)}</div>
                            <div className="cryp">
                                <div>{props.willSolBalance.toFixed(4)}</div>
                                {/* <div>6000</div>
                                <div>8000</div>
                                <div>6000</div> */}
                            </div>
                        </div>
                    </div>
                    <div className="graph" id="oliChart">
                        <Pie data={data}></Pie>
                        {/* <img src="img/graph.svg" /> */}
                    </div>
                </div>
            </div>
        </section>
        <section className="block_6">
            <div className="container">
                <div className="bl_6_1">
                    <div className="head">
                        <div>#</div>
                        <div>Name</div>
                        <div>Wallet</div>
                        <div>Shares</div>
                        <div>Amount, $</div>
                        {/* <div>NFT</div> */}
                        <div></div>
                    </div>
                    {props.inheritors.map((e: InheritorInfo, index: number) => {
                        return (
                            <div className="body" key={index}>
                                <div>{index + 1}</div>
                                <div><input value={e.name} type="text" onChange={props.changeInheritorName} data-index={index} className="will-text-entry" /></div>
                                <div><input value={e.pubkey} type="text" onChange={props.changeInheritorWallet} data-index={index} className="will-text-entry" /></div>
                                <div><input value={e.share} type="text" size={3} onChange={props.changeInheritorShare} data-index={index} className="will-text-entry" /></div>
                                <div>$ {(sharePrice * e.share).toFixed(2)}</div>
                                {/* <div className="button">
                                <div>
                                    <img src="img/print.svg" />
                                    Add NFT
                                </div>
                            </div> */}
                                <div><img src="close.svg" data-index={index} onClick={props.removeInheritor} /></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
        <section className="block_7">
            <div className="container">

            </div>
        </section>
        {props.shouldShowDepositTokensDialog || props.shouldShowWithdrawTokensDialog ? <TokenTransferDialog/> : <></>}
    </>
    );
};

const mapStateToProps = (state: AppState) => ({
    inheritors: state.inheritors,
    pubkey: state.pubkey,
    willAccount: state.willPublicKey,
    willSolBalance: state.willSolBalance,
    totalBalance: state.totalBalance,
    releaseDate: state.releaseDate,
    shouldShowDepositTokensDialog: state.shouldShowDepositTokensDialog,
    shouldShowWithdrawTokensDialog: state.shouldShowWithdrawTokensDialog,
});
export default connect(mapStateToProps, {
    addInheritor, removeInheritor, changeInheritorName, saveWill,
    changeInheritorWallet, changeInheritorShare,
    showWithdrawTokensSelector, showDepositTokensSelector, refresh,
})(Dashboard);
