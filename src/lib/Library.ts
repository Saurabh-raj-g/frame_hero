import { WithId } from "mongodb";
import { NFTType } from "../types/NFTType";
import RandomAttributes from "../valueObject/RandomAttributes";
import Role from "../valueObject/Role";
import UserInterface from "../models/interfaces/UserInterface";
import dayjs from "dayjs";

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

  public static async mysteryBoxOpen(nft: NFTType, user:WithId<UserInterface>): Promise<{prize:number, nft:NFTType}> {
    const attributes = Object.keys(nft.attributes);
    let prize = 0;
    const LUCK_PROBABILITY = [0,30,50,80,100];
    const randomAttributeVaules = [0,0,0,]; // luck, intelligence, power
    
    const nftRoles: Map<string, number> = new Map();
    // get random attributes values
    attributes.forEach((name, _) => {
      if(nft.attributes[name].isRandomAttribute){
          const randomAttributes = RandomAttributes.fromName<RandomAttributes>(name);
          if(randomAttributes.isLuck()){
            randomAttributeVaules[0] = nft.attributes[name].value;
          }else if(randomAttributes.isIntelligence()){
            randomAttributeVaules[1] = nft.attributes[name].value;
          }else if(randomAttributes.isPower()){
            randomAttributeVaules[2] = nft.attributes[name].value;
          }
      }else if(nft.attributes[name].isRole){
        const role = Role.fromName<Role>(name);
        nftRoles.set(role.getName(), nft.attributes[name].value);
      }
    });
    
    if(randomAttributeVaules[0] > LUCK_PROBABILITY[1] && randomAttributeVaules[0] <= LUCK_PROBABILITY[2]){
      randomAttributeVaules[1] = randomAttributeVaules[1] + randomAttributeVaules[1]*0.05;
      randomAttributeVaules[2] = randomAttributeVaules[2] + randomAttributeVaules[2]*0.05;
    }
    else if(randomAttributeVaules[0] > LUCK_PROBABILITY[2] && randomAttributeVaules[0] <= LUCK_PROBABILITY[3]){ 
      randomAttributeVaules[1] = randomAttributeVaules[1] + randomAttributeVaules[1]*0.15;
      randomAttributeVaules[2] = randomAttributeVaules[2] + randomAttributeVaules[2]*0.15;
    }
    else if(randomAttributeVaules[0] > LUCK_PROBABILITY[3] && randomAttributeVaules[0] <= LUCK_PROBABILITY[4]){
      randomAttributeVaules[1] = randomAttributeVaules[1] + randomAttributeVaules[1]*0.3;
      randomAttributeVaules[2] = randomAttributeVaules[2] + randomAttributeVaules[2]*0.3;
    }

    const now = dayjs();
    const userCreatedAt = dayjs(user.createdAt);

    const newNftRoles: Map<string, number> = new Map();

    nftRoles.forEach((value, key) => {
      const role = Role.fromName<Role>(key);
      if(role.isBeginner() && userCreatedAt.diff(now, 'day') > 7){
        newNftRoles.set(Role.booster().getName(), value + this.randomNumberBetween(1, 10)*value*0.01);
      }
      if(role.isBooster() && now.diff(userCreatedAt, 'day') > 10){
        newNftRoles.set(Role.booster().getName(), value + this.randomNumberBetween(10, 20)*value*0.02);
      }
    });

    prize += randomAttributeVaules[0] + randomAttributeVaules[1] + randomAttributeVaules[2];

    newNftRoles.forEach((value, key) => {
      prize += value;
    });
    
    // update original nft with new values

    // get random attributes values
    attributes.forEach((name, _) => {
      if(nft.attributes[name].isRandomAttribute){
          const randomAttributes = RandomAttributes.fromName<RandomAttributes>(name);
          if(randomAttributes.isLuck()){
            nft.attributes[name].value = randomAttributeVaules[0] ;
          }else if(randomAttributes.isIntelligence()){
            nft.attributes[name].value = randomAttributeVaules[1];
          }else if(randomAttributes.isPower()){
            nft.attributes[name].value = randomAttributeVaules[2] ;
          }
      }else if(nft.attributes[name].isRole){
        delete nft.attributes[name];
      }
    });

    newNftRoles.forEach((value, key) => {
      nft.attributes[key] = {
        isRandomAttribute: false,
        isRole: true,
        isGender: false,
        isCountry: false,
        value: value,
      }
    });

    return {prize, nft};
  }
}
