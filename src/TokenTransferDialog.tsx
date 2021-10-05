import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { AppState } from './reducers/index';
import { hideTransferTokensSelector, depositSol } from './actions/main-page-actions';

const TokenTransferDialog = (props: any) => {
	return (<>
		<div className="connect_wallet active">
			<div className="head_p">
				Select a token
			</div>
			<div className="two_button">
				<select>
					<option>SOL</option>
				</select>
				<input type="text" id="TokenTransferDialog--amount" name=""/>
			</div>
			<div className="select"
			 	onClick={
					 props.shouldShowDepositTokensDialog
					 ? () => props.depositSol(props.pubkey, props.willPublicKey, parseFloat((document.getElementById("TokenTransferDialog--amount") as HTMLInputElement).value || '0'), props.willSolBalance)
					 : () => null}>
				{props.shouldShowDepositTokensDialog ? 'Deposit' : 'Withdraw'}
			</div>
		</div>
		<div className="blur active" onClick={props.hideTransferTokensSelector}></div></>);
};

const mapStateToProps = (state: AppState) => ({
	shouldShowDepositTokensDialog: state.shouldShowDepositTokensDialog,
	pubkey: state.pubkey,
	willPublicKey: state.willPublicKey,
	willSolBalance: state.willSolBalance,
});

export default connect(mapStateToProps, { hideTransferTokensSelector, depositSol })(TokenTransferDialog);