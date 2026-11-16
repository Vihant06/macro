"use client";

import { useState } from "react";
import { ScrollReveal, StaggerContainer } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Icon } from "../ui/Icon";
import { Dumbbell, Target, Zap, ArrowRight, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { ThinkingOrb } from "../ui/ThinkingOrb";

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];
const EQUIPMENT_OPTIONS = ["Full Gym", "Dumbbells Only", "Barbells Only", "Bodyweight", "Resistance Bands", "Kettlebells"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const FREQUENCY_OPTIONS = ["2 days/week", "3 days/week", "4 days/week", "5 days/week", "6 days/week"];

const SAMPLE_WORKOUT = [
  { name: "Barbell Bench Press", sets: "3×8-10", rpe: "RPE 8", rest: "2-3 min", primary: true, muscle: "Chest" },
  { name: "Incline DB Press", sets: "3×10-12", rpe: "RPE 9", rest: "2 min", primary: false, muscle: "Upper Chest" },
  { name: "Standing Overhead Press", sets: "3×8-10", rpe: "RPE 8", rest: "2-3 min", primary: true, muscle: "Shoulders" },
  { name: "DB Lateral Raises", sets: "3×12-15", rpe: "RPE 9", rest: "90 sec", primary: false, muscle: "Side Delts" },
  { name: "Cable Flyes", sets: "3×12-15", rpe: "RPE 9", rest: "90 sec", primary: false, muscle: "Chest" },
  { name: "Overhead Tricep Ext", sets: "3×10-12", rpe: "RPE 9", rest: "90 sec", primary: false, muscle: "Triceps" },
  { name: "Skull Crushers", sets: "2×12-15", rpe: "RPE 10", rest: "60 sec", primary: false, muscle: "Triceps" },
  { name: "Face Pulls", sets: "3×15-20", rpe: "RPE 8", rest: "60 sec", primary: false, muscle: "Rear Delts" },
];

export function WorkoutPlanner() {
  const [step, setStep] = useState<"configure" | "generating" | "result">("configure");
  const [formData, setFormData] = useState({
    goal: "Hypertrophy",
    experience: "Intermediate",
    frequency: "4 days/week",
    equipment: "Full Gym",
    focus: "Upper Body",
    duration: "60-75 min",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setStep("generating");
    setIsGenerating(true);
    setTimeout(() => {
      setStep("result");
      setIsGenerating(false);
    }, 2500);
  };

  const handleReset = () => {
    setStep("configure");
  };

  return (
    <section id="planner" className="section">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                Workout Generator
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                AI Workout <GradientText>Planner</GradientText>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Configure your preferences and let Macro generate a complete routine with sets, reps, RPE targets, and rest periods.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-white/50 font-mono">macro-workout-planner.tsx</span>
                <div className="flex items-center gap-2">
                  {step === "generating" && (
                    <>
                      <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-xs font-medium">Generating…</span>
                      <ThinkingOrb state="composing" size={20} speed={1.2} />
                    </>
                  )}
                  {step === "result" && (
                    <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">Ready</span>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8">
                {step === "configure" && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                      <div className="glass rounded-xl p-5 border border-white/10">
                        <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                          <Icon icon={Target} size={18} className="text-cyan-400" />
                          Parameters
                        </h4>
                        <div className="space-y-4">
                          <SelectField label="Goal" value={formData.goal} options={["Hypertrophy", "Strength", "Endurance", "Power", "Fat Loss", "General Fitness"]} onChange={(v) => setFormData({...formData, goal: v})} />
                          <SelectField label="Experience" value={formData.experience} options={EXPERIENCE_LEVELS} onChange={(v) => setFormData({...formData, experience: v})} />
                          <SelectField label="Frequency" value={formData.frequency} options={FREQUENCY_OPTIONS} onChange={(v) => setFormData({...formData, frequency: v})} />
                          <SelectField label="Equipment" value={formData.equipment} options={EQUIPMENT_OPTIONS} onChange={(v) => setFormData({...formData, equipment: v})} />
                          <SelectField label="Focus" value={formData.focus} options={MUSCLE_GROUPS} onChange={(v) => setFormData({...formData, focus: v})} />
                          <SelectField label="Duration" value={formData.duration} options={["30-45 min", "45-60 min", "60-75 min", "75-90 min", "90+ min"]} onChange={(v) => setFormData({...formData, duration: v})} />
                        </div>
                      </div>

                      <div className="glass rounded-xl p-5 border border-white/10">
                        <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                          <Icon icon={Target} size={18} className="text-red-400" />
                          Target Muscles
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {["Chest", "Shoulders", "Triceps", "Upper Back", "Lats"].map((m, i) => (
                            <span key={i} className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-sm">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="glass rounded-xl p-5 border border-white/10 h-full">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-medium text-white flex items-center gap-2">
                            <Icon icon={Dumbbell} size={18} className="text-cyan-400" />
                            Preview: Generated Routine Structure
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-white/50">
                            <span className="flex items-center gap-1 text-green-400"><CheckCircle size={14} /> 8 exercises</span>
                            <span className="flex items-center gap-1 text-blue-400"><Icon icon={Zap} size={14} /> ~72 min</span>
                          </div>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {SAMPLE_WORKOUT.map((ex, i) => (
                            <div key={i} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${ex.primary ? "bg-cyan-400/5 border border-cyan-400/10" : "bg-white/5 hover:bg-white/10"}`}>
                              <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-medium text-sm">{i + 1}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-white truncate">{ex.name}</p>
                                <p className="text-xs text-white/40">{ex.sets} • {ex.rpe} • {ex.rest} rest • {ex.muscle}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="Swap exercise"><Icon icon={ChevronRight} size={14} /></button>
                                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="View exercise details"><Icon icon={Dumbbell} size={14} /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === "generating" && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 rounded-full border-4 border-cyan-400/20 border-t-cyan-400 animate-spin mb-6" />
                    <h3 className="text-xl font-medium text-white mb-2">Generating Your Workout…</h3>
                    <p className="text-white/50">Analyzing preferences, selecting exercises, optimizing volume</p>
                    <div className="mt-6 flex items-center gap-2 text-cyan-400/80">
                      <ThinkingOrb state="composing" size={20} speed={1.2} />
                      <span className="text-sm">This usually takes a few seconds</span>
                    </div>
                  </div>
                )}

                {step === "result" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-white">Your Push Day Workout</h3>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary">Regenerate</button>
                        <button className="btn-primary"><Icon icon={ArrowRight} size={16} /> Save to Calendar</button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {SAMPLE_WORKOUT.map((ex, i) => (
                        <div key={i} className={`flex items-center gap-4 p-4 rounded-lg transition-all ${ex.primary ? "bg-cyan-400/5 border border-cyan-400/10" : "bg-white/5 hover:bg-white/10"}`}>
                          <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 font-medium text-sm">{i + 1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{ex.name}</p>
                            <p className="text-xs text-white/40">{ex.sets} • {ex.rpe} • {ex.rest} rest • {ex.muscle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="Swap exercise"><Icon icon={ChevronRight} size={14} /></button>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="View exercise details"><Icon icon={Dumbbell} size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
                      <button className="btn-secondary" onClick={handleReset}><Icon icon={ChevronLeft} size={16} /> Adjust Parameters</button>
                      <button className="btn-primary"><Icon icon={ArrowRight} size={16} /> Save to Calendar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

const SELECT_ARROW = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='%236fc8ff' d='M4 6l4 4 4-4'/></svg>";

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all appearance-none pr-10"
        style={{ backgroundImage: `url("${SELECT_ARROW}")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat" }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}