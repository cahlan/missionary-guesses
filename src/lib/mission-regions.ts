import { US_MISSIONS, WORLD_MISSIONS } from "./missions";

// Map US missions to their state
export function getMissionsByState(): Record<string, string[]> {
  const byState: Record<string, string[]> = {};
  for (const mission of US_MISSIONS) {
    // Format is "State City" — extract state name (everything before the last word(s) that form the city)
    // States are the first word(s) before the city name
    const state = getStateFromMission(mission);
    if (!byState[state]) byState[state] = [];
    byState[state].push(mission);
  }
  return byState;
}

function getStateFromMission(mission: string): string {
  // US missions are formatted as "State City" e.g. "California Los Angeles"
  // We know all the state names, so match against them
  for (const state of US_STATE_NAMES) {
    if (mission.startsWith(state + " ") || mission === state) {
      return state;
    }
  }
  return mission;
}

// Map world missions to their country
export function getMissionsByCountry(): Record<string, string[]> {
  const byCountry: Record<string, string[]> = {};
  for (const mission of WORLD_MISSIONS) {
    const country = getCountryFromMission(mission);
    if (!byCountry[country]) byCountry[country] = [];
    byCountry[country].push(mission);
  }
  return byCountry;
}

function getCountryFromMission(mission: string): string {
  for (const country of WORLD_COUNTRY_NAMES) {
    if (mission.startsWith(country + " ") || mission === country) {
      return country;
    }
  }
  // Handle special compound names
  return mission.split(" ")[0];
}

const US_STATE_NAMES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const WORLD_COUNTRY_NAMES = [
  // Sorted longest-first so "Côte d'Ivoire" matches before "Côte"
  "Dominican Republic", "Marshall Islands", "Papua New Guinea",
  "Trinidad and Tobago", "Côte d'Ivoire", "Czech/Slovak",
  "Armenia/Georgia", "Belgium/Netherlands", "Belize/Guatemala",
  "Ireland/Northern Ireland", "Scotland/Ireland", "Wales/England",
  "New Zealand", "North Korea", "South Africa", "Sri Lanka",
  "El Salvador", "Costa Rica", "Puerto Rico", "Sierra Leone",
  "Argentina", "Australia", "Bolivia", "Botswana", "Brazil",
  "Bulgaria", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Chad", "Chile", "Colombia", "Congo", "Croatia", "Denmark",
  "Dominican", "Ecuador", "England", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Germany", "Ghana", "Greece", "Guatemala",
  "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland",
  "India", "Indonesia", "Italy", "Jamaica", "Japan", "Kenya",
  "Kiribati", "Korea", "Liberia", "Madagascar", "Malawi", "Malaysia",
  "Mauritius", "Mexico", "Micronesia", "Mongolia", "Mozambique",
  "Namibia", "Nepal", "Nicaragua", "Nigeria", "Norway", "Pakistan",
  "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Romania", "Russia", "Rwanda", "Samoa", "Senegal", "Serbia",
  "Singapore", "Slovenia", "Spain", "Sweden", "Switzerland",
  "Taiwan", "Tanzania", "Thailand", "Togo", "Tonga", "Uganda",
  "Ukraine", "Uruguay", "Vanuatu", "Venezuela", "Zambia", "Zimbabwe",
  "Albania", "Austria", "Baltic", "Benin",
];

// Mapping from TopoJSON property names to our state names
export const TOPO_TO_STATE: Record<string, string> = {
  "Alabama": "Alabama", "Alaska": "Alaska", "Arizona": "Arizona",
  "Arkansas": "Arkansas", "California": "California", "Colorado": "Colorado",
  "Connecticut": "Connecticut", "Delaware": "Delaware", "Florida": "Florida",
  "Georgia": "Georgia", "Hawaii": "Hawaii", "Idaho": "Idaho",
  "Illinois": "Illinois", "Indiana": "Indiana", "Iowa": "Iowa",
  "Kansas": "Kansas", "Kentucky": "Kentucky", "Louisiana": "Louisiana",
  "Maine": "Maine", "Maryland": "Maryland", "Massachusetts": "Massachusetts",
  "Michigan": "Michigan", "Minnesota": "Minnesota", "Mississippi": "Mississippi",
  "Missouri": "Missouri", "Montana": "Montana", "Nebraska": "Nebraska",
  "Nevada": "Nevada", "New Hampshire": "New Hampshire",
  "New Jersey": "New Jersey", "New Mexico": "New Mexico",
  "New York": "New York", "North Carolina": "North Carolina",
  "North Dakota": "North Dakota", "Ohio": "Ohio", "Oklahoma": "Oklahoma",
  "Oregon": "Oregon", "Pennsylvania": "Pennsylvania",
  "Rhode Island": "Rhode Island", "South Carolina": "South Carolina",
  "South Dakota": "South Dakota", "Tennessee": "Tennessee", "Texas": "Texas",
  "Utah": "Utah", "Vermont": "Vermont", "Virginia": "Virginia",
  "Washington": "Washington", "West Virginia": "West Virginia",
  "Wisconsin": "Wisconsin", "Wyoming": "Wyoming",
};

// Mapping from Natural Earth country names to our country keys
export const TOPO_TO_COUNTRY: Record<string, string> = {
  "United States of America": "",  // skip US on world map
  "Argentina": "Argentina",
  "Australia": "Australia",
  "Austria": "Austria",
  "Albania": "Albania",
  "Belgium": "Belgium/Netherlands",
  "Netherlands": "Belgium/Netherlands",
  "Bolivia": "Bolivia",
  "Botswana": "Botswana",
  "Brazil": "Brazil",
  "Bulgaria": "Bulgaria",
  "Cambodia": "Cambodia",
  "Cameroon": "Cameroon",
  "Cape Verde": "Cape Verde",
  "Chad": "Chad",
  "Chile": "Chile",
  "Colombia": "Colombia",
  "Costa Rica": "Costa Rica",
  "Croatia": "Croatia",
  "Ivory Coast": "Côte d'Ivoire",
  "Côte d'Ivoire": "Côte d'Ivoire",
  "Czechia": "Czech/Slovak",
  "Czech Republic": "Czech/Slovak",
  "Slovakia": "Czech/Slovak",
  "Denmark": "Denmark",
  "Dominican Republic": "Dominican Republic",
  "Ecuador": "Ecuador",
  "El Salvador": "El Salvador",
  "United Kingdom": "England",
  "Estonia": "Baltic",
  "Latvia": "Baltic",
  "Lithuania": "Baltic",
  "Ethiopia": "Ethiopia",
  "Fiji": "Fiji",
  "Finland": "Finland",
  "France": "France",
  "Gabon": "Gabon",
  "Germany": "Germany",
  "Ghana": "Ghana",
  "Greece": "Greece",
  "Guatemala": "Guatemala",
  "Belize": "Belize/Guatemala",
  "Haiti": "Haiti",
  "Honduras": "Honduras",
  "Hungary": "Hungary",
  "Iceland": "Iceland",
  "India": "India",
  "Indonesia": "Indonesia",
  "Ireland": "Ireland/Northern Ireland",
  "Italy": "Italy",
  "Jamaica": "Jamaica",
  "Japan": "Japan",
  "Kenya": "Kenya",
  "South Korea": "Korea",
  "Liberia": "Liberia",
  "Madagascar": "Madagascar",
  "Malawi": "Malawi",
  "Malaysia": "Malaysia",
  "Mauritius": "Mauritius",
  "Mexico": "Mexico",
  "Mongolia": "Mongolia",
  "Mozambique": "Mozambique",
  "Namibia": "Namibia",
  "New Zealand": "New Zealand",
  "Nicaragua": "Nicaragua",
  "Nigeria": "Nigeria",
  "Norway": "Norway",
  "Pakistan": "Pakistan",
  "Panama": "Panama",
  "Papua New Guinea": "Papua New Guinea",
  "Paraguay": "Paraguay",
  "Peru": "Peru",
  "Philippines": "Philippines",
  "Poland": "Poland",
  "Portugal": "Portugal",
  "Puerto Rico": "Puerto Rico",
  "Romania": "Romania",
  "Russia": "Russia",
  "Rwanda": "Rwanda",
  "Samoa": "Samoa",
  "Senegal": "Senegal",
  "Serbia": "Serbia",
  "Sierra Leone": "Sierra Leone",
  "Singapore": "Singapore",
  "Slovenia": "Slovenia",
  "South Africa": "South Africa",
  "Spain": "Spain",
  "Sri Lanka": "Sri Lanka",
  "Sweden": "Sweden",
  "Switzerland": "Switzerland",
  "Taiwan": "Taiwan",
  "Tanzania": "Tanzania",
  "United Republic of Tanzania": "Tanzania",
  "Thailand": "Thailand",
  "Togo": "Togo",
  "Tonga": "Tonga",
  "Trinidad and Tobago": "Trinidad and Tobago",
  "Uganda": "Uganda",
  "Ukraine": "Ukraine",
  "Uruguay": "Uruguay",
  "Vanuatu": "Vanuatu",
  "Venezuela": "Venezuela",
  "Zambia": "Zambia",
  "Zimbabwe": "Zimbabwe",
  "Armenia": "Armenia/Georgia",
  "Georgia": "Armenia/Georgia",
  "Benin": "Benin",
  "Congo": "Congo",
  "Democratic Republic of the Congo": "Congo",
  "Republic of the Congo": "Congo",
  "Dem. Rep. Congo": "Congo",
  "Republic of Congo": "Congo",
  "Kiribati": "Kiribati",
};
