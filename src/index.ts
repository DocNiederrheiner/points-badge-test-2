import { User } from './types/user.interface';
import { Icon } from './types/icon.enum';
import { getAllUser } from './user-store';
import { emulateLongProcess } from './emulate-long-process';

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
    await emulateLongProcess();
    return result;
};

async function calculateUsersStatistics() {
  const users = await getAllUser();
  
  // Berechnung des Durchschnitts und Sortierung
  let avgSolutionCount = 0;
  users.forEach((user) => {
    avgSolutionCount += user.solutionCount;
  });
  avgSolutionCount = avgSolutionCount / users.length;
  users.sort((a, b) => b.solutionCount - a.solutionCount);

  // Konfiguration des Pools
  const MAX_CONCURRENT = 20;
  const badges: Icon[] = [];
  const pool: Promise<void>[] = [];

  const processBatch = async (user: typeof users[number]) => {
    const badge = await getUsersBadge(user);
    badges.push(badge);
  };

  // Verwalten eines limitierten Pools
  for (const user of users) {
    if (pool.length >= MAX_CONCURRENT) {
      await Promise.race(pool); // Warte, bis ein Platz im Pool frei wird
    }

    // Erstelle ein neues Promise und füge es zum Pool hinzu
    const task = processBatch(user).finally(() => {
      // Entferne das abgeschlossene Promise aus dem Pool
      pool.splice(pool.indexOf(task), 1);
    });

    pool.push(task);
  }

  // Warte, bis alle Promises abgeschlossen sind
  await Promise.all(pool);

  // Ausgabe der Statistiken
  console.log("Total number of users: " + users.length);
  console.log("Average solution count: " + avgSolutionCount);
  console.log("Top 5 Users:");
  for (let i = 0; i < Math.min(5, users.length); i++) {
    console.log((i + 1) + ". " + users[i].username + ": " + users[i].solutionCount + " solutions");
  }

  const topBadge = findTopBadge(badges);
  console.log("The most given badge is " + Icon[topBadge]);
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

