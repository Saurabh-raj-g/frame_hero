export type NFTType = {
    id: number;
    name: string;
    image: string;
    description: string | null;
    attributes: {
        [key:string]: number;
    }
    createdAt: string;
    updatedAt: string;
    //withdraws: WithdrawType[];
    // Add any additional fields as needed
}
