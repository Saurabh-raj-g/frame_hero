import Base from "./Base";

export default class Role extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "booster",
                label: "Booster",
            },
            {
                id: 2,
                name: "beginner",
                label: "Beginner",
            },
            {
                id: 3,
                name: "frequentNFTMinter",
                label: "Frequent NFT Minter",    
            },
            {
                id: 4,
                name: "contributor",
                label: "Contributor",    
            },
            {
                id: 5,
                name: "reactiveCaster",
                label: "Reactive Caster",    
            },
            {
                id: 6,
                name: "frequentCaster",
                label: "Frequent Caster",    
            },
            {
                id: 7,
                name: "popularCaster",
                label: "Popular Caster",    
            },
        ];
    }

    public static booster(): Role {
        return  this.fromName("booster");
    }
    public static beginner(): Role {
        return this.fromName("beginner");
    }
    public static frequentNFTMinter(): Role {
        return this.fromName("frequentNFTMinter");
    }
    public static contributor(): Role {
        return this.fromName("contributor");
    }
    public static reactiveCaster(): Role {
        return this.fromName("reactiveCaster");
    }
    public static frequentCaster(): Role {
        return this.fromName("frequentCaster");
    }
    public static popularCaster(): Role {
        return this.fromName("popularCaster");
    }

    public isBooster(): boolean {
        return this.getName() === "booster";
    }
    public isBeginner(): boolean {
        return this.getName() === "beginner";
    }
    public isFrequentNFTMinter(): boolean {
        return this.getName() === "frequentNFTMinter";
    }
    public isContributor(): boolean {
        return this.getName() === "contributor";
    }
    public isReactiveCaster(): boolean {
        return this.getName() === "reactiveCaster";
    }
    public isFrequentCaster(): boolean {
        return this.getName() === "frequentCaster";
    }
    public isPopularCaster(): boolean {
        return this.getName() === "popularCaster";
    }
}
