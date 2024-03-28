import UserInterface from "../models/interfaces/UserInterface";
import { ValueObjectType } from "./ValueObjectType";

export type State = {
  spins: number;
  user: UserInterface | null;
  isUserTempLoaded: boolean;
  imageurl: string | null;
  country: ValueObjectType | null;
  gender: ValueObjectType | null;
  role: ValueObjectType | null;
  randomeAttributes: { name: ValueObjectType, value: number }[];
  imageCID: string | null,
  metadataCID: string | null
}
