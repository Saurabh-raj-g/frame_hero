import { ForcasterType } from "@/src/types/ForcasterType";
import { NFTType } from "@/src/types/NFTType";

export default interface UserInterface {
    forcaster: ForcasterType;
    createdAt: string;
    updatedAt: string;
    balance: number;
    nft: NFTType | null;
}
