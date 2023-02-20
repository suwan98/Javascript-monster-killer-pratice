const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 16;

const  MODE_ATTACK = 'ATTACK'; //MODE_ATTACK = 0;
const  MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


const enteredValue = prompt('Maximum Life for yo and the monster', '100');

let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];
let lastLoggedEntry;

if(isNaN(chosenMaxLife) || chosenMaxLife <= 0){
    chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);


function writeToLog (ev, val, monsterHealth, playerHealth){
    switch(ev){
        case LOG_EVENT_PLAYER_ATTACK :
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK :
            logEntry = {
                event : ev,
                value : val,
                target : 'MONSTER',
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth : playerHealth
            };
            break;
        case LOG_EVENT_MONSTER_ATTACK :
            logEntry = {
                event : ev,
                value : val,
                target : 'PLAYER',
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth : playerHealth
            };
            break;
        case LOG_EVENT_PLAYER_HEAL :
            logEntry = {
                event : ev,
                value : val,
                target : 'PLAYER',
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth : playerHealth
            };
            break;
        case LOG_EVENT_GAME_OVER :
            logEntry = {
                event : ev,
                value : val,
                finalMonsterHealth : monsterHealth,
                finalPlayerHealth : playerHealth
            };
            break;
        default : 
            logEntry = {};
    }
//     let logEntry = {
//         event : ev,
//         value : val,
//         target : 'MONSTER',
//         finalMonsterHealth : monsterHealth,
//         finalPlayerHealth : playerHealth
//     };
//     if(ev = LOG_EVENT_PLAYER_ATTACK){
//         logEntry.target = 'MONSTER';
//     }else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
//         logEntry = {
//             event : ev,
//             value : val,
//             target : 'MONSTER',
//             finalMonsterHealth : monsterHealth,
//             finalPlayerHealth : playerHealth
//         };
//     }else if (ev === LOG_EVENT_MONSTER_ATTACK){
//         logEntry = {
//             event : ev,
//             value : val,
//             target : 'PLAYER',
//             finalMonsterHealth : monsterHealth,
//             finalPlayerHealth : playerHealth
//         };
//     }else if (ev === LOG_EVENT_PLAYER_HEAL){
//         logEntry = {
//             event : ev,
//             value : val,
//             target : 'PLAYER',
//             finalMonsterHealth : monsterHealth,
//             finalPlayerHealth : playerHealth
//         };
//     }else if (ev === LOG_EVENT_GAME_OVER){
//         logEntry = {
//             event : ev,
//             value : val,
//             finalMonsterHealth : monsterHealth,
//             finalPlayerHealth : playerHealth
//         };
//     }
    battleLog.push(logEntry);
}

function reset(){
     currentMonsterHealth = chosenMaxLife;
     currentPlayerHealth = chosenMaxLife;
     resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK,
         playerDamage, 
         currentMonsterHealth,
          currentPlayerHealth)
    if(currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        alert('You would be dead but the bounus life set you!');
        setPlayerHealth(initialPlayerHealth);
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert("You win!!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLayer-won',
            currentMonsterHealth,
            currentPlayerHealth
        );
    }else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('You lost!')
    }else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
        alert("You have a draw!")

    }

    if ( currentMonsterHealth <=0 || currentPlayerHealth <=0){
        reset();
    }
}

function attackMonster(mode){
    let maxDamage;
    if (mode === MODE_ATTACK){
        maxDamage = ATTACK_VALUE;

    }else if (mode === MODE_STRONG_ATTACK) {
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    endRound();
}

function attackHandler(){
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
        alert(`You can't heal to mor than your max initial health`);
        healValue = chosenMaxLife - currentPlayerHealth;

    }else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(HEAL_VALUE);
    currentPlayerHealth += HEAL_VALUE;
    endRound();

}

function printLogHandelr(){
    // for(let i = 0; i<battleLog.length; i++){
    //     console.log(battleLog[i]);
    // }
    let i = 0;
    for (const logEntry of battleLog){
        if(!lastLoggedEntry && lastLoggedEntry !==0 || lastLoggedEntry < i){
            console.log(`${i}`);
            for(const key in logEntry){
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLoggedEntry = i;
        }
        i++;
        break;
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click',healPlayerHandler);
logBtn.addEventListener('click', printLogHandelr);