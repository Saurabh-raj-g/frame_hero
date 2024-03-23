import { ForcasterType } from "../types/ForcasterType";
import { NFTType } from "../types/NFTType";
interface User {
  forcaster: ForcasterType;
  createdAt: string;
  updatedAt: string;
  balance: number;
  nft:NFTType;
  //withdraws: WithdrawType[];
}

export default User;
