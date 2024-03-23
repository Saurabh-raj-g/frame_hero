import { ForcasterType } from "@/src/types/ForcasterType";
import { NFTType } from "@/src/types/NFTType";

export default interface User {
    forcaster: ForcasterType;
    createdAt: string;
    updatedAt: string;
    balance: number;
    nft: NFTType | null;
  }
