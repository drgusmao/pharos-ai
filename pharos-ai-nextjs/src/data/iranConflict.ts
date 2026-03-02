import type { ThreatLevel, ConflictStatus } from '@/types/domain';
export type { ThreatLevel, ConflictStatus };

export const CONFLICT = {
  id:            'iran-2026',
  name:          'US–Israel Strikes on Iran',
  codename:      { us: 'Operation Epic Fury', il: 'Operation Roaring Lion' },
  status:        'ONGOING' as const,
  threatLevel:   'CRITICAL' as const,
  startDate:     '2026-02-28T04:30:00Z',  // first strikes, Tehran
  region:        'Iran / Persian Gulf / Middle East',
  escalation:    94,

  summary: `On February 28, 2026, the United States and Israel launched a coordinated joint strike on Iran — the most ambitious Western military operation against the Islamic Republic since its founding. Codenamed Operation Epic Fury by the Pentagon and Operation Roaring Lion by the IDF, the campaign targeted Iranian nuclear facilities, ballistic missile infrastructure, air defense networks, and regime leadership. Supreme Leader Ali Khamenei was killed when his compound in Tehran was struck. 48 Iranian leaders have been killed. Iran responded with Operation True Promise 4 — launching 700+ drones and hundreds of missiles at targets in 9+ countries. 4 US service members have been killed and 18 wounded. 10 Israeli civilians killed. On Day 3, Hezbollah entered the war from Lebanon, an Iranian drone struck RAF Akrotiri in Cyprus (first attack on NATO territory), QatarEnergy halted all LNG production after strikes on Ras Laffan and Mesaieed, and Saudi Aramco shut Ras Tanura refinery. Iran's death toll stands at 555 across 131 cities. The Pentagon confirmed 1,000+ targets hit in the first 24 hours and "tens of thousands of pieces of ordnance" delivered. Trump says "the big wave hasn't even happened yet" and doesn't rule out boots on ground. MBS vowed military force against further Iranian incursions. Operations are ongoing.`,

  keyFacts: [
    'Khamenei confirmed killed — IRNA state media confirmation 14:30 UTC Feb 28',
    'B-2 Spirit bombers struck fortified nuclear and missile sites from Diego Garcia',
    'Strait of Hormuz closure — 200+ vessels anchored, half-dozen shipping companies halted',
    'IRGC launched Operation True Promise 4 — 700+ drones, hundreds of missiles in 2 days',
    'Iran struck targets in 9+ countries: Bahrain, Iraq, Jordan, Kuwait, Oman, Qatar, Saudi Arabia, UAE, Israel, Cyprus',
    '4 US service members KIA (confirmed by Hegseth/CENTCOM), 18 total wounded',
    '10 killed in Israel — 9 in Beit Shemesh synagogue strike, 1 elsewhere; 40+ injured',
    '9 Iranian warships destroyed and sunk — naval HQ "largely destroyed" (Trump/CENTCOM)',
    '48 Iranian leaders killed (per Trump); IDF struck "dozens" of IRGC command centers in Tehran',
    '1,000+ targets hit in first 24h; "tens of thousands of pieces of ordnance" delivered',
    'Iran hit civilian targets across Gulf — Dubai Fairmont, Bahrain Crowne Plaza, airports, AWS data center',
    '1,500+ flights cancelled; Dubai, Kuwait, Bahrain, Erbil airports suspended',
    'Oil: Brent surging, WTI surging; OPEC+ increase: 206K bbl/day (a "rounding error")',
    'Iran forms interim leadership council: Pezeshkian, Mohseni-Ejei, Arafi',
    'Starmer/Macron/Merz joint statement: "Iran pursuing scorched earth strategy"',
    'Houthis resumed Red Sea attacks; first rockets from Lebanon (late March 1)',
    'Day 3: Hezbollah enters war — IDF launches offensive, 31 killed in Lebanon',
    'Day 3: Iranian drone strikes RAF Akrotiri (UK Cyprus) — first strike on NATO territory',
    'Day 3: Saudi Ras Tanura refinery (550K bbl/day) shut after drone strike',
    'Day 3: 3 US F-15s shot down by Kuwaiti air defenses in friendly fire — all 6 crew survived',
    'Day 3: QatarEnergy halts ALL LNG production after Iran attacks Ras Laffan + Mesaieed',
    'Day 3: Larijani rejects negotiations — "We will not negotiate with the US"',
    'Day 3: Iran death toll rises to 555 across 131 cities (Red Crescent)',
    'Day 3: IAEA Grossi warns mass evacuations may be necessary if reactors hit',
    'Day 3: Hegseth Pentagon briefing: "not endless war", 3-part mission, "just beginning"',
    'Day 3: Trump: "the big wave hasn\'t even happened yet", doesn\'t rule out boots on ground',
    'Day 3: MBS vows military force against further Iranian incursions',
    'Day 3: US/Israel strike PMF/Kataib Hezbollah base in Iraq — 2 killed, 5 wounded',
    'Day 3: IDF launches "broad wave" strikes on "heart of Tehran" + simultaneous Lebanon ops',
    'Day 3: IRGC claims 60 strategic targets, 500 facilities, 700+ drones in 2 days',
  ],

  objectives: {
    us:  'Destroy Iranian nuclear & missile capability, prevent nuclear breakout, topple regime',
    il:  'Remove existential threats — nuclear/missile programs, eliminate Axis of Resistance leadership',
  },

  commanders: {
    us: ['President Donald Trump', 'SecDef Pete Hegseth', 'CENTCOM CG Dan Caine', 'Adm. Brad Cooper'],
    il: ['PM Benjamin Netanyahu', 'DefMin Israel Katz', 'IDF Chief Eyal Zamir', 'IAF Chief Tomer Bar'],
    ir: ['President Masoud Pezeshkian (interim council)', 'Chief Justice Mohseni-Ejei (interim council)', 'Ayatollah Arafi (interim council)', 'FM Abbas Araghchi'],
  },

  casualties: {
    us:       { kia: 4,   wounded: 18,   civilians: 0 },  // Hegseth confirmed 4th KIA + 18 total wounded (Pentagon briefing Mar 2)
    israel:   { kia: 0,   wounded: 0,    civilians: 10, injured: 40 },  // 9 in Beit Shemesh, 1 elsewhere; some sources say 12 killed, 11 missing
    iran:     { killed: 555, injured: 747 },  // IRCS figures as of Day 3; ~180 students at Minab school; 131 cities affected; 100K rescuers on alert
    lebanon:  { killed: 31, injured: 149 },  // IDF retaliatory strikes after Hezbollah entered war
    regional: {
      uae:     { killed: 3, injured: 58 },      // Pakistani, Nepalese, Bangladeshi nationals; 165 missiles + 209 drones fired at UAE Day 1
      kuwait:  { killed: 1, injured: 32 },       // 1 Kuwaiti civilian + 3 F-15s shot down (friendly fire, crew survived)
      qatar:   { killed: 0, injured: 16 },       // Residential + energy infrastructure targeted
      bahrain: { killed: 1, injured: 6 },        // Crowne Plaza + intercepted missile debris
      oman:    { killed: 1, injured: 5 },        // Duqm port + tanker crew evacuated
      iraq:    { killed: 2, injured: 5 },        // PMF/Kataib Hezbollah at Jurf al-Sakher
      jordan:  { killed: 0, injured: 0 },        // 49 drones/missiles intercepted
      saudi:   { killed: 0, injured: 0 },        // Ras Tanura shut, Prince Sultan AB intercepted
    },
  },
};

