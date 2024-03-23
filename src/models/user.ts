import { ForcasterType } from "../types/ForcasterType";
import { NFTType } from "../types/NFTType";
import dayjs from 'dayjs';
import UserInterface from "./interfaces/UserInterface";

export default class User {
  forcaster: ForcasterType;
  createdAt: string;
  updatedAt: string;
  balance: number;
  nft: NFTType | null;
  //withdraws: WithdrawType[];

  constructor(forcaster: ForcasterType, nft:NFTType | null, balance: number = 0) {
    this.forcaster = forcaster;
    this.createdAt = dayjs().unix().toString();
    this.updatedAt = dayjs().unix().toString();
    this.balance = balance;
    this.nft = nft;
  }

  getUser(): UserInterface {
    return {
      forcaster: this.forcaster,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      balance: this.balance,
      nft: this.nft
    }
  }


}
