import React, { useState, useMemo, useEffect } from 'react';
import { List, CheckCircle2, Circle, Eye, EyeOff, Crosshair, Map, Video } from 'lucide-react';

const SETUP_STEPS = [
  "Activate Pack-a-Punch: Open the map and turn on Pack-a-Punch.",
  "Get Syringe Part: Go to Tower 1 Mutant Research Lab. Interact with the box to get the syringe.",
  "Collect Clouse Arms: Kill robots during special rounds (rounds 5 and 6) to collect two Clouse arms."
];

const MAIN_QUEST_DATA = [
  {
    section: "Particle Accelerator & Blood Sample",
    steps: [
      "Open Sublevel 10: Go to the Director's Office and interact with the snow globe.",
      "Restart Accelerator: Go to Sublevel 10. Turn on the power button. Shoot the 12 Ethereum deposits on the pipes.",
      "Get Blood Sample: Take the platform into the orange beam. Transform into an orb, steer into the floating body to knock it down. Use the syringe on the dropped body."
    ]
  },
  {
    section: "Mutant Injection & Teleporter Room",
    steps: [
      "Get Mutant Injection: Return to Mutant Research Lab. Put the syringe in the box. Kill the spawned Fowler Mangler and pick up the injection.",
      "Get Key Card & DNA Vial: Kill the special zombie in the lab for a Key Card. Interact with the box to get the DNA Vial.",
      "Open Teleporter Room: Go upstairs to Dark Entity Containment. Use the Mutant Injection on the eye scanner."
    ]
  },
  {
    section: "The Code & Brain Run",
    steps: [
      "Find Notes: Find 4 notes (1 in Teleportation Lab desk, 3 around Executive Office area).",
      "Decode: Note the number and month on each. Order them from earliest to latest month to get a 4-digit code.",
      "Enter Code: Input the 4-digit code into the computer in the new Teleporter Room.",
      "Brain Run: Go to Tower 1 Computing Core. Buy the Melee Macchiato perk, melee the machine, pick up the blue brain. Sprint back and place it in the Teleporter Room box before time runs out."
    ]
  },
  {
    section: "Base Wonder Weapon",
    steps: [
      "Get Periodic Code: Read the two static TVs in Mutant Research Lab. Match their first letters to a Periodic Table element to get its atomic number.",
      "Enter Atomic Number: Enter the atomic number as a 3-digit code (add a zero if needed) into the upstairs keypad to open Bioweapons Lab.",
      "Charge Cyst: Damage vermin and zombies near the glass cyst so their souls float in. Pick up the cyst.",
      "Flower Charge: Go to Tower 1 Quantum Computing Core. Stand under 3 yellow shooting flowers with the cyst until their health bars deplete.",
      "Start Boss Sequence: Go to Tower 2 Dark Entity Containment. Interact with the 'power surge' computer. Quickly run anti-clockwise and interact with 3 other computers.",
      "Get Weapon: Shoot the shoulders off the spawned Uber Claus. Lure it to the electricity floor to kill the boss. Pick up the Gorg Effects Wonder Weapon."
    ]
  },
  {
    section: "Wonder Weapon Upgrade (Blue Orb)",
    steps: [
      "Get Orb: At round start, go to Tower 2 Sublevel 10, activate 'Boost Ready' screens. Shoot 4 high-up vermin with the Wonder Weapon. Kill zombies to fill the soul box.",
      "Place Portal: Pick up the blue orb outside. DO NOT shoot your weapon. Carry it to Tower 2 Teleportation Lab and shoot a charged shot at the portal."
    ]
  },
  {
    section: "Choose Your Path (C or N)",
    steps: [
      "Complete Upgrade Path: Choose Path C (Easy: Talk to Blanchard, press red button in Janice Reception, parachute down elevator shaft hitting 3 red buttons, kill blue zombies). OR Path N (Hard: Collect Strauss Counter, find radiation vial, collect 3 parts, build extractor, survive lockdown)."
    ]
  },
  {
    section: "Clouse & Fungal Head",
    steps: [
      "Assemble Clouse: Find 2 Clouse legs in the corners of Tower 2 Android Assembly. Attach them to the Clouse droid.",
      "Activate Clouse: Bait an Uber Claus into shooting an energy mine at the droid. Progress the round.",
      "Follow Clouse: Follow Clouse to Dark Entity Containment and complete his SAM trial. Follow him to the Teleportation Lab.",
      "Get Fungal Head: Shoot a charged Wonder Weapon shot at the window object in Tower 1 Quantum Computing Core to drop the head.",
      "Wash Fungal Head: Find a yellow bucket. Melee it under running sprinklers. Put the head in the water, then pick it up.",
      "Charge Fungal Head: Fill the head with zombie souls (avoid the damaging shadow figure). Carry it to the teleporter in Tower 2 Teleportation Lab."
    ]
  },
  {
    section: "Vacuum Devices & Boss Prep",
    steps: [
      "Collect Devices: Open unlocked Project Janice security boxes to get a vacuum device.",
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

export default function App() {
  const [completedSetup, setCompletedSetup] = useState(new Set());
  const [completedMain, setCompletedMain] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  // Flatten the main quest data for easier sequential tracking
  const flatMainSteps = useMemo(() => {
    let globalIndex = 0;
    return MAIN_QUEST_DATA.map((section, sIdx) => ({
      ...section,
      sectionId: sIdx,
      steps: section.steps.map(text => ({
        id: globalIndex++,
        text
      }))
    }));
  }, []);

  const totalMainSteps = flatMainSteps.reduce((acc, curr) => acc + curr.steps.length, 0);

  // Find the first uncompleted step index to control progressive revelation
  let firstUncompletedId = 0;
  while (completedMain.has(firstUncompletedId) && firstUncompletedId < totalMainSteps) {
    firstUncompletedId++;
  }

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

  const formatText = (text, isCompleted) => {
    const parts = text.split(':');
    if (parts.length > 1) {
      return (
        <span className="leading-relaxed">
          <strong className={`font-semibold ${isCompleted ? 'text-zinc-500' : 'text-emerald-400'}`}>
            {parts[0]}:
          </strong>
          <span className={isCompleted ? 'text-zinc-500' : 'text-zinc-300'}>
            {parts.slice(1).join(':')}
          </span>
        </span>
      );
    }
    return <span className={isCompleted ? 'text-zinc-500' : 'text-zinc-300'}>{text}</span>;
  };

  const setupProgressPercentage = Math.round((completedSetup.size / SETUP_STEPS.length) * 100);
  const mainProgressPercentage = Math.round((completedMain.size / totalMainSteps) * 100);

  // Auto-scroll to the current active step whenever progress is made
  useEffect(() => {
    if (!showAll) {
      const activeEl = document.getElementById(`step-${firstUncompletedId}`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [firstUncompletedId, showAll]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8 selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto space-y-8">
        
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
              <Map size={18} className="text-blue-400" />
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
                  <p className={`text-base ${isCompleted ? 'line-through decoration-zinc-600' : ''}`}>
                    {formatText(step, isCompleted)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Main Quest Steps */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white tracking-tight">Main Quest</h2>
            <span className="text-sm font-medium text-zinc-400">
              {completedMain.size} / {totalMainSteps} Steps
            </span>
          </div>

          <div className="space-y-8 pr-2 max-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-zinc-950/50 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth">
            {flatMainSteps.map((section) => {
              // Show completed steps, current step, and next 3 upcoming steps
              const visibleSteps = section.steps.filter(step => showAll || step.id <= firstUncompletedId + 3);
              
              if (visibleSteps.length === 0) return null;

              return (
                <section key={section.sectionId} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-zinc-800 flex-1"></div>
                    <h3 className="text-lg font-semibold text-emerald-400">{section.section}</h3>
                    <div className="h-px bg-zinc-800 flex-1"></div>
                  </div>

                  <div className="grid gap-3 relative before:absolute before:inset-y-0 before:left-[1.3rem] before:w-px before:bg-zinc-800">
                    {visibleSteps.map((step) => {
                      const isCompleted = completedMain.has(step.id);
                      const isActive = !showAll && step.id === firstUncompletedId;
                      const isUpcoming1 = !showAll && step.id === firstUncompletedId + 1;
                      const isUpcoming2 = !showAll && step.id === firstUncompletedId + 2;
                      const isUpcoming3 = !showAll && step.id === firstUncompletedId + 3;
                      
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
                          <button className="flex-shrink-0 mt-0.5 focus:outline-none bg-zinc-950 rounded-full">
                            {isCompleted ? (
                              <CheckCircle2 className="text-emerald-600 transition-transform hover:scale-110" size={24} />
                            ) : (
                              <Circle className={`transition-colors ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`} size={24} />
                            )}
                          </button>
                          <p className={`text-base ${isCompleted ? 'line-through decoration-zinc-700' : ''}`}>
                            {formatText(step.text, isCompleted)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
        
        {completedMain.size === totalMainSteps && (
          <div className="mt-12 p-8 text-center bg-emerald-900/20 border border-emerald-500/30 rounded-xl animate-in zoom-in duration-500">
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">Easter Egg Complete!</h3>
            <p className="text-emerald-200/70">Congratulations on defeating SAM and completing the Reckoning Easter Egg.</p>
          </div>
        )}

      </div>
    </div>
  );
}