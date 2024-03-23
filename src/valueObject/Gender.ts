import Base from "./Base";

export default class Gender extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "male",
                label: "Male",
            },
            {
                id: 2,
                name: "female",
                label: "Female",
            },
            {
                id: 3,
                name: "annonymous",
                label: "Annonymous",    
            },
        ];
    }

    public static male():Gender {
        return  this.fromName("male");
    }
    public static female(): Gender {
        return this.fromName("female");
    }
    public static annonymous(): Gender {
        return this.fromName("annonymous");
    }
   

    public isMale(): boolean {
        return this.getName() === "male";
    }
    public isFemale(): boolean {
        return this.getName() === "female";
    }
    public isAnnonymous(): boolean {
        return this.getName() === "annonymous";
    }
    
}
