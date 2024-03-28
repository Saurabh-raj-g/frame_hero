import Base from "./Base";

export default class Country extends Base {
    public static getResourceArray() {
        return [
            {
                id: 1,
                name: "APAC",
                label: "Asia-Pacific",
            },
            {
                id: 2,
                name: "northAmerica",
                label: "North America",
            },
            {
                id: 3,
                name: "southAmerica",
                label: "South America",    
            },
            {
                id: 4,
                name: "europe",
                label: "Europe",    
            },
            {
                id: 5,
                name: "africa",
                label: "Africa",    
            },
            {
                id: 6,
                name: "india",
                label: "India",    
            },
            {
                id: 7,
                name: "internet",
                label: "Internet",    
            },
        ];
    }

    public static APAC(): Country {
        return this.fromName("APAC");
    }
    public static northAmerica(): Country {
        return this.fromName("northAmerica");
    }
    public static southAmerica(): Country {
        return this.fromName("southAmerica");
    }
    public static Europe(): Country {
        return this.fromName("europe");
    }
    public static aferica(): Country {
        return this.fromName("aferica");
    }
    public static India(): Country {
        return this.fromName("india");
    }
    public static internet(): Country {
        return this.fromName("internet");
    }

    public isAPAC(): boolean {
        return this.getName() === "APAC";
    }
    public isNorthAmerica(): boolean {
        return this.getName() === "northAmerica";
    }
    public isSouthAmerica(): boolean {
        return this.getName() === "southAmerica";
    }
    public isEurope(): boolean {
        return this.getName() === "europe";
    }
    public isAferica(): boolean {
        return this.getName() === "aferica";
    }
    public isIndia(): boolean {
        return this.getName() === "india";
    }
    public isInternet(): boolean {
        return this.getName() === "internet";
    }
}
