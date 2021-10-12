import { PublicKey, Connection, SystemProgram, TransactionInstruction, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { AppState, InheritorInfo } from "../reducers";
import * as borsh from 'borsh';

const ProgramID = new PublicKey("Go6e2SgC9feLQBruwtPzN69rDkmiFCKYERztJMU6Pa43");
// const RPC = "http://127.0.0.1:8899";
const RPC = "https://api.devnet.solana.com";
const WILL_SEED = "solana-will.com/my/v3/1";
const connection = new Connection(RPC);


export const showWalletSelector = () => ({
    type: 'SHOW_WALLET_SELECTOR'
});

export const hideWalletSelector = () => ({
    type: 'HIDE_WALLET_SELECTOR'
});


class SetInheritorInfosMessage {
    selector: number = 0;
    // borsh does not support list of structs.
    inheritors_names: string[] = [];
    inheritors_pubkeys: string[] = [];
    inheritors_shares: number[] = [];

    constructor(fields: any) { }

    static fromInheritorInfo(value: InheritorInfo[]) {
        const result = new SetInheritorInfosMessage({});
        result.inheritors_names = value.map(o => o.name);
        result.inheritors_pubkeys = value.map(o => o.pubkey);
        result.inheritors_shares = value.map(o => o.share);
        return result;
    }
}

const SetInheritorInfosSchema = new Map([
    [SetInheritorInfosMessage, {
        kind: 'struct', fields: [
            ['selector', 'u8'],
            ['inheritors_names', ['string']],
            ['inheritors_pubkeys', ['string']],
            ['inheritors_shares', ['u16']],
        ]
    }]
]);

class WithdrawSolMessage {
    constructor(public selector = 0, public lamports = 0) {}
}

const WithdrawSolMessageSchema = new Map([
    [WithdrawSolMessage, {
        kind: 'struct', fields: [
            ['selector', 'u8'],
            ['lamports', 'u64'],
        ]
    }]
]);

class WillAccount {
    withdraw_allowed_ts: number = 0;
    inheritors_names: string[] = [];
    inheritors_pubkeys: string[] = [];
    inheritors_shares: number[] = [];

    constructor(fields: {withdraw_allowed_ts: number, inheritors_names: string[], inheritors_pubkeys: string[], inheritors_shares: number[]}) {
        this.withdraw_allowed_ts = fields.withdraw_allowed_ts;
        this.inheritors_names = fields.inheritors_names;
        this.inheritors_pubkeys = fields.inheritors_pubkeys;
        this.inheritors_shares = fields.inheritors_shares;
    }

    get_inheritors(): InheritorInfo[] {
        const result: InheritorInfo[] = [];
        for (let i = 0; i < this.inheritors_names.length; ++i) {
            const ii = new InheritorInfo({});
            ii.name = this.inheritors_names[i];
            ii.pubkey = this.inheritors_pubkeys[i];
            ii.share = this.inheritors_shares[i];
            result.push(ii);
        }
        return result;
    }
}


const WillSchema = new Map([
    [WillAccount, {
        kind: 'struct', fields: [
            ['schema_version', 'u8'],
            ['withdraw_allowed_ts', 'u64'],
            ['inheritors_names', ['string']],
            ['inheritors_pubkeys', ['string']],
            ['inheritors_shares', ['u16']],
        ]
    }],
]);

export const connectPhantomWallet = () => {
    return (dispatch: any) => {
        const solana: any = (window as any).solana;
        solana.on("connect", () => {
            dispatch({ type: 'WALLET_CONNECTED', payload: solana.publicKey });
            PublicKey.createWithSeed(solana.publicKey, WILL_SEED, ProgramID)
                .then((k: PublicKey) => {
                    console.log("Computed derived key: ", k.toString());
                    dispatch({ type: "COMPUTED_DERIVED_KEY", payload: k });
                    return connection.getAccountInfo(k);
                })
                .then((acc) => {
                    console.log("Fetched account: ", acc);
                    if (acc !== null) {
                        console.log("Deserializing", acc.data);
                        const will_account = borsh.deserializeUnchecked(WillSchema, WillAccount, acc.data) as WillAccount;
                        dispatch({ type: "SET_INHERITORS", payload: will_account.get_inheritors() });
                        dispatch({ type: "FETCHED_WILL_SOL_BALANCE", payload: 1.0 * acc.lamports / LAMPORTS_PER_SOL });
                        dispatch({ type: "ALREADY_HAS_A_WILL", payload: true });
                    } else {
                        dispatch({ type: "NO_WILL_YET", payload: true });
                    }
                });
        });
        solana.connect();
    }
};

export const createWill = (wallet: PublicKey | null, willKey: PublicKey) => {
    return (dispatch: any) => {
        if (!wallet) {
            dispatch({
                type: 'SHOW_WALLET_SELECTOR',
                payload: (newState: AppState) => {
                    console.log("Running createWill() after wallet is connected", newState);
                    if (!newState.willPublicKey) {
                        console.error("Something went wrong, willPublicKey is not known after key is computed");
                        return;
                    }
                    if (newState.willCreated) {
                        console.log("Will is already created");
                        dispatch(navigateToDashboard());
                        return;
                    }
                    createWill(newState.pubkey, newState.willPublicKey)(dispatch);
                }
            });
            return;
        }
        const createAccountInstruction = SystemProgram.createAccountWithSeed({
            fromPubkey: wallet,
            newAccountPubkey: willKey,
            basePubkey: wallet,
            seed: WILL_SEED,
            lamports: 10000000,
            space: 10000,
            programId: ProgramID,
        });
        const initializeAccountInstruction = new TransactionInstruction({
            keys: [
                { pubkey: willKey, isSigner: false, isWritable: true },
                { pubkey: wallet, isSigner: true, isWritable: false },
            ],
            programId: ProgramID,
            data: Buffer.from([0]),
        });

        connection.getRecentBlockhash()
            .then(bh => {
                const transaction = new Transaction({
                    feePayer: wallet,
                    recentBlockhash: bh.blockhash,
                });
                transaction.add(createAccountInstruction);
                // transaction.add(initializeAccountInstruction);
                // transaction.partialSign(keypair);
                return (window as any).solana.signTransaction(transaction);
            })
            .then(signedTransaction => connection.sendRawTransaction(signedTransaction.serialize()))
            .then(() => {
                dispatch({ type: "ALREADY_HAS_A_WILL", payload: true });
                dispatch(navigateToDashboard());
            });
    }
};

export const navigateToDashboard = () => ({ type: 'NAVIGATE_TO_DASHBOARD' });
export const navigateToReceivedInheritance = () => ({ type: 'NAVIGATE_TO_RECEIVED_INHERITANCE' });

export const addInheritor = () => ({ type: 'ADD_INHERITOR' });
export const removeInheritor = (e: MouseEvent) => ({ type: 'REMOVE_INHERITOR', payload: parseInt((e.target as HTMLDivElement).dataset.index || '-1') });
export const changeInheritorName = (e: MouseEvent) => ({ type: 'CHANGE_INHERITOR_NAME', payload: [parseInt((e.target as HTMLInputElement).dataset.index || '-1'), (e.target as HTMLInputElement).value] });
export const changeInheritorWallet = (e: MouseEvent) => ({ type: 'CHANGE_INHERITOR_WALLET', payload: [parseInt((e.target as HTMLInputElement).dataset.index || '-1'), (e.target as HTMLInputElement).value] });
export const changeInheritorShare = (e: MouseEvent) => ({ type: 'CHANGE_INHERITOR_SHARE', payload: [parseInt((e.target as HTMLInputElement).dataset.index || '-1'), (e.target as HTMLInputElement).value] });

export const saveWill = (publicKey: PublicKey, willAccount: PublicKey, inheritors: InheritorInfo[]) => (dispatch: any) => {
    const msg = SetInheritorInfosMessage.fromInheritorInfo(inheritors);
    const serializedMsg = borsh.serialize(SetInheritorInfosSchema, msg);
    const instruction = new TransactionInstruction({
        keys: [
            { pubkey: publicKey, isSigner: true, isWritable: false },
            { pubkey: willAccount, isSigner: false, isWritable: true },
        ],
        programId: ProgramID,
        data: Buffer.from(serializedMsg),
    });
    connection.getRecentBlockhash()
        .then(bh => {
            const transaction = new Transaction({
                feePayer: publicKey,
                recentBlockhash: bh.blockhash,
            });
            transaction.add(instruction);
            return (window as any).solana.signTransaction(transaction)
        })
        .then((signedTransaction: any) =>
            connection.sendRawTransaction(signedTransaction.serialize())
        )
        .then(() => dispatch({ type: 'WILL_SAVED' }));
};

export const hideTransferTokensSelector = () => ({ type: 'HIDE_TRANSFER_DIALOG_SELECTOR' });
export const showDepositTokensSelector = () => ({ type: 'SHOW_DEPOSIT_TOKENS_DIALOG_SELECTOR' });
export const showWithdrawTokensSelector = () => ({ type: 'SHOW_WITHDRAW_TOKENS_DIALOG_SELECTOR' });

export const depositSol = (fromPubkey: PublicKey, toPubkey: PublicKey, amount: number, currentSolAmount: number) => (dispatch: any) => {
    const instruction = SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: toPubkey,
        lamports: LAMPORTS_PER_SOL * amount,
    });
    connection.getRecentBlockhash()
    .then(res => {
        const bh = res.blockhash;
        const transaction = new Transaction({
            feePayer: fromPubkey,
            recentBlockhash: bh,
        });
        transaction.add(instruction);
        return (window as any).solana.signTransaction(transaction);
    })
    .then(signedTransaction => connection.sendRawTransaction(signedTransaction.serialize()))
    .then(() => {
        dispatch({ type: "FETCHED_WILL_SOL_BALANCE", payload: currentSolAmount + amount });
        dispatch(hideTransferTokensSelector());
    });
};

export const withdrawSol = (publicKey: PublicKey, willAccount: PublicKey, amount: number, currentSolAmount: number) => (dispatch: any) => {
    const msg = new WithdrawSolMessage(1, amount);
    const serializedMsg = borsh.serialize(WithdrawSolMessageSchema, msg);
    const instruction = new TransactionInstruction({
        keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: willAccount, isSigner: false, isWritable: true },
        ],
        programId: ProgramID,
        data: Buffer.from(serializedMsg),
    });
    connection.getRecentBlockhash()
        .then(bh => {
            const transaction = new Transaction({
                feePayer: publicKey,
                recentBlockhash: bh.blockhash,
            });
            transaction.add(instruction);
            return (window as any).solana.signTransaction(transaction)
        })
        .then((signedTransaction: any) =>
            connection.sendRawTransaction(signedTransaction.serialize())
        )
        .then(() => {
            dispatch({ type: "FETCHED_WILL_SOL_BALANCE", payload: currentSolAmount - amount });
            dispatch(hideTransferTokensSelector());
        });
};


export const receiveInheritance = (publicKey: PublicKey | null, claimedWillPublicKey: PublicKey | null) => (dispatch: any) => {
    if (!publicKey) {
        dispatch({
            type: 'SHOW_WALLET_SELECTOR',
            payload: (newState: AppState) => {
                console.log("Running receiveInheritance() after wallet is connected", newState);
                if (!newState.pubkey) {
                    console.error("Something went wrong, pubkey is not known after wallet is connected");
                    return;
                }
                receiveInheritance(newState.pubkey, newState.claimedWillPublicKey)(dispatch);
            }
        });
        return;
    }
    if (!claimedWillPublicKey) {
        const claimedWillPublicKeyEntry = prompt("Enter the public key of a will");
        if (claimedWillPublicKeyEntry) {
            claimedWillPublicKey = new PublicKey(claimedWillPublicKeyEntry);
        } else {
            return;
        }
    }
    const msg = Buffer.alloc(1, 2);
    const instruction = new TransactionInstruction({
        keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: claimedWillPublicKey, isSigner: false, isWritable: true },
        ],
        programId: ProgramID,
        data: msg
    });
    connection.getRecentBlockhash()
        .then(bh => {
            const transaction = new Transaction({
                feePayer: publicKey,
                recentBlockhash: bh.blockhash,
            });
            transaction.add(instruction);
            return (window as any).solana.signTransaction(transaction)
        })
        .then((signedTransaction: any) =>
            connection.sendRawTransaction(signedTransaction.serialize())
        )
        .then(() => {
            dispatch(navigateToReceivedInheritance());
        });
};