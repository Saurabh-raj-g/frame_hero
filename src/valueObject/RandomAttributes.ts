import Base from "./Base";

export default class RandomAttributes extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "luck",
                label: "Luck",
            },
            {
                id: 2,
                name: "intelligence",
                label: "Intelligence",
            },
            {
                id: 3,
                name: "power",
                label: "Power",    
            },
        ];
    }

    public static luck(): RandomAttributes {
        return  this.fromName("luck");
    }
    public static intelligence(): RandomAttributes {
        return this.fromName("intelligence");
    }
    public static power(): RandomAttributes {
        return this.fromName("power");
    }
   

    public isLuck(): boolean {
        return this.getName() === "luck";
    }
    public isIntelligence(): boolean {
        return this.getName() === "intelligence";
    }
    public isPower(): boolean {
        return this.getName() === "power";
    }
    
}
