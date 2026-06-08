export interface BlockCustomer {
    id: number;
    institute: number;
    type: string;
    value: string;
    status: string;
    blockSMS: string;
    txnType: string;
    createdDate: number;
    updateDate: number;
    reason: string;
}

export interface Institute {
    id: number;
    name: string;
}