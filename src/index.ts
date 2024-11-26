import { User } from './types/user.interface';
import { Icon } from './types/icon.enum';
import { getAllUser } from './user-store';

export const getUsersBadge = async ( user: User ): Promise<Icon> => {
    let result : Icon | null = null;
    // Get the values from Icon, sort them in reverse order, then loop over array
   Object.values(Icon).filter((v) => !isNaN(Number(v))).sort((n1,n2) => Number(n2)-Number(n1)).forEach((value) => {
       // if value is smaller or equal than the solutionCount for the first time, the highest badge is found
        if(Number(value) <= user.solutionCount){
        // return enum element of the highest badge
            if(result === null){
                result = Number(value);
              }
        }
   })
    // If code reaches this point, solution count is negative. Returning Bad Ass.
    if(result === null)
        result = Icon.BADGE_BAD_ASS;
    return result;
};

function calculateUsersStatistics() {
  getAllUser().then((users) => {
    let avgSolutionCount = 0;
    users = users.sort((a,b) => b.solutionCount-a.solutionCount);
    let badges : Promise<Icon>[] = [];
    users.forEach(async (user) => {
      avgSolutionCount += user.solutionCount;
      badges.push(getUsersBadge(user));
    })
    avgSolutionCount = avgSolutionCount/users.length;
    // Print statistics in console
    console.log("Total number of users: "+ users.length);
    console.log("Average solution count: "+ avgSolutionCount);
    console.log("Top 5 User:")
    for(let i = 0; i<= 4; i++){
      console.log((i+1)+". "+users[i].username+": "+users[i].solutionCount+" solutions");
    }
    Promise.all(badges).then((resolvedBadges) => console.log("The most given badge is "+ Icon[findTopBadge(resolvedBadges)]));
  });

  
}

calculateUsersStatistics();

function findTopBadge(badges: Icon[]) : Icon {
  let result : Icon = Icon.BADGE_BAD_ASS;
  let maxcount : number = 0;
  Object.values(Icon).filter((v) => !isNaN(Number(v))).sort((n1,n2) => Number(n2)-Number(n1)).forEach((value) => {
    if(badges.filter((v) => v==value).length > maxcount){
      maxcount = badges.filter((v) => v==value).length;
      result = Number(value);
    }
  });
  return result;
}

