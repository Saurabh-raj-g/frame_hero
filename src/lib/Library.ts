import { NFTType } from "../types/NFTType";
import RandomAttributes from "../valueObject/RandomAttributes";
import Role from "../valueObject/Role";

export default class Library {
  /**
   * 
   * @param min by default 0
   * @param max by default 100
   * @returns 
   */
  public static randomNumberBetween(min= 0, max= 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  public static async mysteryBoxOpen(nft: NFTType): Promise<number> {
    const attributes = Object.keys(nft.attributes);
    const prize = 0;
    
    

    return prize;
  }
}
