import { PublicKey } from "@solana/web3.js";

export class InheritorInfo {
  name: string = '';
  pubkey: string = '';
  share: number = 0;

  constructor(fields: any) { }
}

export interface AppState {
  view: string;
  showWalletSelector: boolean;
  walletConnected: boolean;
  fetchedBalance: boolean;
  pubkey: PublicKey | null;
  willPublicKey: PublicKey | null;
  claimedWillPublicKey: PublicKey | null;
  willCreated: boolean;
  actionAfterWalletConnected: CallableFunction | null;
  inheritors: InheritorInfo[];
  willSolBalance: number;
  usdPerSol: number;
  totalBalance: number;
  shouldShowDepositTokensDialog: boolean;
  shouldShowWithdrawTokensDialog: boolean;
};

const initialState = {
  view: 'MAIN',
  showWalletSelector: false,
  walletConnected: false,
  fetchedBalance: false,
  pubkey: null,
  willPublicKey: null,
  claimedWillPublicKey: null,
  willCreated: false,
  actionAfterWalletConnected: null,
  inheritors: [],
  willSolBalance: 0.0,
  usdPerSol: 140.0,
  totalBalance: 0.0,
  shouldShowDepositTokensDialog: false,
  shouldShowWithdrawTokensDialog: false,
};

const solanaWillAppReducer = (
  state: AppState = initialState,
  action: { type: string, payload: any }
) => {
  console.log("Received action", action);
  switch (action.type) {
    case 'SHOW_WALLET_SELECTOR':
      return { ...state, actionAfterWalletConnected: action.payload, showWalletSelector: true };
    case 'HIDE_WALLET_SELECTOR':
      return { ...state, showWalletSelector: false };
    case 'WALLET_CONNECTED':
      return { ...state, showWalletSelector: false, walletConnected: true, pubkey: action.payload };
    case 'COMPUTED_DERIVED_KEY':
      return { ...state, willPublicKey: action.payload };
    case 'ALREADY_HAS_A_WILL': {
      const nextAction = state.actionAfterWalletConnected;
      const nextState = { ...state, actionAfterWalletConnected: null, willCreated: true };
      nextAction && window.setTimeout(() => nextAction(nextState), 0);
      return nextState;
    }
    case 'FETCHED_WILL_SOL_BALANCE':
      return { ...state, willSolBalance: action.payload, totalBalance: action.payload * state.usdPerSol };
    case 'NAVIGATE_TO_DASHBOARD':
      return { ...state, view: 'DASHBOARD' };
    case 'NAVIGATE_TO_RECEIVED_INHERITANCE':
      return { ...state, view: 'RECEIVED_INHERITANCE' };
    case 'NO_WILL_YET': {
      const nextAction = state.actionAfterWalletConnected;
      nextAction && window.setTimeout(() => nextAction(state), 0);
      return { ...state, actionAfterWalletConnected: null };
    }
    case 'ADD_INHERITOR': {
      return { ...state, inheritors: [...state.inheritors, { name: "", wallet: "", share: "0.0" }] };
    }
    case 'REMOVE_INHERITOR': {
      return {
        ...state, inheritors: [
          ...state.inheritors.slice(0, action.payload),
          ...state.inheritors.slice(action.payload + 1)
        ]
      };
    }
    case 'CHANGE_INHERITOR_NAME': {
      const current = state.inheritors[action.payload[0]];
      return {
        ...state, inheritors: [
          ...state.inheritors.slice(0, action.payload[0]),
          { ...current, name: action.payload[1] },
          ...state.inheritors.slice(action.payload[0] + 1)
        ]
      };
    }
    case "CHANGE_INHERITOR_WALLET": {
      const current = state.inheritors[action.payload[0]];
      return {
        ...state, inheritors: [
          ...state.inheritors.slice(0, action.payload[0]),
          { ...current, pubkey: action.payload[1] },
          ...state.inheritors.slice(action.payload[0] + 1)
        ]
      };
    }
    case 'CHANGE_INHERITOR_SHARE': {
      const current = state.inheritors[action.payload[0]];
      const value = parseFloat(action.payload[1]);
      return {
        ...state, inheritors: [
          ...state.inheritors.slice(0, action.payload[0]),
          { ...current, share: isNaN(value) ? 0 : value },
          ...state.inheritors.slice(action.payload[0] + 1)
        ]
      };
    }
    case 'SET_INHERITORS': {
      return { ...state, inheritors: action.payload };
    }
    case 'HIDE_TRANSFER_DIALOG_SELECTOR':
      return { ...state, shouldShowDepositTokensDialog: false, shouldShowWithdrawTokensDialog: false };
    case 'SHOW_DEPOSIT_TOKENS_DIALOG_SELECTOR':
      return { ...state, shouldShowDepositTokensDialog: true, shouldShowWithdrawTokensDialog: false };
    case 'SHOW_WITHDRAW_TOKENS_DIALOG_SELECTOR':
      return { ...state, shouldShowDepositTokensDialog: false, shouldShowWithdrawTokensDialog: true };
    default:
      return state;
  }
}
export default solanaWillAppReducer;