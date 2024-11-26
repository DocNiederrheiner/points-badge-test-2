import { User } from './types/user.interface';
import { Icon } from './types/icon.enum';

export const getUsersBadge = async ( user: User ): Promise<Icon> => {
    let result : Icon | null = null;
    // Get the values from Icon, sort them in reverse order, then loop over array
    console.log(Object.values(Icon).filter((v) => !isNaN(Number(v))).sort((n1,n2) => Number(n2)-Number(n1)));
   Object.values(Icon).filter((v) => !isNaN(Number(v))).sort((n1,n2) => Number(n2)-Number(n1)).forEach((value) => {
       // if value is smaller or equal than the solutionCount for the first time, the highest badge is found
        if(Number(value) <= user.solutionCount){
        // return enum element of the highest badge
        console.log(value);
            if(result === null){
                result = Number(value);
              }
        }
   })
    // If code reaches this point, solution count is negative. Returning default.
    if(result === null)
        result = Icon.DEFAULT;
    return result;
};

getUsersBadge({id:"test",username:"Testimann",solutionCount:27}).then((value) => {console.log(value)});