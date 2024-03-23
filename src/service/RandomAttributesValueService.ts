import Library from "../lib/Library";
import RandomAttributes from "../valueObject/RandomAttributes";
export default class RandomAttributesValueService {
    public static getAttributeWithValue():{name:string,value:number}[]{
        const min = 30;
        const max = 70;
        let average = 0;
        let isAverageValid = average <= max && average >= min;
        const result :number[] = [];
        while(!isAverageValid){
            const tem:number[] = [];
            Array.from({length: RandomAttributes.getResourceArray().length}).forEach((_,__)=>{ 
              tem.push(Library.randomNumberBetween(0,100));
            });
            const sum =tem.reduce((pre,curr)=> pre+curr)
            average = sum/RandomAttributes.getResourceArray().length;
            if(isAverageValid){
               tem.forEach((_,index)=>{
                     result.push(tem[index]);
                });
            }
        }
        const output:{name:string,value:number}[] = [];
        RandomAttributes.getResourceArray().forEach((data,index)=>{
            output.push({
                name: data.name,
                value: result[index]
            });
        });
        return output;
    }
}
