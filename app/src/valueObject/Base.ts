import { ValueObjectType } from "../types/ValueObjectType";

export default class Base {
    /**
     * need to overwrite
     * @returns
     */
    public static getResourceArray(): {
        [key: string]: string | number | boolean;
    }[] {
        return [];
    }

    public static all<T extends Base>(): T[] {
        const resources: { [key: string]: string | number | boolean }[] =
            this.getResourceArray();
        const values: T[] = [];
        resources.forEach((resource) => {
            const value: T = this.fromId(resource.id as number) as T;
            values.push(value);
        });
        return values;
    }

    public isUnknown(): boolean {
        return this.getName() === "unknown";
    }

    public static getUnknown<T extends Base>(): T {
        return new this({
            id: 0,
            name: "unknown",
            label: "---",
        }) as T;
    }

    public static fromId<T extends Base>(id: number): T {
        const resourceOf = this._idToResource();
        if (resourceOf[id] === undefined) {
            return this.getUnknown() as T;
        }
        const resource = resourceOf[id];
        return new this(resource) as T;
    }

    public static fromLabel<T extends Base>(label: string): T {
        const resourceOf = this._labelToResource();
        if (resourceOf[label] === undefined) {
            return this.getUnknown() as T;
        }
        const resource = resourceOf[label];
        return new this(resource) as T;
    }

    public static fromName<T extends Base>(name: string): T {
        const resourceOf = this._nameToResource();
        if (resourceOf[name] === undefined) {
            return this.getUnknown() as T;
        }
        const resource = resourceOf[name];
        return new this(resource) as T;
    }

    public static isValidId(id: number): boolean {
        const resourceOf = this._idToResource();
        return resourceOf[id] !== undefined;
    }

    public static isValidName(name: string): boolean {
        const resourceOf = this._nameToResource();
        return resourceOf[name] !== undefined;
    }

    public static idToLabelMap(): { [key: number]: string } {
        const keyValues: { [key: number]: string } = {};
        this.getResourceArray().forEach((resource) => {
            if (
                resource["id"] !== undefined &&
                resource["label"] !== undefined
            ) {
                keyValues[resource["id"] as number] = resource[
                    "label"
                ] as string;
            }
        });
        return keyValues;
    }

    public static nameToLabelMap(): { [key: string]: string } {
        const keyValues: { [key: string]: string } = {};
        this.getResourceArray().forEach((resource) => {
            if (
                resource["name"] !== undefined &&
                resource["label"] !== undefined
            ) {
                keyValues[resource["name"] as string] = resource[
                    "label"
                ] as string;
            }
        });
        return keyValues;
    }

    public static idToNameMap(): { [key: number]: string } {
        const keyValues: { [key: number]: string } = {};
        this.getResourceArray().forEach((resource) => {
            if (
                resource["id"] !== undefined &&
                resource["name"] !== undefined
            ) {
                keyValues[resource["id"] as number] = resource[
                    "name"
                ] as string;
            }
        });
        return keyValues;
    }

    protected static _idToResource(): {
        [key: number]: { [key: string]: string | number | boolean };
    } {
        const resources = this.getResourceArray();
        const idToResource: {
            [key: number]: { [key: string]: string | number | boolean };
        } = {};
        resources.forEach((resource) => {
            const id = resource["id"] as number;
            idToResource[id] = resource;
        });
        return idToResource;
    }

    protected static _nameToResource(): {
        [key: string]: { [key: string]: string | number | boolean };
    } {
        const resources = this.getResourceArray();
        const nameToResource: {
            [key: string]: { [key: string]: string | number | boolean };
        } = {};
        resources.forEach((resource) => {
            const name = resource["name"] as string;
            nameToResource[name] = resource;
        });
        return nameToResource;
    }

    protected static _labelToResource(): {
        [key: string]: { [key: string]: string | number | boolean };
    } {
        const resources = this.getResourceArray();
        const labelToResource: {
            [key: string]: { [key: string]: string | number | boolean };
        } = {};
        resources.forEach((resource) => {
            const label = resource["label"] as string;
            labelToResource[label] = resource;
        });
        return labelToResource;
    }

    protected resource: { [key: string]: string | number | boolean };

    public constructor(resource: { [key: string]: string | number | boolean }) {
        this.resource = resource;
    }

    public getId(): number {
        return this.resource["id"] as number;
    }

    public getName(): string {
        return this.resource["name"] as string;
    }

    public getLabel(): string {
        return this.resource["label"] as string;
    }

    public equalsTo<T extends Base>(other: T): boolean {
        return this.getId() === other.getId();
    }

    public toJson(): ValueObjectType {
        return {
            id: this.getId(),
            name: this.getName(),
            label: this.getLabel(),
        };
    }
}
