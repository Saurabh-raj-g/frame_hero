import { NFTType } from "../types/NFTType";
import dayjs from 'dayjs';
import NFTInterface from "./interfaces/NFTInterface";
import Gender from "../valueObject/Gender";
import Role from "../valueObject/Role";
import RandomAttributes from "../valueObject/RandomAttributes";
import Country from "../valueObject/Country";

export default class NFT {
    id: number;
    name: string;
    image: string;
    description: string | null;
    attributes: {
        [key:string]: {
            isRandomAttribute: boolean;
            isRole: boolean;
            isGender: boolean;
            isCountry: boolean;
            value: number;
        };
    }
    createdAt: string;
    updatedAt: string;
  constructor(id: number,name: string, image: string, description: string | null, attributes: {name:string,value:number}[]) {

    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.attributes = this.getAttributes(attributes);
    this.createdAt = dayjs().unix().toString();
    this.updatedAt = dayjs().unix().toString();
    
  }

  getNFT(): NFTInterface {
    return {
        id: this.id,
        name: this.name,
        image: this.image,
        description: this.description,
        attributes: this.attributes,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    }
  }

  private getAttributes(attributes: {name:string,value:number}[]) {
    const obj:NFTType['attributes'] = {};
    attributes.forEach((attribute) => {
        const gender = Gender.fromName<Gender>(attribute.name);
        const role = Role.fromName<Role>(attribute.name);
        const randomAttributes = RandomAttributes.fromName<RandomAttributes>(attribute.name);
        const country = Country.fromName<Country>(attribute.name);
        if(!gender.isUnknown()){
            obj[attribute.name] = {
                isRandomAttribute: false,
                isRole: false,
                isGender: true,
                isCountry: false,
                value: attribute.value
            }
        }else if(!role.isUnknown()){
            obj[attribute.name] = {
                isRandomAttribute: false,
                isRole: true,
                isGender: false,
                isCountry: false,
                value: attribute.value
            }
        }else if(!randomAttributes.isUnknown()){
            obj[attribute.name] = {
                isRandomAttribute: true,
                isRole: false,
                isGender: false,
                isCountry: false,
                value: attribute.value
            }
        }else if(!country.isUnknown()){
            obj[attribute.name] = {
                isRandomAttribute: false,
                isRole: false,
                isGender: false,
                isCountry: true,
                value: attribute.value
            }
        }
        
    });
    return obj;
  }

}
