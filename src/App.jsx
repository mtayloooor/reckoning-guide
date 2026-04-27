import React, { useState, useMemo, useEffect } from 'react';
import { List, CheckCircle2, Circle, Eye, EyeOff, Crosshair, Map as MapIcon, Video, Trash2, Route } from 'lucide-react';

const SETUP_STEPS = [
  "Activate Pack-a-Punch",
  "Get Syringe Part from [T1 Mutant Research Lab]",
  "Collect Clouse Arms",
  "Check Notes in [T1 Executive Office] area",
  "Get Key Card from Zombie in [T1 Mutant Research Lab]"
];

const MAIN_QUEST_DATA = [
  {
    section: "Particle Accelerator & Blood Sample",
    steps: [
      "Open [T1 Sublevel 10]: Go to the [T1 Director's Office] and interact with the snow globe.",
      "Restart Accelerator: Go to [T1 Sublevel 10]. Turn on the power button. Shoot the 12 Ethereum deposits on the pipes.",
      "Get Blood Sample: Take the platform into the orange beam. Transform into an orb, steer into the floating body to knock it down. Use the syringe on the dropped body."
    ]
  },
  {
    section: "Mutant Injection & Teleporter Room",
    steps: [
      "Get Mutant Injection: Return to [T1 Mutant Research Lab]. Put the syringe in the box. Kill the spawned Fowler Mangler and pick up the injection.",
      "Get Key Card & DNA Vial: Kill the special zombie in the lab for a Key Card. Interact with the box to get the DNA Vial.",
      "Open Teleporter Room: Go upstairs to [T2 Dark Entity Containment]. Activate the eye scanner, then use the Mutant Injection."
    ]
  },
  {
    section: "The Code & Brain Run",
    steps: [
      "Find Notes: Find 4 notes (1 in [T2 Teleportation Lab] desk, 3 around [T1 Executive Office] area).",
      "Decode: Note the number and month on each. Order them from earliest to latest month to get a 4-digit code.",
      "Enter Code: Input the 4-digit code into the computer in the new [T2 Teleportation Lab].",
      "Brain Run: Go to [T1 Quantum Computing Core]. Buy the Melee Macchiato perk, melee the machine, pick up the blue brain. Sprint back and place it in the [T2 Teleportation Lab] box before time runs out."
    ]
  },
  {
    section: "Base Wonder Weapon",
    steps: [
      "Get Periodic Code: Read the two static TVs in [T1 Mutant Research Lab]. Match their first letters to a Periodic Table element to get its atomic number.",
      "Enter Atomic Number: Enter the atomic number as a 3-digit code (add a zero if needed) into the upstairs keypad to open [T1 Bioweapons Lab].",
      "Charge Cyst: Damage vermin and zombies near the glass cyst so their souls float in. Pick up the cyst.",
      "Flower Charge: Go to [T1 Quantum Computing Core]. Stand under 3 yellow shooting flowers with the cyst until their health bars deplete.",
      "Start Boss Sequence: Go to [T2 Dark Entity Containment]. Interact with the 'power surge' computer. Quickly run anti-clockwise and interact with 3 other computers.",
      "Get Weapon: Shoot the shoulders off the spawned Uber Claus. Lure it to the electricity floor. Kill the spawned boss, then pick up the Gorg Effects Wonder Weapon."
    ]
  },
  {
    section: "Wonder Weapon Upgrade (Blue Orb)",
    steps: [
      "Get Orb: At round start, go to [T2 Sublevel 10], activate 'Boost Ready' screens. Shoot 4 high-up vermin with the Wonder Weapon. Kill zombies to fill the soul box.",
      "Place Portal: Pick up the blue orb outside. DO NOT shoot your weapon. Carry it to [T2 Teleportation Lab] and shoot a charged shot at the portal."
    ]
  },
  {
    section: "Choose Your Path (C or N)",
    isSplit: true,
    pathC: [
      "Path C - Talk to Blanchard: Go to [T1 Executive Suite].",
      "Path C - Red Button: Press the red button in [T1 Janice Reception].",
      "Path C - Elevator Shaft: Parachute down the broken elevator shaft and hit 3 red buttons.",
      "Path C - Panos: Kill blue zombies in [T1 Quantum Computing Core] with the Wonder Weapon."
    ],
    pathN: [
      "Path N - Strauss Counter: Grab the Strauss Counter from [T1 Quantum Computing Core].",
      "Path N - Radiation Vial: Use the Strauss Counter to find the radiation peak around 9.6, then use a charge shot of the Gorgoplex to uncover the item.",
      "Path N - Clean Hood: Collect the Clean Hood from [T1 Mutant Research Lab].",
      "Path N - PC Fan: Collect the PC Fan from [T2 Dark Entity Containment].",
      "Path N - Tubing: Collect the Tubing from [T1 Quantum Computing Core].",
      "Path N - Essence Extractor: Build the extractor at Blanchard's door in [T1 Executive Suite], insert vial, and survive lockdown."
    ]
  },
  {
    section: "Clouse & Fungal Head",
    steps: [
      "Assemble Clouse: Find 2 Clouse legs in the corners of [T2 Android Assembly]. Attach them to the Clouse droid.",
      "Activate Clouse: Bait an Uber Claus into shooting an energy mine at the droid. Progress the round.",
      "Follow Clouse: Follow Clouse to [T2 Dark Entity Containment] and complete his SAM trial. Follow him to the [T2 Teleportation Lab].",
      "Get Fungal Head: Shoot a charged Wonder Weapon shot at the window object in [T1 Quantum Computing Core] to drop the head.",
      "Wash Fungal Head: Find a yellow bucket. Melee it under running sprinklers. Put the head in the water, then pick it up.",
      "Charge Fungal Head: Fill the head with zombie souls (avoid the damaging shadow figure). Carry it to the teleporter in [T2 Teleportation Lab] and interact with the boss teleporter."
    ]
  },
  {
    section: "Vacuum Devices & Boss Prep",
    steps: [
      "Collect Devices: Open unlocked Project Janice security boxes to get a vacuum device. The first one can be found in [T1 Mutant Research Lab].",
      "Charge Devices: Throw the device at 4 purple objects around the map, picking it up each time to charge it fully.",
      "Enter Portal: Triple Pack-a-Punch your weapons. Insert all 4 vacuum devices into the machine. Press ready, survive the lockdown, flip 3 red switches to green, and enter the boss portal."
    ]
  },
  {
    section: "Boss Fight (SAM - Recommended)",
    steps: [
      "Vault 1: Interact with the Sentinel Artifact. Vote for SAM. Fill 3 soul boxes in this area. Go up.",
      "Vault 2: Shoot all the dark aether crystals on the ceiling. Go up to the arena.",
      "Phase 1: Run laps around the arena. Hide from her laser beam, then quickly shoot her red critical spots/eye. Shoot her when she spins to drop energy mines.",
      "Phases 2 & 3: Complete the SAM trials for free perks. Continue avoiding attacks and shooting critical spots after her laser fires. Keep shooting until she dies."
    ]
  }
];

const DecodeInputs = () => {
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem('reckoning-decode');
    return saved ? JSON.parse(saved) : Array(8).fill('');
  });

  useEffect(() => {
    localStorage.setItem('reckoning-decode', JSON.stringify(values));
  }, [values]);

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    const isFirstInPair = index % 2 === 0;
    if (isFirstInPair && val.length === 1) {
      const nextInput = document.getElementById(`decode-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    } else if (!isFirstInPair && val.length === 2) {
      const nextInput = document.getElementById(`decode-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="mt-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 shadow-inner flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
      <div className="text-sm font-medium text-emerald-400/80 mb-1 flex items-center gap-2">
        <List size={16} /> Scratchpad (Number - Month)
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(row => (
          <div key={row} className="flex items-center gap-3 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 text-sm font-medium w-14">Note {row + 1}:</span>
            <input
              id={`decode-input-${row * 2}`}
              type="text"
              maxLength={1}
              value={values[row * 2]}
              onChange={(e) => handleChange(row * 2, e.target.value)}
              className="w-10 h-10 bg-zinc-950 border border-zinc-700 rounded-md text-center text-emerald-400 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              placeholder="#"
            />
            <span className="text-zinc-600">-</span>
            <input
              id={`decode-input-${row * 2 + 1}`}
              type="text"
              maxLength={2}
              value={values[row * 2 + 1]}
              onChange={(e) => handleChange(row * 2 + 1, e.target.value)}
              className="w-14 h-10 bg-zinc-950 border border-zinc-700 rounded-md text-center text-emerald-400 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
              placeholder="##"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PeriodicCodeInputs = () => {
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem('reckoning-periodic');
    return saved ? JSON.parse(saved) : ['', ''];
  });

  useEffect(() => {
    localStorage.setItem('reckoning-periodic', JSON.stringify(values));
  }, [values]);

  const handleChange = (index, val) => {
    if (!/^[a-zA-Z]*$/.test(val)) return;
    const newValues = [...values];
    newValues[index] = val.toUpperCase();
    setValues(newValues);

    if (val.length === 1 && index === 0) {
      const nextInput = document.getElementById('periodic-input-1');
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="mt-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 shadow-inner flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
      <div className="text-sm font-medium text-emerald-400/80 mb-1 flex items-center gap-2">
        <List size={16} /> TV Letters Scratchpad
      </div>
      <div className="flex items-center gap-4">
        <input id="periodic-input-0" type="text" maxLength={1} value={values[0]} onChange={(e) => handleChange(0, e.target.value)} className="w-12 h-12 bg-zinc-950 border border-zinc-700 rounded-md text-center text-xl text-emerald-400 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="A" />
        <span className="text-zinc-600 font-bold">+</span>
        <input id="periodic-input-1" type="text" maxLength={1} value={values[1]} onChange={(e) => handleChange(1, e.target.value)} className="w-12 h-12 bg-zinc-950 border border-zinc-700 rounded-md text-center text-xl text-emerald-400 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="B" />
      </div>
    </div>
  );
};

const AtomicNumberInputs = () => {
  const [values, setValues] = useState(() => {
    const saved = localStorage.getItem('reckoning-atomic');
    return saved ? JSON.parse(saved) : ['', '', ''];
  });

  useEffect(() => {
    localStorage.setItem('reckoning-atomic', JSON.stringify(values));
  }, [values]);

  const handleChange = (index, val) => {
    if (!/^\d*$/.test(val)) return;
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);

    if (val.length === 1 && index < 2) {
      const nextInput = document.getElementById(`atomic-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="mt-4 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80 shadow-inner flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
      <div className="text-sm font-medium text-emerald-400/80 mb-1 flex items-center gap-2">
        <List size={16} /> Atomic Number Scratchpad
      </div>
      <div className="flex items-center gap-4">
        {[0, 1, 2].map(i => (
          <input key={i} id={`atomic-input-${i}`} type="text" maxLength={1} value={values[i]} onChange={(e) => handleChange(i, e.target.value)} className="w-12 h-12 bg-zinc-950 border border-zinc-700 rounded-md text-center text-xl text-emerald-400 font-bold focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all" placeholder="#" />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [completedSetup, setCompletedSetup] = useState(() => {
    const saved = localStorage.getItem('reckoning-setup-progress');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [completedMain, setCompletedMain] = useState(() => {
    const saved = localStorage.getItem('reckoning-main-progress');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [showAll, setShowAll] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Flatten the main quest data & assign global IDs
  const flatMainSteps = useMemo(() => {
    let globalIndex = 0;
    return MAIN_QUEST_DATA.map((section, sIdx) => {
      if (section.isSplit) {
        const cSteps = section.pathC.map(text => ({ id: globalIndex++, text, path: 'C' }));
        const nSteps = section.pathN.map(text => ({ id: globalIndex++, text, path: 'N' }));
        return { ...section, sectionId: sIdx, steps: [...cSteps, ...nSteps], pathCSteps: cSteps, pathNSteps: nSteps };
      }
      return { ...section, sectionId: sIdx, steps: section.steps.map(text => ({ id: globalIndex++, text })) };
    });
  }, []);

  // Calculate distances to determine upcoming tasks AND completion logic
  const { stepDistances, firstActiveStepId, mainProgressPercentage } = useMemo(() => {
    const distances = new Map();
    let distanceCounter = 0;
    let startedCounting = false;
    let firstActive = null;

    let totalSteps = 0;
    let completedSteps = 0;

    flatMainSteps.forEach(sec => {
      if (sec.isSplit) {
        const cDoneCount = sec.pathCSteps.filter(s => completedMain.has(s.id)).length;
        const nDoneCount = sec.pathNSteps.filter(s => completedMain.has(s.id)).length;
        const cComplete = cDoneCount === sec.pathCSteps.length;
        const nComplete = nDoneCount === sec.pathNSteps.length;

        // Progress bar calculation for split (uses longest path)
        const sectionTotal = Math.max(sec.pathCSteps.length, sec.pathNSteps.length);
        totalSteps += sectionTotal;

        if (cComplete || nComplete) {
          completedSteps += sectionTotal;
          sec.steps.forEach(s => distances.set(s.id, -1)); // Mark all as completed/bypassed
        } else {
          completedSteps += Math.max(cDoneCount, nDoneCount);
          startedCounting = true;
          // All split steps share the current distance (they are parallel options)
          sec.steps.forEach(s => distances.set(s.id, distanceCounter));
          if (firstActive === null) {
            // Find the exact step in the dominant path to scroll to
            const activePath = nDoneCount > cDoneCount ? sec.pathNSteps : sec.pathCSteps;
            const target = activePath.find(s => !completedMain.has(s.id));
            firstActive = target ? target.id : sec.steps[0].id;
          }
          distanceCounter++;
        }
      } else {
        totalSteps += sec.steps.length;
        sec.steps.forEach(s => {
          if (completedMain.has(s.id)) {
            completedSteps++;
            distances.set(s.id, -1);
          } else {
            startedCounting = true;
            distances.set(s.id, distanceCounter);
            if (firstActive === null && distanceCounter === 0) firstActive = s.id;
            distanceCounter++;
          }
        });
      }
    });

    return { 
      stepDistances: distances, 
      firstActiveStepId: firstActive,
      mainProgressPercentage: Math.round((completedSteps / totalSteps) * 100) || 0
    };
  }, [flatMainSteps, completedMain]);

  const setupProgressPercentage = Math.round((completedSetup.size / SETUP_STEPS.length) * 100);

  useEffect(() => {
    localStorage.setItem('reckoning-setup-progress', JSON.stringify([...completedSetup]));
  }, [completedSetup]);

  useEffect(() => {
    localStorage.setItem('reckoning-main-progress', JSON.stringify([...completedMain]));
  }, [completedMain]);

  const handleClearProgress = () => {
    setCompletedSetup(new Set());
    setCompletedMain(new Set());
    localStorage.removeItem('reckoning-setup-progress');
    localStorage.removeItem('reckoning-main-progress');
    localStorage.removeItem('reckoning-decode');
    localStorage.removeItem('reckoning-periodic');
    localStorage.removeItem('reckoning-atomic');
    setShowConfirmClear(false);
  };

  // Auto-scroll to the current active step whenever progress is made
  useEffect(() => {
    if (!showAll && firstActiveStepId !== null) {
      const activeEl = document.getElementById(`step-${firstActiveStepId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [firstActiveStepId, showAll]);

  const toggleSetup = (idx) => {
    const newSet = new Set(completedSetup);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setCompletedSetup(newSet);
  };

  const toggleMain = (id) => {
    const newSet = new Set(completedMain);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setCompletedMain(newSet);
  };

  // Helper to format text, including bolding and special [Bracket] styling for locations
  const formatText = (text, isCompleted) => {
    const renderPart = (str, isBoldPrefix) => {
      // Regex finds anything wrapped in [ ]
      const regex = /\[(.*?)\]/g;
      const tokens = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(str)) !== null) {
        if (match.index > lastIndex) {
          tokens.push(str.substring(lastIndex, match.index));
        }
        tokens.push(
          <span key={match.index} className={`font-bold ${isCompleted ? 'text-zinc-500' : 'text-blue-400'} bg-blue-900/10 px-1 rounded`}>
            {match[1]}
          </span>
        );
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < str.length) {
        tokens.push(str.substring(lastIndex));
      }
      
      return isBoldPrefix ? (
        <strong className={`font-semibold ${isCompleted ? 'text-zinc-500' : 'text-emerald-400'}`}>
          {tokens}
        </strong>
      ) : (
        <span className={isCompleted ? 'text-zinc-500' : 'text-zinc-300'}>
          {tokens}
        </span>
      );
    };

    const parts = text.split(':');
    if (parts.length > 1) {
      return (
        <span className="leading-relaxed">
          {renderPart(parts[0] + ':', true)}
          {renderPart(parts.slice(1).join(':'), false)}
        </span>
      );
    }
    return renderPart(text, false);
  };

  const renderStep = (step) => {
    const dist = stepDistances.get(step.id);
    
    // Hide logic for non-showAll mode
    if (!showAll && dist > 3 && dist !== -1) return null;

    const isCompleted = dist === -1;
    const isActive = !showAll && dist === 0;
    const isUpcoming1 = !showAll && dist === 1;
    const isUpcoming2 = !showAll && dist === 2;
    const isUpcoming3 = !showAll && dist === 3;

    let stepClasses = "relative z-10 flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-500 border origin-top-left ";
    
    if (isCompleted) {
      stepClasses += "bg-zinc-950/40 border-zinc-800/30 opacity-60 hover:opacity-80 ";
    } else if (isActive) {
      stepClasses += "bg-zinc-800/80 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)] transform scale-[1.01] ";
    } else if (isUpcoming1) {
      stepClasses += "bg-zinc-900/40 border-zinc-800/50 opacity-70 transform scale-[0.95] pointer-events-none ";
    } else if (isUpcoming2) {
      stepClasses += "bg-zinc-900/20 border-zinc-800/30 opacity-40 transform scale-[0.90] pointer-events-none ";
    } else if (isUpcoming3) {
      stepClasses += "bg-zinc-900/10 border-zinc-800/20 opacity-20 transform scale-[0.85] pointer-events-none ";
    } else {
      stepClasses += "bg-zinc-900/60 border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/80 ";
    }

    return (
      <div 
        key={step.id}
        id={`step-${step.id}`}
        onClick={() => toggleMain(step.id)}
        className={stepClasses}
      >
        <div className="flex items-start gap-4 w-full min-w-0">
          <button className="flex-shrink-0 mt-0.5 focus:outline-none bg-zinc-950 rounded-full">
            {isCompleted ? (
              <CheckCircle2 className="text-emerald-600 transition-transform hover:scale-110" size={24} />
            ) : (
              <Circle className={`transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`} size={24} />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-base ${isCompleted ? 'line-through decoration-zinc-700' : ''}`}>
              {formatText(step.text, isCompleted)}
            </p>
            {step.text.startsWith("Decode:") && <DecodeInputs />}
            {step.text.startsWith("Get Periodic Code:") && <PeriodicCodeInputs />}
            {step.text.startsWith("Enter Atomic Number:") && <AtomicNumberInputs />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Crosshair className="text-emerald-500" size={28} />
              Reckoning Easter Egg
            </h1>
            <p className="text-zinc-400 mt-1">Interactive step-by-step guide</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://i.redd.it/8yuhwdm4g2if1.png"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium transition-colors text-zinc-300 hover:text-white"
            >
              <MapIcon size={18} className="text-blue-400" />
              Open Map
            </a>
            <a
              href="https://www.youtube.com/watch?v=tnbfeAFu7OY"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium transition-colors text-zinc-300 hover:text-white"
            >
              <Video size={18} className="text-red-400" />
              Video Walkthrough
            </a>
            {showConfirmClear ? (
              <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                <span className="text-sm text-red-400 font-medium">Are you sure?</span>
                <button onClick={handleClearProgress} className="px-3 py-1.5 bg-red-900/50 hover:bg-red-800 border border-red-700 rounded-lg text-sm font-bold text-white transition-colors">Yes, Clear</button>
                <button onClick={() => setShowConfirmClear(false)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded-lg text-sm font-medium text-zinc-300 transition-colors">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-red-900/30 border border-zinc-700 hover:border-red-500/50 rounded-lg text-sm font-medium transition-colors text-zinc-300 hover:text-red-400"
              >
                <Trash2 size={18} />
                Clear Progress
              </button>
            )}
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium transition-colors text-zinc-300 hover:text-white"
            >
              {showAll ? <EyeOff size={18} className="text-zinc-400" /> : <Eye size={18} className="text-emerald-400" />}
              {showAll ? "Interactive Mode" : "Show All Steps"}
            </button>
          </div>
        </div>

        {/* Overarching Setup Goals */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Setup & Initial Steps</h2>
            <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              {setupProgressPercentage}%
            </span>
          </div>
          
          <div className="grid gap-3">
            {SETUP_STEPS.map((step, idx) => {
              const isCompleted = completedSetup.has(idx);
              return (
                <div 
                  key={idx}
                  onClick={() => toggleSetup(idx)}
                  className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                    isCompleted 
                      ? 'bg-zinc-950/50 border-zinc-800/50 opacity-60' 
                      : 'bg-zinc-800/50 border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800'
                  }`}
                >
                  <button className="flex-shrink-0 mt-0.5 focus:outline-none">
                    {isCompleted ? (
                      <CheckCircle2 className="text-emerald-600" size={24} />
                    ) : (
                      <Circle className="text-zinc-500" size={24} />
                    )}
                  </button>
                  <p className={`text-base font-medium ${isCompleted ? 'line-through decoration-zinc-600 text-zinc-500' : 'text-zinc-200'}`}>
                    {formatText(step, isCompleted)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Quest Overall Progress Bar */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-zinc-100 font-semibold tracking-wide flex items-center gap-2">
              <Route size={18} className="text-emerald-500" />
              Main Quest Progress
            </h3>
            <span className="text-xl font-bold text-emerald-400 font-mono tracking-tighter">
              {mainProgressPercentage}%
            </span>
          </div>
          <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/80 relative">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-700 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${mainProgressPercentage}%` }}
            />
          </div>
        </div>

        {/* Main Quest Steps */}
        <div className="space-y-6">
          <div className="space-y-8 pr-2 max-h-[60vh] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-zinc-950/50 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth">
            {flatMainSteps.map((section) => {
              // Should this section render?
              const hasVisibleSteps = showAll || section.steps.some(s => stepDistances.get(s.id) <= 3 || stepDistances.get(s.id) === -1);
              if (!hasVisibleSteps) return null;

              return (
                <section key={section.sectionId} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-zinc-800 flex-1"></div>
                    <h3 className="text-lg font-semibold text-emerald-400">{section.section}</h3>
                    <div className="h-px bg-zinc-800 flex-1"></div>
                  </div>

                  {section.isSplit ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative mt-4 bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/70">
                      <div className="space-y-3 relative before:hidden md:before:block before:absolute before:inset-y-0 before:left-[1.3rem] before:w-px before:bg-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-emerald-900/40 text-emerald-400 text-sm font-bold px-3 py-1 rounded border border-emerald-800/50">Path C (Easy)</span>
                          <span className="text-xs text-zinc-500">(Completing one finishes section)</span>
                        </div>
                        {section.pathCSteps.map(step => renderStep(step))}
                      </div>
                      <div className="space-y-3 relative before:hidden md:before:block before:absolute before:inset-y-0 before:left-[1.3rem] before:w-px before:bg-zinc-800">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-red-900/20 text-red-400 text-sm font-bold px-3 py-1 rounded border border-red-900/30">Path N (Hard)</span>
                        </div>
                        {section.pathNSteps.map(step => renderStep(step))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 relative before:absolute before:inset-y-0 before:left-[1.3rem] before:w-px before:bg-zinc-800 mt-4">
                      {section.steps.map(step => renderStep(step))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
        
        {mainProgressPercentage === 100 && (
          <div className="mt-12 p-8 text-center bg-emerald-900/20 border border-emerald-500/30 rounded-xl animate-in zoom-in duration-500">
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Easter Egg Complete!</h3>
            <p className="text-emerald-200/70">Congratulations on defeating SAM and completing the Reckoning Easter Egg.</p>
          </div>
        )}

      </div>
    </div>
  );
}
