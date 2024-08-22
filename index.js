let xp = 0;
let health = 100;
let supplies = 50;
let currentWeapon = 0;
let fighting;
let zombieHealth;
let inventory = ["fist"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const suppliesText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: "fist", power: 5 },
  { name: "baseball bat", power: 30 },
  { name: "machete", power: 50 },
  { name: "shotgun", power: 100 },
];
const monsters = [
  {
    name: "walker",
    level: 2,
    health: 15,
  },
  {
    name: "runner",
    level: 8,
    health: 60,
  },
  {
    name: "zombie horde",
    level: 20,
    health: 300,
  },
];
const locations = [
  {
    name: "abandoned warehouse",
    "button text": ["Search for Supplies", "Enter Safe House", "Fight Zombie"],
    "button functions": [searchSupplies, enterSafeHouse, fightZombie],
    text: "You are at the abandoned warehouse. You see a safe house nearby.",
  },
  {
    name: "safe house",
    "button text": [
      "Use Medkit (10 supplies)",
      "Upgrade weapon (30 supplies)",
      "Go to warehouse",
    ],
    "button functions": [useMedkit, upgradeWeapon, goWarehouse],
    text: "You enter the safe house.",
  },
  {
    name: "danger zone",
    "button text": ["Fight walker", "Fight runner", "Go to warehouse"],
    "button functions": [fightWalker, fightRunner, goWarehouse],
    text: "You enter the danger zone. You see zombies approaching.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goWarehouse],
    text: "You are fighting a zombie.",
  },
  {
    name: "kill zombie",
    "button text": ["Go to warehouse", "Go to warehouse", "Go to warehouse"],
    "button functions": [goWarehouse, goWarehouse, easterEgg],
    text: "The zombie groans as it falls. You gain experience points and find supplies.",
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You have been overwhelmed. &#x2620;",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You survive the horde! YOU WIN THE GAME! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to warehouse?"],
    "button functions": [pickTwo, pickEight, goWarehouse],
    text: "You find a secret stash. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

// initialize buttons
button1.onclick = searchSupplies;
button2.onclick = enterSafeHouse;
button3.onclick = fightZombie;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goWarehouse() {
  update(locations[0]);
}

function enterSafeHouse() {
  update(locations[1]);
}

function searchSupplies() {
  update(locations[2]);
}

function useMedkit() {
  if (supplies >= 10) {
    supplies -= 10;
    health += 10;
    suppliesText.innerText = supplies;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough supplies to use a medkit.";
  }
}

function upgradeWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (supplies >= 30) {
      supplies -= 30;
      currentWeapon++;
      suppliesText.innerText = supplies;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText =
        "You do not have enough supplies to upgrade your weapon.";
    }
  } else {
    text.innerText = "You already have the best weapon!";
    button2.innerText = "Downgrade weapon for 15 supplies";
    button2.onclick = downgradeWeapon;
  }
}

function downgradeWeapon() {
  if (inventory.length > 1) {
    supplies += 15;
    suppliesText.innerText = supplies;
    let currentWeapon = inventory.shift();
    text.innerText = "You downgraded from " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't downgrade your only weapon!";
  }
}

function fightWalker() {
  fighting = 0;
  goFight();
}

function fightRunner() {
  fighting = 1;
  goFight();
}

function fightZombie() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  zombieHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = zombieHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    zombieHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = zombieHealth;
  if (health <= 0) {
    lose();
  } else if (zombieHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatZombie();
    }
  }
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatZombie() {
  supplies += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  suppliesText.innerText = supplies;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  supplies = 50;
  currentWeapon = 0;
  inventory = ["fist"];
  suppliesText.innerText = supplies;
  healthText.innerText = health;
  xpText.innerText = xp;
  goWarehouse();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 supplies!";
    supplies += 20;
    suppliesText.innerText = supplies;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
