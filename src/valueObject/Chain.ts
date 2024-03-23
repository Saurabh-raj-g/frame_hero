import Base from "./Base";

export default class Chain extends Base {
    public static getResourceArray() {
        return [
            {
                id: 84532,
                name: "baseSepolia",
                label: "Base Sepolia",
            },
        ];
    }

    public static baseSepolia(): Chain {
        return this.fromName("baseSepolia");
    }

    public isBaseSepolia(): boolean {
        return this.getName() === "baseSepolia";
    }
    
}
