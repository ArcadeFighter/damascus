import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// The LocalStorage token
const token = process.env.NODE_ENV === 'production' ? 'damascus' : 'damascus-dev';

// The default progress object
const defaultProgress = {
  'Spray Paint': false,
  'Woodland': false,
  'Digital': false,
  'Dragon': false,
  'Splinter': false,
  'Topo': false,
  'Tiger': false,
  'Stripes': false,
  'Reptile': false,
  'Skulls': false
}

// The default mastery object
const defaultMastery = {
  'Obsidian': false
}

// The default challenges progress
const defaultChallenges = (category, weapon) => {
  switch (category) {
    case 'Assault Rifle':
    case 'Submachine Gun':
    case 'Brokovnice':
    case 'Light Machine Gun':
    case 'Marksman Rifle':
    case 'Sniper Rifle':
    case 'Pistole':
      return [
        {
          category: 'Kill',
          level: 'Gold',
          completed: false
        },
        {
          category: 'Kill',
          level: 'Damascus',
          completed: false
        },
        {
          category: 'Headshot',
          level: 'Platinum',
          completed: false
        },
        {
          category: 'Headshot',
          level: 'Obsidian',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Gold',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Platinum',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Damascus',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Obsidian',
          completed: false
        }
      ];

    case 'Melee':
      if (weapon === 'Combat Knife' || weapon === 'Kali Sticks' || weapon === 'Dual Kodachis') {
        return [
          {
            category: 'Kill',
            level: 'Gold',
            completed: false
          },
          {
            category: 'Kill',
            level: 'Damascus',
            completed: false
          },
          {
            category: 'Double Kill',
            level: 'Platinum',
            completed: false
          },
          {
            category: 'Double Kill',
            level: 'Obsidian',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Gold',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Platinum',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Damascus',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Obsidian',
            completed: false
          }
        ];
      } else if (weapon === 'Riot Shield') {
        return [
          {
            category: 'Kill',
            level: 'Gold',
            completed: false
          },
          {
            category: 'Kill',
            level: 'Damascus',
            completed: false
          },
          {
            category: 'Survival',
            level: 'Platinum',
            completed: false
          },
          {
            category: 'Survival',
            level: 'Obsidian',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Gold',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Platinum',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Damascus',
            completed: false
          },
          {
            category: 'Skill',
            level: 'Obsidian',
            completed: false
          }
        ];
      } else {
        console.error(`Parameter 'weapon' with value '${weapon}' was not found.`);
        break;
      }

    case 'Launchery':
      return [
        {
          category: 'Vehicle Destruction',
          level: 'Gold',
          completed: false
        },
        {
          category: 'Vehicle Destruction',
          level: 'Damascus',
          completed: false
        },
        {
          category: 'Double Kill',
          level: 'Platinum',
          completed: false
        },
        {
          category: 'Double Kill',
          level: 'Obsidian',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Gold',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Platinum',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Damascus',
          completed: false
        },
        {
          category: 'Skill',
          level: 'Obsidian',
          completed: false
        }
      ];

    default:
      console.error(`Parameter 'category' with value '${category}' was not found.`);
      break;
  }
}

// The default filters object
const defaultFilters = {
  weapons: {
    category: null,
    hideNonRequired: false,
    hideCompleted: false
  },
  reticles: {
    category: null,
    hideCompleted: false
  },
  challenges: {
    category: null,
    hideCompleted: false
  }
}

function challengeReq(strings, count, attachCount) {
  let attachPrefix = attachCount !== undefined ? `S nasazenými ${attachCount} Attachmenty, ` : '';
  return `${attachPrefix}${strings[0]} ${count} ${strings[1]}`;
}

const challengeTypes = {
  adsNoStock: ['dát', 'Aiming Down Sight Killů with the No Stock attachment option selected'],
  adsFoldedStock: ['dát', 'Aiming Down Sight Killů with the Folded Stock selected'],
  adsLaser: ['dát', 'Killů while Aiming Down Sights and using a Laser attachment'],
  scoutLongshot: ['dát', 'Longshot Killů while using the Scout Combat Optic'],
  behindEnemy: ['dát', 'Killů while behind the enemy'],
  akimboReflex: ['dát', 'Killů using the Akimbo weapon perk and a Reflex Optic'],
  aerialVehicle: ['Zničit', 'Aerial Vehicles'],
  sliding: ['dát', 'Killů while sliding'],
  quickscope: ['dát', 'Quickscope Killů'],
  buzzkill: ['dát', 'BuzzKillů (End Enemy Streaks)'],
  crouching: ['dát', 'Killů while crouching'],
  inSmoke: ['dát', 'Killů while in smoke'],
  scoutOptic: ['dát', 'Killů while using a Scout Combat Optic'],
  sniperScope: ['dát', 'Killů while using a sniper scope'], // not capitalised in-game
  hipfire: ['dát', 'Hipfire Killů'],
  longshot: ['dát', 'Longshot Killů'],
  pointBlankHeadshot: ['dát', 'Point Blank Headshot Killů'],
  slidingHeadshot: ['dát', 'Headshot Killů while sliding'],
  inSmokeHeadshot: ['dát', 'Headshot Killů while in smoke'],
  crouchingHeadshot: ['dát', 'Headshot Killů while crouching'],
  mountedLongshot: ['dát', 'Mounted Longshot Killů'],
  threeStreakTracker: ['dát', 'Killů without dying and while using the Tracker Perk 10 times'],
  doubleKillTracker: ['dát', 'Double Killů while using the Tracker Perk'],
}

export default new Vuex.Store({
  state: {
    // Weapons
    weapons: [],

    // Reticles
    reticles: [],

    // Camouflages
    camos: [
      {
        name: 'Spray Paint',
        requirements: {
          'Assault Rifle': '800 Killů',
          'Submachine Gun': {
            'AUG': '500 Killů',
            'P90': '500 Killů',
            'MP5': '500 Killů',
            'Uzi': '500 Killů',
            'PP19 Bizon': '500 Killů',
            'MP7': '500 Killů',
            'Striker 45': '500 Killů',
            'Fennec': '250 Killů',
            'ISO': '250 Killů',
            'CX-9': '250 Killů'
          },
          'Brokovnice': '400 Killů',
          'Light Machine Gun': '525 Killů',
          'Marksman Rifle': '450 Killů',
          'Sniper Rifle': '450 Killů',
          'Melee': '200 Killů',
          'Pistole': '250 Killů',
          'Launchery': '125 Killů'
        }
      },
      {
        name: 'Woodland',
        requirements: {
          'Assault Rifle': '125 Headshot Killů',
          'Submachine Gun': {
            'AUG': '100 Headshot Killů',
            'P90': '100 Headshot Killů',
            'MP5': '100 Headshot Killů',
            'Uzi': '100 Headshot Killů',
            'PP19 Bizon': '100 Headshot Killů',
            'MP7': '100 Headshot Killů',
            'Striker 45': '100 Headshot Killů',
            'Fennec': '50 Headshot Killů',
            'ISO': '50 Headshot Killů',
            'CX-9': '50 Headshot Killů'
          },
          'Brokovnice': '75 Crouching Killů',
          'Light Machine Gun': '75 Headshot Killů',
          'Marksman Rifle': '60 Headshot Killů',
          'Sniper Rifle': '60 Headshot Killů',
          'Melee': '50 Killů while injured',
          'Pistole': '50 Headshot Killů',
          'Launchery': '40 Attacker Killů'
        }
      },
      {
        name: 'Digital',
        requirements: {
          'Assault Rifle': '160 Crouching Killů',
          'Submachine Gun': {
            'AUG': '110 Crouching Killů',
            'P90': '110 Crouching Killů',
            'MP5': '110 Crouching Killů',
            'Uzi': '110 Crouching Killů',
            'PP19 Bizon': '110 Crouching Killů',
            'MP7': '110 Crouching Killů',
            'Striker 45': '110 Crouching Killů',
            'Fennec': '40 Crouching Killů',
            'ISO': '40 Crouching Killů',
            'CX-9': '40 Crouching Killů'
          },
          'Brokovnice': '75 Hipfire Killů',
          'Light Machine Gun': '65 Crouching Killů',
          'Marksman Rifle': '50 Crouching Killů',
          'Sniper Rifle': '50 Crouching Killů',
          'Melee': '50 Killů from behind',
          'Pistole': '40 Crouching Killů',
          'Launchery': '40 Defender Killů'
        }
      },
      {
        name: 'Dragon',
        requirements: {
          'Assault Rifle': '75 Hipfire Killů',
          'Submachine Gun': {
            'AUG': '100 Hipfire Killů',
            'P90': '100 Hipfire Killů',
            'MP5': '100 Hipfire Killů',
            'Uzi': '100 Hipfire Killů',
            'PP19 Bizon': '100 Hipfire Killů',
            'MP7': '100 Hipfire Killů',
            'Striker 45': '100 Hipfire Killů',
            'Fennec': '30 Hipfire Killů',
            'ISO': '30 Hipfire Killů',
            'CX-9': '30 Hipfire Killů'
          },
          'Brokovnice': '50 Point Blank Killů',
          'Light Machine Gun': '45 Hipfire Killů',
          'Marksman Rifle': '50 One Shot Killů',
          'Sniper Rifle': '50 One Shot Killů',
          'Melee': '30 Killů while using Dead Silence',
          'Pistole': '30 Hipfire Killů',
          'Launchery': '75 Aerial Killůtreaks Zničit'
        }
      },
      {
        name: 'Splinter',
        requirements: {
          'Assault Rifle': '100 Longshot Killů',
          'Submachine Gun': {
            'AUG': '50 Longshot Killů',
            'P90': '50 Longshot Killů',
            'MP5': '50 Longshot Killů',
            'Uzi': '50 Longshot Killů',
            'PP19 Bizon': '50 Longshot Killů',
            'MP7': '50 Longshot Killů',
            'Striker 45': '50 Longshot Killů',
            'Fennec': '30 Longshot Killů',
            'ISO': '30 Longshot Killů',
            'CX-9': '30 Longshot Killů'
          },
          'Brokovnice': {
            'Model 680': '50 Headshot Killů',
            'R9-0': '50 Headshot Killů',
            '725': '50 Longshot Killů',
            'Origin 12': '50 Headshot Killů',
            'VLK Rogue': '50 Headshot Killů',
            'JAK-12': '50 Headshot Killů'
          },
          'Light Machine Gun': '45 Longshot Killů',
          'Marksman Rifle': {
            'EBR-14': '150 Killů while using all attachments',
            'MK2 Carbine': '150 Killů while using all attachments',
            'Kar98k': '150 Killů while using all attachments',
            'Crossbow': '150 Killů while using all attachments',
            'SKS': '150 Killů while using all attachments',
            'SP-R 208': '50 Longshot Killů'
          },
          'Sniper Rifle': '150 Killů while using all attachments',
          'Melee': '50 Crouching Killů',
          'Pistole': '30 Longshot Killů',
          'Launchery': '75 Ground vehicles Zničit'
        }
      },
      {
        name: 'Topo',
        requirements: {
          'Assault Rifle': '100 Mounted Killů',
          'Submachine Gun': {
            'AUG': '50 Mounted Killů',
            'P90': '50 Mounted Killů',
            'MP5': '50 Mounted Killů',
            'Uzi': '50 Mounted Killů',
            'PP19 Bizon': '50 Mounted Killů',
            'MP7': '50 Mounted Killů',
            'Striker 45': '50 Mounted Killů',
            'Fennec': '25 Double Killů',
            'ISO': '25 Double Killů',
            'CX-9': '25 Double Killů'
          },
          'Brokovnice': '225 Killů while using all attachments',
          'Light Machine Gun': '45 Mounted Killů',
          'Marksman Rifle': {
            'EBR-14': '50 Longshot Killů',
            'MK2 Carbine': '50 Longshot Killů',
            'Kar98k': '50 Longshot Killů',
            'Crossbow': '50 Longshot Killů',
            'SKS': '25 Double Killů',
            'SP-R 208': '25 Double Killů'
          },
          'Sniper Rifle': '50 Longshot Killů',
          'Melee': {
            'Riot Shield': '25 2-streaks',
            'Combat Knife': '25 Double Killů',
            'Kali Sticks': '25 Double Killů',
            'Dual Kodachis': '25 Double Killů'
          },
          'Pistole': '25 Double Killů',
          'Launchery': '50 Equipment, Killůtreaks, or vehicles Zničit'
        }
      },
      {
        name: 'Tiger',
        requirements: {
          'Assault Rifle': '180 Killů while using all attachments',
          'Submachine Gun': {
            'AUG': '250 Killů while using all attachments',
            'P90': '250 Killů while using all attachments',
            'MP5': '250 Killů while using all attachments',
            'Uzi': '250 Killů while using all attachments',
            'PP19 Bizon': '250 Killů while using all attachments',
            'MP7': '250 Killů while using all attachments',
            'Striker 45': '250 Killů while using all attachments',
            'Fennec': '110 Killů while using all attachments',
            'ISO': '110 Killů while using all attachments',
            'CX-9': '110 Killů while using all attachments'
          },
          'Brokovnice': '25 Double Killů',
          'Light Machine Gun': '180 Killů while using all attachments',
          'Marksman Rifle': {
            'EBR-14': '50 Mounted Killů',
            'MK2 Carbine': '50 Mounted Killů',
            'Kar98k': '50 Mounted Killů',
            'Crossbow': '50 Mounted Killů',
            'SKS': '50 Mounted Killů',
            'SP-R 208': '150 Killů while using all attachments'
          },
          'Sniper Rifle': '50 Mounted Killů',
          'Melee': {
            'Riot Shield': '50 Killů near smoke',
            'Combat Knife': '25 Killů near smoke',
            'Kali Sticks': '50 Killů near smoke',
            'Dual Kodachis': '50 Killů near smoke'
          },
          'Pistole': '110 Killů while using all attachments',
          'Launchery': '50 Supportstreaks Zničit'
        }
      },
      {
        name: 'Stripes',
        requirements: {
          'Assault Rifle': '50 Killů shortly after reload',
          'Submachine Gun': {
            'AUG': '40 Killů shortly after reload',
            'P90': '40 Killů shortly after reload',
            'MP5': '40 Killů shortly after reload',
            'Uzi': '40 Killů shortly after reload',
            'PP19 Bizon': '40 Killů shortly after reload',
            'MP7': '40 Killů shortly after reload',
            'Striker 45': '40 Killů shortly after reload',
            'Fennec': '25 Killů shortly after reload',
            'ISO': '25 Killů shortly after reload',
            'CX-9': '25 Killů shortly after reload'
          },
          'Brokovnice': '30 Killů shortly after reload',
          'Light Machine Gun': '30 Double Killů',
          'Marksman Rifle': {
            'EBR-14': '25 Double Killů',
            'MK2 Carbine': '25 Double Killů',
            'Kar98k': '25 Double Killů',
            'Crossbow': '25 Double Killů',
            'SKS': '25 Double Killů',
            'SP-R 208': '50 Mounted Killů'
          },
          'Sniper Rifle': '25 Double Killů',
          'Melee': '10 BuzzKillů',
          'Pistole': '25 Killů shortly after reload',
          'Launchery': '50 Killůtreaks Zničit'
        }
      },
      {
        name: 'Reptile',
        requirements: {
          'Assault Rifle': '110 Killů while using no attachments',
          'Submachine Gun': '75 Killů while using no attachments',
          'Brokovnice': '110 Killů while using no attachments',
          'Light Machine Gun': '75 Killů while using no attachments',
          'Marksman Rifle': '75 Killů while using no attachments',
          'Sniper Rifle': '75 Killů while using no attachments',
          'Melee': '25 Finisher Killů',
          'Pistole': '75 Killů while using no attachments',
          'Launchery': '50 Killů with Amped perk'
        }
      },
      {
        name: 'Skulls',
        requirements: {
          'Assault Rifle': '35 3-streaks',
          'Submachine Gun': '25 3-streaks',
          'Brokovnice': '30 3-streaks',
          'Light Machine Gun': '25 3-streaks',
          'Marksman Rifle': '25 3-streaks',
          'Sniper Rifle': '25 3-streaks',
          'Melee': {
            'Riot Shield': '25 3-streaks',
            'Combat Knife': '10 3-streaks',
            'Kali Sticks': '10 3-streaks',
            'Dual Kodachis': '10 3-streaks'
          },
          'Pistole': '25 3-streaks',
          'Launchery': '50 vehicles Zničit'
        }
      },
      {
        name: 'Obsidian',
        requirements: {
          'Assault Rifle': {
            'Kilo 141': 'Kill 15 enemies in a match 200 times',
            'FAL': 'Kill 15 enemies in a match 200 times',
            'M4A1': 'Kill 15 enemies in a match 200 times',
            'FR 5.56': 'Kill 15 enemies in a match 200 times',
            'Oden': 'Kill 15 enemies in a match 200 times',
            'M13': 'Kill 15 enemies in a match 200 times',
            'FN Scar 17': 'Kill 15 enemies in a match 200 times',
            'AK-47': 'Kill 15 enemies in a match 200 times',
            'RAM-7': 'Kill 15 enemies in a match 150 times',
            'Grau 5.56': 'Kill 15 enemies in a match 200 times',
            'CR-56 AMAX': 'Kill 15 enemies in a match 200 times',
            'AN-94': 'Kill 15 enemies in a match 200 times',
            'AS VAL': 'Kill 15 enemies in a match 200 times'
          },
          'Submachine Gun': 'Kill 15 enemies in a match 150 times',
          'Brokovnice': 'Kill 15 enemies in a match 150 times',
          'Light Machine Gun': 'Kill 15 enemies in a match 150 times',
          'Marksman Rifle': 'Kill 15 enemies in a match 150 times',
          'Sniper Rifle': 'Kill 15 enemies in a match 125 times',
          'Melee': {
            'Riot Shield': 'Kill 750 Enemies',
            'Combat Knife': 'Kill 10 enemies in a match 125 times',
            'Kali Sticks': 'Kill 10 enemies in a match 125 times',
            'Dual Kodachis': 'Kill 10 enemies in a match 125 times'
          },
          'Pistole': 'Kill 15 enemies in a match 100 times',
          'Launchery': {
            'RPG-7': 'Kill 5 enemies in a match 150 times',
            'PILA': 'Zničit a vehicle or Killůtreak 100 times',
            'Strela-P': 'Zničit a vehicle or Killůtreak 100 times',
            'JOKR': 'Zničit a vehicle or Killůtreak 100 times'
          }
        }
      }
    ],

    // Challenges
    challenges: [
      // Kill
      {
        category: 'Kill',
        levels: {
          'Gold': {
            'Assault Rifle': 'Dát 500 Killů',
            'Submachine Gun': 'Dát 500 Killů',
            'Brokovnice': 'Dát 500 Killů',
            'Light Machine Gun': 'Dát 500 Killů',
            'Marksman Rifle': 'Dát 500 Killů',
            'Sniper Rifle': 'Dát 500 Killů',
            'Melee': 'Dát 500 Killů',
            'Pistole': 'Dát 500 Killů'
          },
          'Damascus': {
            'Assault Rifle': 'Dát 2000 Killů',
            'Submachine Gun': 'Dát 2000 Killů',
            'Brokovnice': 'Dát 2000 Killů',
            'Light Machine Gun': 'Dát 2000 Killů',
            'Marksman Rifle': 'Dát 2000 Killů',
            'Sniper Rifle': 'Dát 2000 Killů',
            'Melee': {
              'Combat Knife': 'Dát 2000 Killů',
              'Riot Shield': 'Dát 1250 Killů',
              'Kali Sticks': 'Dát 2000 Killů',
              'Dual Kodachis': 'Dát 2000 Killů'
            },
            'Pistole': 'Dát 2000 Killů'
          }
        }
      },

      // Vehicle Destruction
      {
        category: 'Vehicle Destruction',
        levels: {
          'Gold': {
            'Launchery': 'Zničit 200 Vehicles or Killůtreaks'
          },
          'Damascus': {
            'Launchery': 'Zničit 800 Vehicles or Killůtreaks'
          }
        }
      },

      // Headshot
      {
        category: 'Headshot',
        levels: {
          'Platinum': {
            'Assault Rifle': 'Dát 250 Headshots',
            'Submachine Gun': 'Dát 250 Headshots',
            'Brokovnice': 'Dát 250 Headshots',
            'Light Machine Gun': 'Dát 250 Headshots',
            'Marksman Rifle': 'Dát 250 Headshots',
            'Sniper Rifle': 'Dát 250 Headshots',
            'Pistole': 'Dát 250 Headshots'
          },
          'Obsidian': {
            'Assault Rifle': 'Dát 750 Headshots',
            'Submachine Gun': 'Dát 750 Headshots',
            'Brokovnice': 'Dát 750 Headshots',
            'Light Machine Gun': 'Dát 750 Headshots',
            'Marksman Rifle': 'Dát 750 Headshots',
            'Sniper Rifle': 'Dát 750 Headshots',
            'Pistole': 'Dát 750 Headshots'
          }
        }
      },

      // Survival
      {
        category: 'Survival',
        levels: {
          'Platinum': {
            'Melee': {
              'Riot Shield': 'Dát 2 Killů without dying 100 times'
            },
          },
          'Obsidian': {
            'Melee': {
              'Riot Shield': 'Dát 2 Killů without dying 200 times'
            },
          }
        }
      },

      // Double Kill
      {
        category: 'Double Kill',
        levels: {
          'Platinum': {
            'Melee': {
              'Combat Knife': 'Dát a Double kill 100 times',
              'Kali Sticks': 'Dát a Double kill 100 times',
              'Dual Kodachis': 'Dát a Double kill 100 times'
            },
            'Launchery': 'Dát a Double kill 75 times'
          },
          'Obsidian': {
            'Melee': {
              'Combat Knife': 'Dát a Double kill 300 times',
              'Kali Sticks': 'Dát a Double kill 300 times',
              'Dual Kodachis': 'Dát a Double kill 300 times'
            },
            'Launchery': 'Dát a Double kill 325 times'
          }
        }
      },

      // Skill
      {
        category: 'Skill',
        levels: {
          'Gold': {
            'Assault Rifle': {
              'Kilo 141':challengeReq(challengeTypes.adsNoStock, 75),
              'FAL': challengeReq(challengeTypes.adsNoStock, 75),
              'M4A1': challengeReq(challengeTypes.adsNoStock, 75),
              'FR 5.56': challengeReq(challengeTypes.adsLaser, 75),
              'Oden': challengeReq(challengeTypes.adsLaser, 75),
              'M13': challengeReq(challengeTypes.adsNoStock, 75),
              'FN Scar 17': challengeReq(challengeTypes.adsLaser, 75),
              'AK-47': challengeReq(challengeTypes.adsNoStock, 75),
              'RAM-7': challengeReq(challengeTypes.adsLaser, 75),
              'Grau 5.56': challengeReq(challengeTypes.adsNoStock, 75),
              'CR-56 AMAX': challengeReq(challengeTypes.adsNoStock, 75),
              'AN-94': challengeReq(challengeTypes.adsFoldedStock, 75),
              'AS VAL': challengeReq(challengeTypes.adsNoStock, 75),
            },
            'Submachine Gun': {
              'AUG': challengeReq(challengeTypes.adsLaser, 50),
              'P90': challengeReq(challengeTypes.adsLaser, 50),
              'MP5': challengeReq(challengeTypes.adsLaser, 50),
              'Uzi': challengeReq(challengeTypes.adsNoStock, 50),
              'PP19 Bizon': challengeReq(challengeTypes.adsNoStock, 50),
              'MP7': challengeReq(challengeTypes.adsNoStock, 50),
              'Striker 45': challengeReq(challengeTypes.adsLaser, 50),
              'Fennec': challengeReq(challengeTypes.adsLaser, 50),
              'ISO': challengeReq(challengeTypes.adsLaser, 50),
            },
            'Brokovnice': {
              'Model 680': challengeReq(challengeTypes.adsNoStock, 50),
              'R9-0': challengeReq(challengeTypes.adsLaser, 50),
              '725': challengeReq(challengeTypes.adsLaser, 50),
              'Origin 12': challengeReq(challengeTypes.adsNoStock, 50),
              'VLK Rogue': challengeReq(challengeTypes.adsNoStock, 50),
              'JAK-12': challengeReq(challengeTypes.adsNoStock, 50),
            },
            'Light Machine Gun': {
              'PKM': challengeReq(challengeTypes.adsNoStock, 50),
              'SA87': challengeReq(challengeTypes.adsLaser, 50),
              'M91': challengeReq(challengeTypes.adsNoStock, 50),
              'MG34': challengeReq(challengeTypes.adsNoStock, 50),
              'Holger-26': challengeReq(challengeTypes.adsNoStock, 50),
              'Bruen Mk9': challengeReq(challengeTypes.adsNoStock, 50),
              'FiNN': challengeReq(challengeTypes.adsNoStock, 50),
            },
            'Marksman Rifle': challengeReq(challengeTypes.scoutLongshot, 5),
            'Sniper Rifle': challengeReq(challengeTypes.scoutLongshot, 5),
            'Melee':  challengeReq(challengeTypes.behindEnemy, 50),
            'Pistole': challengeReq(challengeTypes.akimboReflex, 50),
            'Launchery': challengeReq(challengeTypes.aerialVehicle, 20),
          },
          'Platinum': {
            'Assault Rifle': challengeReq(challengeTypes.sliding, 50),
            'Submachine Gun': challengeReq(challengeTypes.sliding, 50),
            'Brokovnice': challengeReq(challengeTypes.sliding, 75),
            'Light Machine Gun': challengeReq(challengeTypes.sliding, 25),
            'Marksman Rifle': {
              'EBR-14': challengeReq(challengeTypes.quickscope, 75),
              'MK2 Carbine': challengeReq(challengeTypes.quickscope, 75),
              'Kar98k': challengeReq(challengeTypes.quickscope, 75),
              'Crossbow': challengeReq(challengeTypes.quickscope, 25),
              'SKS': challengeReq(challengeTypes.quickscope, 75),
              'SP-R 208': challengeReq(challengeTypes.quickscope, 75)
            },
            'Sniper Rifle': challengeReq(challengeTypes.quickscope, 75),
            'Melee': {
              'Combat Knife': challengeReq(challengeTypes.sliding, 25),
              'Riot Shield': challengeReq(challengeTypes.buzzkill, 25),
              'Kali Sticks': challengeReq(challengeTypes.sliding, 25),
              'Dual Kodachis': challengeReq(challengeTypes.sliding, 25),
            },
            'Pistole': challengeReq(challengeTypes.sliding, 30),
            'Launchery': challengeReq(challengeTypes.buzzkill, 10),
          },
          'Damascus': {
            'Assault Rifle': challengeReq(challengeTypes.crouching, 75),
            'Submachine Gun': challengeReq(challengeTypes.inSmoke, 25),
            'Brokovnice': {
              'Model 680': challengeReq(challengeTypes.scoutOptic, 75),
              'R9-0': challengeReq(challengeTypes.scoutOptic, 75),
              '725': challengeReq(challengeTypes.sniperScope, 75),
              'Origin 12': challengeReq(challengeTypes.scoutOptic, 75),
              'VLK Rogue': challengeReq(challengeTypes.scoutOptic, 75),
              'JAK-12': challengeReq(challengeTypes.scoutOptic, 75),
            },
            'Light Machine Gun': challengeReq(challengeTypes.hipfire, 25),
            'Marksman Rifle': {
              'EBR-14': challengeReq(challengeTypes.hipfire, 10),
              'MK2 Carbine': challengeReq(challengeTypes.hipfire, 10),
              'Kar98k': challengeReq(challengeTypes.hipfire, 10),
              'Crossbow': challengeReq(challengeTypes.hipfire, 75),
              'SKS': challengeReq(challengeTypes.hipfire, 75),
              'SP-R 208': challengeReq(challengeTypes.hipfire, 75)
            },
            'Sniper Rifle': challengeReq(challengeTypes.hipfire, 10),
            'Melee': challengeReq(challengeTypes.inSmoke, 75),
            'Pistole': challengeReq(challengeTypes.inSmoke, 75),
            'Launchery': challengeReq(challengeTypes.longshot, 20),
          },
          'Obsidian': {
            'Assault Rifle': challengeReq(challengeTypes.pointBlankHeadshot, 25, 4),
            'Submachine Gun': challengeReq(challengeTypes.slidingHeadshot, 5, 3),
            'Brokovnice': challengeReq(challengeTypes.inSmokeHeadshot, 10, 4),
            'Light Machine Gun': challengeReq(challengeTypes.crouchingHeadshot, 25, 3),
            'Marksman Rifle': challengeReq(challengeTypes.mountedLongshot, 25, 2),
            'Sniper Rifle': challengeReq(challengeTypes.mountedLongshot, 25, 2),
            'Melee': {
              'Combat Knife': challengeReq(challengeTypes.doubleKillTracker, 10),
              'Riot Shield': challengeReq(challengeTypes.threeStreakTracker, 3),
              'Kali Sticks': challengeReq(challengeTypes.doubleKillTracker, 10),
              'Dual Kodachis': challengeReq(challengeTypes.doubleKillTracker, 10)
            },
            'Pistole': challengeReq(challengeTypes.pointBlankHeadshot, 75, 3),
            'Launchery': challengeReq(challengeTypes.doubleKillTracker, 10),
          },
        }
      },
    ],

    // Filters
    filters: {
      ...defaultFilters
    },

    // Default values
    defaults: {
      weapons: [
        {
          category: 'Assault Rifle',
          alias: 'Alpha',
          name: 'Kilo 141',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Bravo',
          name: 'FAL',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Charlie',
          name: 'M4A1',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Delta',
          name: 'FR 5.56',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Echo',
          name: 'Oden',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Foxtrot',
          name: 'M13',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Golf',
          name: 'FN Scar 17',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Hotel',
          name: 'AK-47',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'India',
          name: 'RAM-7',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Juliet',
          name: 'Grau 5.56',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Kilo',
          name: 'CR-56 AMAX',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Lima',
          name: 'AN-94',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Assault Rifle',
          alias: 'Mike',
          name: 'AS VAL',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Assault Rifle')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Alpha',
          name: 'AUG',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Bravo',
          name: 'P90',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Charlie',
          name: 'MP5',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Delta',
          name: 'Uzi',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Echo',
          name: 'PP19 Bizon',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Foxtrot',
          name: 'MP7',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Golf',
          name: 'Striker 45',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Hotel',
          name: 'Fennec',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'India',
          name: 'ISO',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Submachine Gun',
          alias: 'Juliet',
          name: 'CX-9',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Submachine Gun')
          }
        },
        {
          category: 'Brokovnice',
          alias: 'Alpha',
          name: 'Model 680',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Brokovnice')
          }
        },
        {
          category: 'Brokovnice',
          alias: 'Bravo',
          name: 'R9-0',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Brokovnice')
          }
        },
        {
          category: 'Brokovnice',
          alias: 'Charlie',
          name: '725',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Brokovnice')
          }
        },
        {
          category: 'Brokovnice',
          alias: 'Delta',
          name: 'Origin 12',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Brokovnice')
          }
        },
        {
          category: 'Brokovnice',
          alias: 'Echo',
          name: 'VLK Rogue',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Brokovnice')
          }
        },
        {
          category: 'Brokovnice',
          alias: 'Foxtrot',
          name: 'JAK-12',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Brokovnice')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Alpha',
          name: 'PKM',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Bravo',
          name: 'SA87',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Charlie',
          name: 'M91',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Delta',
          name: 'MG34',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Echo',
          name: 'Holger-26',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Foxtrot',
          name: 'Bruen Mk9',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Golf',
          name: 'FiNN',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Light Machine Gun',
          alias: 'Hotel',
          name: 'RAAL MG',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Light Machine Gun')
          }
        },
        {
          category: 'Marksman Rifle',
          alias: 'Alpha',
          name: 'EBR-14',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Marksman Rifle')
          }
        },
        {
          category: 'Marksman Rifle',
          alias: 'Bravo',
          name: 'MK2 Carbine',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Marksman Rifle')
          }
        },
        {
          category: 'Marksman Rifle',
          alias: 'Charlie',
          name: 'Kar98k',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Marksman Rifle')
          }
        },
        {
          category: 'Marksman Rifle',
          alias: 'Delta',
          name: 'Crossbow',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Marksman Rifle')
          }
        },
        {
          category: 'Marksman Rifle',
          alias: 'Echo',
          name: 'SKS',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Marksman Rifle')
          }
        },
        {
          category: 'Marksman Rifle',
          alias: 'Foxtrot',
          name: 'SP-R 208',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Marksman Rifle')
          }
        },
        {
          category: 'Sniper Rifle',
          alias: 'Alpha',
          name: 'Dragunov',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Sniper Rifle')
          }
        },
        {
          category: 'Sniper Rifle',
          alias: 'Bravo',
          name: 'HDR',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Sniper Rifle')
          }
        },
        {
          category: 'Sniper Rifle',
          alias: 'Charlie',
          name: 'AX-50',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Sniper Rifle')
          }
        },
        {
          category: 'Sniper Rifle',
          alias: 'Delta',
          name: 'Rytek AMR',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Sniper Rifle')
          }
        },
        {
          category: 'Melee',
          alias: 'Alpha',
          name: 'Riot Shield',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Melee', 'Riot Shield')
          }
        },
        {
          category: 'Melee',
          alias: 'Bravo',
          name: 'Combat Knife',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Melee', 'Combat Knife')
          }
        },
        {
          category: 'Melee',
          alias: 'Charlie',
          name: 'Kali Sticks',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Melee', 'Kali Sticks')
          }
        },
        {
          category: 'Melee',
          alias: 'Delta',
          name: 'Dual Kodachis',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Melee', 'Dual Kodachis')
          }
        },
        {
          category: 'Pistole',
          alias: 'Alpha',
          name: 'X16',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Pistole',
          alias: 'Bravo',
          name: '1911',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Pistole',
          alias: 'Charlie',
          name: '.357',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Pistole',
          alias: 'Delta',
          name: 'M19',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Pistole',
          alias: 'Echo',
          name: '.50 GS',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Pistole',
          alias: 'Foxtrot',
          name: 'Renetti',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Pistole',
          alias: 'Golf',
          name: 'Sykov',
          required: false,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Pistole')
          }
        },
        {
          category: 'Launchery',
          alias: 'Alpha',
          name: 'PILA',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Launchery')
          }
        },
        {
          category: 'Launchery',
          alias: 'Bravo',
          name: 'Strela-P',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Launchery')
          }
        },
        {
          category: 'Launchery',
          alias: 'Charlie',
          name: 'JOKR',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Launchery')
          }
        },
        {
          category: 'Launchery',
          alias: 'Delta',
          name: 'RPG-7',
          required: true,
          progress: {
            ...defaultProgress
          },
          mastery: {
            ...defaultMastery
          },
          challenges: {
            ...defaultChallenges('Launchery')
          }
        }
      ],
      progress: {
        ...defaultProgress
      },
      filters: {
        ...defaultFilters
      },
      reticles: [
        // ACOG Reticles
        {
          category: 'ACOG Reticle',
          name: 'Cross Dot',
          requirement: 'Dát 200 Killů using the Scout Combat Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticle',
          name: 'Angle Eye',
          requirement: 'Dát 50 headshots using the Scout Combat Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticle',
          name: 'T Pose',
          requirement: 'Dát 200 Killů using the VLK 3.0x Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticle',
          name: 'Double Cross',
          requirement: 'Dát 50 headshots using the VLK 3.0x Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticle',
          name: 'Green Cross',
          requirement: 'Dát 200 Killů using the Cronen C480 Pro Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticle',
          name: 'Redeye',
          requirement: 'Dát 50 headshots using the Cronen C480 Pro Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticle',
          name: 'Blue V',
          requirement: 'Dát 3 Killů in a single life 50 times using any ACOG Optic',
          completed: false,
        },

        // Holo Reticles
        {
          category: 'Holo Reticle',
          name: 'Downward Curve',
          requirement: 'Dát 200 Killů using the Corp Combat Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Witch',
          requirement: 'Dát 50 headshots using the Corp Combat Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Islet',
          requirement: 'Dát 200 Killů using the APX5 Holographic Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Summoner',
          requirement: 'Dát 50 headshots using the APX5 Holographic Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Orbit',
          requirement: 'Dát 200 Killů using the PBX Holo 7 Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Close Quarters',
          requirement: 'Dát 50 headshots using the PBX Holo 7 Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Sunrise',
          requirement: 'Dát 200 Killů using any Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Evil Eye',
          requirement: 'Dát 50 headshots using the any Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticle',
          name: 'Blue Dot',
          requirement: 'Dát 3 Killů without dying 150 times using any Holo Sight',
          completed: false,
        },

        // Hybrid Reticles
        {
          category: 'Hybrid Reticle',
          name: 'Chevron Tactical',
          requirement: 'Dát 200 Killů using the 4.0x Flip Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticle',
          name: 'Confine',
          requirement: 'Dát 50 headshots using the 4.0x Flip Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticle',
          name: 'Heroic',
          requirement: 'Dát 200 Killů using the Integral Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticle',
          name: 'Apotheosis',
          requirement: 'Dát 50 headshots using the Integral Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticle',
          name: 'Central Focus',
          requirement: 'Dát 200 Killů using the Canted Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticle',
          name: 'TarDát Line',
          requirement: 'Dát 50 headshots using the Canted Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticle',
          name: 'Elegance',
          requirement: 'Dát 3 Killů without dying 50 times using any Hybrid Sight',
          completed: false,
        },

        // Reflex Reticles
        {
          category: 'Reflex Reticle',
          name: 'Carrot',
          requirement: 'Dát 200 Killů using the Operator Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Add Point',
          requirement: 'Dát 50 headshots using the Operator Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Sunspot',
          requirement: 'Dát 200 Killů using the Aim-Op Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Golden Bell',
          requirement: 'Dát 50 headshots using the Aim-Op Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Standard Fare',
          requirement: 'Dát 200 Killů using the Viper Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Perfect Balance',
          requirement: 'Dát 50 headshots using the Viper Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Division',
          requirement: 'Dát 200 Killů using the Monocle Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Flare',
          requirement: 'Dát 50 headshots using the Monocle Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Green V',
          requirement: 'Dát 3 Killů in a single life 50 times using any Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticle',
          name: 'Blue Dot',
          requirement: 'Dát 500 Killů using any Reflex Sight.',
          completed: false,
        },

        // Sniper Reticles
        {
          category: 'Sniper Reticle',
          name: 'Crossthread',
          requirement: 'Dát 200 Killů using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Pinpoint',
          requirement: 'Dát 50 headshots using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'One Breath',
          requirement: 'Dát 3 Killů without dying using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Hangman',
          requirement: 'Dát 100 longshot Killů using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Drop Angle',
          requirement: 'Dát 150 mounted Killů using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Circle Pit',
          requirement: 'Dát 200 Killů using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Cover Shot',
          requirement: 'Dát 50 headshots using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Top Notch',
          requirement: 'Kill 3 enemies without dying 25 times while using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Marksman',
          requirement: 'Dát 100 longshot Killů using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Grid Line',
          requirement: 'Dát 150 mounted Killů using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticle',
          name: 'Critical',
          requirement: 'Dát 500 Killů using any Sniper Optic',
          completed: false,
        },

        // Thermal Hybrid Reticles
        {
          category: 'Thermal Hybrid Reticle',
          name: 'Dark Horizon',
          requirement: 'Dát 200 Killů using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticle',
          name: 'Stealth Bomber',
          requirement: 'Dát 50 headshots using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticle',
          name: 'Spectre',
          requirement: 'Dát 50 double Killů using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticle',
          name: 'Tracker',
          requirement: 'Dát 150 mounted Killů using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticle',
          name: 'Quadrants',
          requirement: 'Dát 150 longshot Killů using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticle',
          name: 'All-Seeing',
          requirement: 'Dát 3 Killů without dying 25 times using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticle',
          name: 'Pearl',
          requirement: 'Dát 500 Killů using the Thermal Hybrid Scope',
          completed: false,
        },

        // Thermal Reticles
        {
          category: 'Thermal Reticle',
          name: 'Weave',
          requirement: 'Dát 200 Killů using the Solozero NVG Enhanced Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticle',
          name: 'Drop Pad',
          requirement: 'Dát 50 headshots using the Solozero NVG Enhanced Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticle',
          name: 'Cerberus',
          requirement: 'Dát 200 Killů using the Merc Thermal Optic Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticle',
          name: 'Zip Pad',
          requirement: 'Dát 50 headshots using the Merc Thermal Optic Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticle',
          name: 'Wright Sight',
          requirement: 'Dát 200 Killů using the Thermal Dual Power Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticle',
          name: 'Optical Illusion',
          requirement: 'Dát 50 headshots using the Thermal Dual Power Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticle',
          name: 'Beasts of Prey',
          requirement: 'Dát 3 Killů without dying 50 times using any Thermal Scope',
          completed: false,
        },
      ]
    }
  },
  mutations: {
    SET_PROGRESS(state, weapons) {
      state.weapons = state.defaults.weapons;

      if (weapons) {
        weapons.forEach(weapon => {
          state.weapons.find(w => w.name === weapon.name).progress = {
            ...defaultProgress,
            ...weapon.progress
          };

          state.weapons.find(w => w.name === weapon.name).mastery = {
            ...defaultMastery,
            ...weapon.mastery
          };

          state.weapons.find(w => w.name === weapon.name).challenges = {
            ...defaultChallenges(weapon.category, weapon.name),
            ...weapon.challenges
          };
        });
      }
    },

    SET_RETICLES(state, reticles) {
      state.reticles = state.defaults.reticles;

      if (reticles) {
        reticles.forEach(reticle => {
          state.reticles.find(r => r.category === reticle.category && r.name === reticle.name).completed = reticle.completed;
        });
      }
    },

    SET_FILTERS(state, { type, filters }) {
      if (type === null) {
        // Handle updates to default filter object
        if (filters) {
          Object.keys(state.defaults.filters).forEach(key => {
            if (!(key in filters)) {
              filters = null;
            }
          });
        }

        state.filters = filters || state.defaults.filters;
      } else {
        state.filters[type] = filters || state.defaults.filters[type];
      }
    },

    TOGGLE_COMPLETED(state, { weapon, camo, current }) {
      const masteryCamo = camo in defaultMastery;

      if (masteryCamo) {
        state.weapons.find(w => w.name === weapon.name).mastery[camo] = !current;
      } else {
        state.weapons.find(w => w.name === weapon.name).progress[camo] = !current;
      }
    },

    TOGGLE_CHALLENGE_COMPLETED(state, { weapon, challenge }) {
      let challenges = state.weapons.find(w => w.name === weapon.name).challenges;

      Object.keys(challenges).forEach(c => {
        if (challenges[c].category === challenge.category && challenges[c].level === challenge.level) {
          challenges[c].completed = !challenge.completed;
        }
      });
    },

    TOGGLE_WEAPON_COMPLETED(state, { weapon, current, mode }) {
      let selectedWeapon = state.weapons.find(w => w.name === weapon.name);

      if (mode === 'Camouflages') {
        Object.keys(selectedWeapon.progress).forEach(camo => selectedWeapon.progress[camo] = !current);
      } else if (mode === 'Challenges') {
        Object.keys(selectedWeapon.challenges).forEach(challenge => selectedWeapon.challenges[challenge].completed = !current);
      }
    },

    TOGGLE_RETICLE_COMPLETED(state, { reticle }) {
      console.log(reticle);
      state.reticles.find(r => r.category === reticle.category && r.name === reticle.name).completed = !reticle.completed;
    },

    RESET_PROGRESS(state) {
      state.weapons.forEach(weapon => Object.keys(weapon.progress).forEach(camo => weapon.progress[camo] = false));
    },

    RESET_MASTERY(state) {
      state.weapons.forEach(weapon => Object.keys(weapon.mastery).forEach(camo => weapon.mastery[camo] = false));
    },

    RESET_CHALLENGES(state) {
      state.weapons.forEach(weapon => Object.keys(weapon.challenges).forEach(challenge => weapon.challenges[challenge].completed = false));
    },

    RESET_RETICLES(state) {
      state.reticles.forEach(reticle => reticle.completed = false);
    },

    // DEBUG
    COMPLETE_DAMASCUS(state) {
      state.weapons.filter(weapon => weapon.required)
                   .forEach(weapon => Object.keys(weapon.progress)
                   .forEach(camo => weapon.progress[camo] = true));
    },
    COMPLETE_ALL(state) {
      state.weapons.forEach(weapon => Object.keys(weapon.progress)
                   .forEach(camo => weapon.progress[camo] = true));
    },
    COMPLETE_MASTERY(state) {
      state.weapons.forEach(weapon => Object.keys(weapon.mastery)
                   .forEach(camo => weapon.mastery[camo] = true));
    },
    COMPLETE_CHALLENGES(state) {
      state.weapons.forEach(weapon => Object.keys(weapon.challenges)
                   .forEach(challenge => weapon.challenges[challenge].completed = true));
    },
    COMPLETE_ALL_BUT_ONE(state) {
      state.weapons.forEach((weapon, weaponIndex) => Object.keys(weapon.progress)
                   .forEach((camo, camoIndex) => {
                     if (!(weaponIndex === 0 && camoIndex === 0)) {
                      weapon.progress[camo] = true;
                     }
                   }));
    }
  },
  actions: {
    async getStoredData({ dispatch }) {
      await dispatch('getProgress');
      await dispatch('getFilters');
      await dispatch('getReticles');

      await dispatch('storeData');
    },

    getProgress(context) {
      const data = JSON.parse(localStorage.getItem(token));
      const weapons = data ? data.weapons : null;
      context.commit('SET_PROGRESS', weapons);
    },

    getFilters(context) {
      const data = JSON.parse(localStorage.getItem(token));
      const filters = data ? data.filters : null;
      context.commit('SET_FILTERS', { type: null, filters });
    },

    getReticles(context) {
      const data = JSON.parse(localStorage.getItem(token));
      const reticles = data ? data.reticles : null;
      context.commit('SET_RETICLES', reticles);
    },

    setFilters(context, filters) {
      context.commit('SET_FILTERS', filters);
      context.dispatch('storeData');
    },

    toggleCompleted(context, { weapon, camo, current }) {
      context.commit('TOGGLE_COMPLETED', { weapon, camo, current });
      context.dispatch('storeData');
    },

    toggleChallengeCompleted(context, { weapon, challenge }) {
      context.commit('TOGGLE_CHALLENGE_COMPLETED', { weapon, challenge });
      context.dispatch('storeData');
    },

    toggleWeaponCompleted(context, { weapon, current, mode }) {
      context.commit('TOGGLE_WEAPON_COMPLETED', { weapon, current, mode });
      context.dispatch('storeData');
    },

    toggleReticleCompleted(context, { reticle, current }) {
      context.commit('TOGGLE_RETICLE_COMPLETED', { reticle, current });
      context.dispatch('storeData');
    },

    resetAll(context) {
      context.commit('RESET_PROGRESS');
      context.commit('RESET_MASTERY');
      context.commit('RESET_RETICLES');
      context.commit('RESET_CHALLENGES');
      Vue.notify({
        type: 'success',
        title: 'Všechen progress byl úšpěšně resetován!'
      });
    },

    resetProgress(context) {
      context.commit('RESET_PROGRESS');
      context.commit('RESET_MASTERY');
      context.dispatch('storeData');
      Vue.notify({
        type: 'success',
        title: 'Progress kamufláží byl úšpěšně resetován!'
      });
    },

    resetReticles(context) {
      context.commit('RESET_RETICLES');
      context.dispatch('storeData');
      Vue.notify({
        type: 'success',
        title: 'Progress reticlů byl úšpěšně resetován!'
      });
    },

    resetChallenges(context) {
      context.commit('RESET_CHALLENGES');
      context.dispatch('storeData');
      Vue.notify({
        type: 'success',
        title: 'Progres Master Challenges byl úšpěšně resetován!'
      });
    },

    clearLocalStorage(context) {
      localStorage.removeItem(token);

      setTimeout(() => {
        context.dispatch('resetProgress');
      }, 500);
    },

    exportProgress() {
      const dataStr = JSON.stringify(this.state.weapons);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const fileName = `damascus_${ new Date().toLocaleDateString('sv-SE').replace(/\//g, '-') }.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
    },

    importProgress(context, progress) {
      context.commit('SET_PROGRESS', progress);
      context.dispatch('storeData');
    },

    storeData() {
      localStorage.setItem(token, JSON.stringify({
        weapons: this.state.weapons,
        filters: this.state.filters,
        reticles: this.state.reticles
      }));
    },

    // DEBUG
    completeDamascus(context) {
      context.commit('COMPLETE_DAMASCUS');
      context.dispatch('storeData');
    },
    completeAll(context) {
      context.commit('COMPLETE_ALL');
      context.dispatch('storeData');
    },
    completeMastery(context) {
      context.commit('COMPLETE_MASTERY');
      context.dispatch('storeData');
    },
    completeChallenges(context) {
      context.commit('COMPLETE_CHALLENGES');
      context.dispatch('storeData');
    },
    completeAllButOne(context) {
      context.commit('COMPLETE_ALL_BUT_ONE');
      context.dispatch('storeData');
    },
    resetMastery(context) {
      context.commit('RESET_MASTERY');
      context.dispatch('storeData');
    },
  },
  modules: {
  }
})
