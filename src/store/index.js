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
  let attachPrefix = attachCount !== undefined ? `Using ${attachCount} Attachments, ` : '';
  return `${attachPrefix}${strings[0]} ${count} ${strings[1]}`;
}

const challengeTypes = {
  adsNoStock: ['Get', 'Aiming Down Sight Killù with the No Stock attachment option selected'],
  adsFoldedStock: ['Get', 'Aiming Down Sight Killù with the Folded Stock selected'],
  adsLaser: ['Get', 'Killù while Aiming Down Sights and using a Laser attachment'],
  scoutLongshot: ['Get', 'Longshot Killù while using the Scout Combat Optic'],
  behindEnemy: ['Get', 'Killù while behind the enemy'],
  akimboReflex: ['Get', 'Killù using the Akimbo weapon perk and a Reflex Optic'],
  aerialVehicle: ['Destroy', 'Aerial Vehicles'],
  sliding: ['Get', 'Killù while sliding'],
  quickscope: ['Get', 'Quickscope Killù'],
  buzzkill: ['Get', 'BuzzKillù (End Enemy Streaks)'],
  crouching: ['Get', 'Killù while crouching'],
  inSmoke: ['Get', 'Killù while in smoke'],
  scoutOptic: ['Get', 'Killù while using a Scout Combat Optic'],
  sniperScope: ['Get', 'Killù while using a sniper scope'], // not capitalised in-game
  hipfire: ['Get', 'Hipfire Killù'],
  longshot: ['Get', 'Longshot Killù'],
  pointBlankHeadshot: ['Get', 'Point Blank Headshot Killù'],
  slidingHeadshot: ['Get', 'Headshot Killù while sliding'],
  inSmokeHeadshot: ['Get', 'Headshot Killù while in smoke'],
  crouchingHeadshot: ['Get', 'Headshot Killù while crouching'],
  mountedLongshot: ['Get', 'Mounted Longshot Killù'],
  threeStreakTracker: ['Get', 'Killù without dying and while using the Tracker Perk 10 times'],
  doubleKillTracker: ['Get', 'Double Killù while using the Tracker Perk'],
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
          'Assault Rifle': '800 Killù',
          'Submachine Gun': {
            'AUG': '500 Killù',
            'P90': '500 Killù',
            'MP5': '500 Killù',
            'Uzi': '500 Killù',
            'PP19 Bizon': '500 Killù',
            'MP7': '500 Killù',
            'Striker 45': '500 Killù',
            'Fennec': '250 Killù',
            'ISO': '250 Killù',
            'CX-9': '250 Killù'
          },
          'Brokovnice': '400 Killù',
          'Light Machine Gun': '525 Killù',
          'Marksman Rifle': '450 Killù',
          'Sniper Rifle': '450 Killù',
          'Melee': '200 Killù',
          'Pistole': '250 Killù',
          'Launchery': '125 Killù'
        }
      },
      {
        name: 'Woodland',
        requirements: {
          'Assault Rifle': '125 Headshot Killù',
          'Submachine Gun': {
            'AUG': '100 Headshot Killù',
            'P90': '100 Headshot Killù',
            'MP5': '100 Headshot Killù',
            'Uzi': '100 Headshot Killù',
            'PP19 Bizon': '100 Headshot Killù',
            'MP7': '100 Headshot Killù',
            'Striker 45': '100 Headshot Killù',
            'Fennec': '50 Headshot Killù',
            'ISO': '50 Headshot Killù',
            'CX-9': '50 Headshot Killù'
          },
          'Brokovnice': '75 Crouching Killù',
          'Light Machine Gun': '75 Headshot Killù',
          'Marksman Rifle': '60 Headshot Killù',
          'Sniper Rifle': '60 Headshot Killù',
          'Melee': '50 Killù while injured',
          'Pistole': '50 Headshot Killù',
          'Launchery': '40 Attacker Killù'
        }
      },
      {
        name: 'Digital',
        requirements: {
          'Assault Rifle': '160 Crouching Killù',
          'Submachine Gun': {
            'AUG': '110 Crouching Killù',
            'P90': '110 Crouching Killù',
            'MP5': '110 Crouching Killù',
            'Uzi': '110 Crouching Killù',
            'PP19 Bizon': '110 Crouching Killù',
            'MP7': '110 Crouching Killù',
            'Striker 45': '110 Crouching Killù',
            'Fennec': '40 Crouching Killù',
            'ISO': '40 Crouching Killù',
            'CX-9': '40 Crouching Killù'
          },
          'Brokovnice': '75 Hipfire Killù',
          'Light Machine Gun': '65 Crouching Killù',
          'Marksman Rifle': '50 Crouching Killù',
          'Sniper Rifle': '50 Crouching Killù',
          'Melee': '50 Killù from behind',
          'Pistole': '40 Crouching Killù',
          'Launchery': '40 Defender Killù'
        }
      },
      {
        name: 'Dragon',
        requirements: {
          'Assault Rifle': '75 Hipfire Killù',
          'Submachine Gun': {
            'AUG': '100 Hipfire Killù',
            'P90': '100 Hipfire Killù',
            'MP5': '100 Hipfire Killù',
            'Uzi': '100 Hipfire Killù',
            'PP19 Bizon': '100 Hipfire Killù',
            'MP7': '100 Hipfire Killù',
            'Striker 45': '100 Hipfire Killù',
            'Fennec': '30 Hipfire Killù',
            'ISO': '30 Hipfire Killù',
            'CX-9': '30 Hipfire Killù'
          },
          'Brokovnice': '50 Point Blank Killù',
          'Light Machine Gun': '45 Hipfire Killù',
          'Marksman Rifle': '50 One Shot Killù',
          'Sniper Rifle': '50 One Shot Killù',
          'Melee': '30 Killù while using Dead Silence',
          'Pistole': '30 Hipfire Killù',
          'Launchery': '75 Aerial Killùtreaks Destroyed'
        }
      },
      {
        name: 'Splinter',
        requirements: {
          'Assault Rifle': '100 Longshot Killù',
          'Submachine Gun': {
            'AUG': '50 Longshot Killù',
            'P90': '50 Longshot Killù',
            'MP5': '50 Longshot Killù',
            'Uzi': '50 Longshot Killù',
            'PP19 Bizon': '50 Longshot Killù',
            'MP7': '50 Longshot Killù',
            'Striker 45': '50 Longshot Killù',
            'Fennec': '30 Longshot Killù',
            'ISO': '30 Longshot Killù',
            'CX-9': '30 Longshot Killù'
          },
          'Brokovnice': {
            'Model 680': '50 Headshot Killù',
            'R9-0': '50 Headshot Killù',
            '725': '50 Longshot Killù',
            'Origin 12': '50 Headshot Killù',
            'VLK Rogue': '50 Headshot Killù',
            'JAK-12': '50 Headshot Killù'
          },
          'Light Machine Gun': '45 Longshot Killù',
          'Marksman Rifle': {
            'EBR-14': '150 Killù while using all attachments',
            'MK2 Carbine': '150 Killù while using all attachments',
            'Kar98k': '150 Killù while using all attachments',
            'Crossbow': '150 Killù while using all attachments',
            'SKS': '150 Killù while using all attachments',
            'SP-R 208': '50 Longshot Killù'
          },
          'Sniper Rifle': '150 Killù while using all attachments',
          'Melee': '50 Crouching Killù',
          'Pistole': '30 Longshot Killù',
          'Launchery': '75 Ground vehicles destroyed'
        }
      },
      {
        name: 'Topo',
        requirements: {
          'Assault Rifle': '100 Mounted Killù',
          'Submachine Gun': {
            'AUG': '50 Mounted Killù',
            'P90': '50 Mounted Killù',
            'MP5': '50 Mounted Killù',
            'Uzi': '50 Mounted Killù',
            'PP19 Bizon': '50 Mounted Killù',
            'MP7': '50 Mounted Killù',
            'Striker 45': '50 Mounted Killù',
            'Fennec': '25 Double Killù',
            'ISO': '25 Double Killù',
            'CX-9': '25 Double Killù'
          },
          'Brokovnice': '225 Killù while using all attachments',
          'Light Machine Gun': '45 Mounted Killù',
          'Marksman Rifle': {
            'EBR-14': '50 Longshot Killù',
            'MK2 Carbine': '50 Longshot Killù',
            'Kar98k': '50 Longshot Killù',
            'Crossbow': '50 Longshot Killù',
            'SKS': '25 Double Killù',
            'SP-R 208': '25 Double Killù'
          },
          'Sniper Rifle': '50 Longshot Killù',
          'Melee': {
            'Riot Shield': '25 2-streaks',
            'Combat Knife': '25 Double Killù',
            'Kali Sticks': '25 Double Killù',
            'Dual Kodachis': '25 Double Killù'
          },
          'Pistole': '25 Double Killù',
          'Launchery': '50 Equipment, Killùtreaks, or vehicles destroyed'
        }
      },
      {
        name: 'Tiger',
        requirements: {
          'Assault Rifle': '180 Killù while using all attachments',
          'Submachine Gun': {
            'AUG': '250 Killù while using all attachments',
            'P90': '250 Killù while using all attachments',
            'MP5': '250 Killù while using all attachments',
            'Uzi': '250 Killù while using all attachments',
            'PP19 Bizon': '250 Killù while using all attachments',
            'MP7': '250 Killù while using all attachments',
            'Striker 45': '250 Killù while using all attachments',
            'Fennec': '110 Killù while using all attachments',
            'ISO': '110 Killù while using all attachments',
            'CX-9': '110 Killù while using all attachments'
          },
          'Brokovnice': '25 Double Killù',
          'Light Machine Gun': '180 Killù while using all attachments',
          'Marksman Rifle': {
            'EBR-14': '50 Mounted Killù',
            'MK2 Carbine': '50 Mounted Killù',
            'Kar98k': '50 Mounted Killù',
            'Crossbow': '50 Mounted Killù',
            'SKS': '50 Mounted Killù',
            'SP-R 208': '150 Killù while using all attachments'
          },
          'Sniper Rifle': '50 Mounted Killù',
          'Melee': {
            'Riot Shield': '50 Killù near smoke',
            'Combat Knife': '25 Killù near smoke',
            'Kali Sticks': '50 Killù near smoke',
            'Dual Kodachis': '50 Killù near smoke'
          },
          'Pistole': '110 Killù while using all attachments',
          'Launchery': '50 Supportstreaks destroyed'
        }
      },
      {
        name: 'Stripes',
        requirements: {
          'Assault Rifle': '50 Killù shortly after reload',
          'Submachine Gun': {
            'AUG': '40 Killù shortly after reload',
            'P90': '40 Killù shortly after reload',
            'MP5': '40 Killù shortly after reload',
            'Uzi': '40 Killù shortly after reload',
            'PP19 Bizon': '40 Killù shortly after reload',
            'MP7': '40 Killù shortly after reload',
            'Striker 45': '40 Killù shortly after reload',
            'Fennec': '25 Killù shortly after reload',
            'ISO': '25 Killù shortly after reload',
            'CX-9': '25 Killù shortly after reload'
          },
          'Brokovnice': '30 Killù shortly after reload',
          'Light Machine Gun': '30 Double Killù',
          'Marksman Rifle': {
            'EBR-14': '25 Double Killù',
            'MK2 Carbine': '25 Double Killù',
            'Kar98k': '25 Double Killù',
            'Crossbow': '25 Double Killù',
            'SKS': '25 Double Killù',
            'SP-R 208': '50 Mounted Killù'
          },
          'Sniper Rifle': '25 Double Killù',
          'Melee': '10 BuzzKillù',
          'Pistole': '25 Killù shortly after reload',
          'Launchery': '50 Killùtreaks destroyed'
        }
      },
      {
        name: 'Reptile',
        requirements: {
          'Assault Rifle': '110 Killù while using no attachments',
          'Submachine Gun': '75 Killù while using no attachments',
          'Brokovnice': '110 Killù while using no attachments',
          'Light Machine Gun': '75 Killù while using no attachments',
          'Marksman Rifle': '75 Killù while using no attachments',
          'Sniper Rifle': '75 Killù while using no attachments',
          'Melee': '25 Finisher Killù',
          'Pistole': '75 Killù while using no attachments',
          'Launchery': '50 Killù with Amped perk'
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
          'Launchery': '50 vehicles destroyed'
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
            'PILA': 'Destroy a vehicle or Killùtreak 100 times',
            'Strela-P': 'Destroy a vehicle or Killùtreak 100 times',
            'JOKR': 'Destroy a vehicle or Killùtreak 100 times'
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
            'Assault Rifle': 'Get 500 Killù',
            'Submachine Gun': 'Get 500 Killù',
            'Brokovnice': 'Get 500 Killù',
            'Light Machine Gun': 'Get 500 Killù',
            'Marksman Rifle': 'Get 500 Killù',
            'Sniper Rifle': 'Get 500 Killù',
            'Melee': 'Get 500 Killù',
            'Pistole': 'Get 500 Killù'
          },
          'Damascus': {
            'Assault Rifle': 'Get 2000 Killù',
            'Submachine Gun': 'Get 2000 Killù',
            'Brokovnice': 'Get 2000 Killù',
            'Light Machine Gun': 'Get 2000 Killù',
            'Marksman Rifle': 'Get 2000 Killù',
            'Sniper Rifle': 'Get 2000 Killù',
            'Melee': {
              'Combat Knife': 'Get 2000 Killù',
              'Riot Shield': 'Get 1250 Killù',
              'Kali Sticks': 'Get 2000 Killù',
              'Dual Kodachis': 'Get 2000 Killù'
            },
            'Pistole': 'Get 2000 Killù'
          }
        }
      },

      // Vehicle Destruction
      {
        category: 'Vehicle Destruction',
        levels: {
          'Gold': {
            'Launchery': 'Destroy 200 Vehicles or Killùtreaks'
          },
          'Damascus': {
            'Launchery': 'Destroy 800 Vehicles or Killùtreaks'
          }
        }
      },

      // Headshot
      {
        category: 'Headshot',
        levels: {
          'Platinum': {
            'Assault Rifle': 'Get 250 Headshots',
            'Submachine Gun': 'Get 250 Headshots',
            'Brokovnice': 'Get 250 Headshots',
            'Light Machine Gun': 'Get 250 Headshots',
            'Marksman Rifle': 'Get 250 Headshots',
            'Sniper Rifle': 'Get 250 Headshots',
            'Pistole': 'Get 250 Headshots'
          },
          'Obsidian': {
            'Assault Rifle': 'Get 750 Headshots',
            'Submachine Gun': 'Get 750 Headshots',
            'Brokovnice': 'Get 750 Headshots',
            'Light Machine Gun': 'Get 750 Headshots',
            'Marksman Rifle': 'Get 750 Headshots',
            'Sniper Rifle': 'Get 750 Headshots',
            'Pistole': 'Get 750 Headshots'
          }
        }
      },

      // Survival
      {
        category: 'Survival',
        levels: {
          'Platinum': {
            'Melee': {
              'Riot Shield': 'Get 2 Killù without dying 100 times'
            },
          },
          'Obsidian': {
            'Melee': {
              'Riot Shield': 'Get 2 Killù without dying 200 times'
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
              'Combat Knife': 'Get a Double kill 100 times',
              'Kali Sticks': 'Get a Double kill 100 times',
              'Dual Kodachis': 'Get a Double kill 100 times'
            },
            'Launchery': 'Get a Double kill 75 times'
          },
          'Obsidian': {
            'Melee': {
              'Combat Knife': 'Get a Double kill 300 times',
              'Kali Sticks': 'Get a Double kill 300 times',
              'Dual Kodachis': 'Get a Double kill 300 times'
            },
            'Launchery': 'Get a Double kill 325 times'
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
        // ACOG Reticlys
        {
          category: 'ACOG Reticly',
          name: 'Cross Dot',
          requirement: 'Get 200 Killù using the Scout Combat Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticly',
          name: 'Angle Eye',
          requirement: 'Get 50 headshots using the Scout Combat Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticly',
          name: 'T Pose',
          requirement: 'Get 200 Killù using the VLK 3.0x Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticly',
          name: 'Double Cross',
          requirement: 'Get 50 headshots using the VLK 3.0x Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticly',
          name: 'Green Cross',
          requirement: 'Get 200 Killù using the Cronen C480 Pro Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticly',
          name: 'Redeye',
          requirement: 'Get 50 headshots using the Cronen C480 Pro Optic',
          completed: false,
        },
        {
          category: 'ACOG Reticly',
          name: 'Blue V',
          requirement: 'Get 3 Killù in a single life 50 times using any ACOG Optic',
          completed: false,
        },

        // Holo Reticlys
        {
          category: 'Holo Reticly',
          name: 'Downward Curve',
          requirement: 'Get 200 Killù using the Corp Combat Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Witch',
          requirement: 'Get 50 headshots using the Corp Combat Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Islet',
          requirement: 'Get 200 Killù using the APX5 Holographic Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Summoner',
          requirement: 'Get 50 headshots using the APX5 Holographic Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Orbit',
          requirement: 'Get 200 Killù using the PBX Holo 7 Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Close Quarters',
          requirement: 'Get 50 headshots using the PBX Holo 7 Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Sunrise',
          requirement: 'Get 200 Killù using any Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Evil Eye',
          requirement: 'Get 50 headshots using the any Holo Sight',
          completed: false,
        },
        {
          category: 'Holo Reticly',
          name: 'Blue Dot',
          requirement: 'Get 3 Killù without dying 150 times using any Holo Sight',
          completed: false,
        },

        // Hybrid Reticlys
        {
          category: 'Hybrid Reticly',
          name: 'Chevron Tactical',
          requirement: 'Get 200 Killù using the 4.0x Flip Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticly',
          name: 'Confine',
          requirement: 'Get 50 headshots using the 4.0x Flip Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticly',
          name: 'Heroic',
          requirement: 'Get 200 Killù using the Integral Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticly',
          name: 'Apotheosis',
          requirement: 'Get 50 headshots using the Integral Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticly',
          name: 'Central Focus',
          requirement: 'Get 200 Killù using the Canted Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticly',
          name: 'Target Line',
          requirement: 'Get 50 headshots using the Canted Hybrid Sight',
          completed: false,
        },
        {
          category: 'Hybrid Reticly',
          name: 'Elegance',
          requirement: 'Get 3 Killù without dying 50 times using any Hybrid Sight',
          completed: false,
        },

        // Reflex Reticlys
        {
          category: 'Reflex Reticly',
          name: 'Carrot',
          requirement: 'Get 200 Killù using the Operator Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Add Point',
          requirement: 'Get 50 headshots using the Operator Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Sunspot',
          requirement: 'Get 200 Killù using the Aim-Op Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Golden Bell',
          requirement: 'Get 50 headshots using the Aim-Op Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Standard Fare',
          requirement: 'Get 200 Killù using the Viper Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Perfect Balance',
          requirement: 'Get 50 headshots using the Viper Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Division',
          requirement: 'Get 200 Killù using the Monocle Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Flare',
          requirement: 'Get 50 headshots using the Monocle Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Green V',
          requirement: 'Get 3 Killù in a single life 50 times using any Reflex Sight',
          completed: false,
        },
        {
          category: 'Reflex Reticly',
          name: 'Blue Dot',
          requirement: 'Get 500 Killù using any Reflex Sight.',
          completed: false,
        },

        // Sniper Reticlys
        {
          category: 'Sniper Reticly',
          name: 'Crossthread',
          requirement: 'Get 200 Killù using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Pinpoint',
          requirement: 'Get 50 headshots using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'One Breath',
          requirement: 'Get 3 Killù without dying using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Hangman',
          requirement: 'Get 100 longshot Killù using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Drop Angle',
          requirement: 'Get 150 mounted Killù using the Sniper Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Circle Pit',
          requirement: 'Get 200 Killù using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Cover Shot',
          requirement: 'Get 50 headshots using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Top Notch',
          requirement: 'Kill 3 enemies without dying 25 times while using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Marksman',
          requirement: 'Get 100 longshot Killù using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Grid Line',
          requirement: 'Get 150 mounted Killù using the Variable Zoom Scope',
          completed: false,
        },
        {
          category: 'Sniper Reticly',
          name: 'Critical',
          requirement: 'Get 500 Killù using any Sniper Optic',
          completed: false,
        },

        // Thermal Hybrid Reticlys
        {
          category: 'Thermal Hybrid Reticly',
          name: 'Dark Horizon',
          requirement: 'Get 200 Killù using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticly',
          name: 'Stealth Bomber',
          requirement: 'Get 50 headshots using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticly',
          name: 'Spectre',
          requirement: 'Get 50 double Killù using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticly',
          name: 'Tracker',
          requirement: 'Get 150 mounted Killù using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticly',
          name: 'Quadrants',
          requirement: 'Get 150 longshot Killù using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticly',
          name: 'All-Seeing',
          requirement: 'Get 3 Killù without dying 25 times using the Thermal Hybrid Scope',
          completed: false,
        },
        {
          category: 'Thermal Hybrid Reticly',
          name: 'Pearl',
          requirement: 'Get 500 Killù using the Thermal Hybrid Scope',
          completed: false,
        },

        // Thermal Reticlys
        {
          category: 'Thermal Reticly',
          name: 'Weave',
          requirement: 'Get 200 Killù using the Solozero NVG Enhanced Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticly',
          name: 'Drop Pad',
          requirement: 'Get 50 headshots using the Solozero NVG Enhanced Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticly',
          name: 'Cerberus',
          requirement: 'Get 200 Killù using the Merc Thermal Optic Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticly',
          name: 'Zip Pad',
          requirement: 'Get 50 headshots using the Merc Thermal Optic Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticly',
          name: 'Wright Sight',
          requirement: 'Get 200 Killù using the Thermal Dual Power Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticly',
          name: 'Optical Illusion',
          requirement: 'Get 50 headshots using the Thermal Dual Power Scope',
          completed: false,
        },
        {
          category: 'Thermal Reticly',
          name: 'Beasts of Prey',
          requirement: 'Get 3 Killù without dying 50 times using any Thermal Scope',
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
        title: 'Všechen progress byl úšpìšnì resetován!'
      });
    },

    resetProgress(context) {
      context.commit('RESET_PROGRESS');
      context.commit('RESET_MASTERY');
      context.dispatch('storeData');
      Vue.notify({
        type: 'success',
        title: 'Progress kamufláží byl úšpìšnì resetován!'
      });
    },

    resetReticles(context) {
      context.commit('RESET_RETICLES');
      context.dispatch('storeData');
      Vue.notify({
        type: 'success',
        title: 'Progress reticlù byl úšpìšnì resetován!'
      });
    },

    resetChallenges(context) {
      context.commit('RESET_CHALLENGES');
      context.dispatch('storeData');
      Vue.notify({
        type: 'success',
        title: 'Progres Master Challenges byl úšpìšnì resetován!'
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
