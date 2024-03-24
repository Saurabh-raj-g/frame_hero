export default interface NFTInterface {
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
}
