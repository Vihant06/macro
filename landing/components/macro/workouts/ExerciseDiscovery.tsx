"use client";

import { useState } from "react";
import { ScrollReveal, StaggerContainer } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Icon } from "../ui/Icon";
import { Search, Filter, Dumbbell, Activity, ChevronRight, ChevronLeft, ExternalLink, Star, X, type LucideIcon } from "lucide-react";

const EXERCISES = [
  { name: "Barbell Bench Press", muscle: "Chest", secondary: ["Triceps", "Front Delts"], equipment: "Barbell", type: "Compound", difficulty: "Intermediate", rating: 4.9 },
  { name: "Incline Dumbbell Press", muscle: "Upper Chest", secondary: ["Triceps", "Front Delts"], equipment: "Dumbbells", type: "Compound", difficulty: "Beginner", rating: 4.7 },
  { name: "Standing Overhead Press", muscle: "Shoulders", secondary: ["Triceps", "Upper Chest"], equipment: "Barbell", type: "Compound", difficulty: "Intermediate", rating: 4.8 },
  { name: "Dumbbell Lateral Raises", muscle: "Side Delts", secondary: [], equipment: "Dumbbells", type: "Isolation", difficulty: "Beginner", rating: 4.5 },
  { name: "Pull-Ups", muscle: "Lats", secondary: ["Biceps", "Rear Delts"], equipment: "Bodyweight", type: "Compound", difficulty: "Advanced", rating: 4.9 },
  { name: "Barbell Row", muscle: "Upper Back", secondary: ["Lats", "Biceps", "Rear Delts"], equipment: "Barbell", type: "Compound", difficulty: "Intermediate", rating: 4.8 },
  { name: "Romanian Deadlift", muscle: "Hamstrings", secondary: ["Glutes", "Lower Back"], equipment: "Barbell", type: "Compound", difficulty: "Intermediate", rating: 4.9 },
  { name: "Goblet Squat", muscle: "Quads", secondary: ["Glutes", "Core"], equipment: "Dumbbell", type: "Compound", difficulty: "Beginner", rating: 4.6 },
  { name: "Cable Face Pulls", muscle: "Rear Delts", secondary: ["Upper Back", "Rotator Cuff"], equipment: "Cable", type: "Isolation", difficulty: "Beginner", rating: 4.7 },
  { name: "Dips", muscle: "Triceps", secondary: ["Chest", "Front Delts"], equipment: "Bodyweight", type: "Compound", difficulty: "Intermediate", rating: 4.6 },
  { name: "Hammer Curls", muscle: "Biceps", secondary: ["Forearms"], equipment: "Dumbbells", type: "Isolation", difficulty: "Beginner", rating: 4.4 },
  { name: "Hip Thrusts", muscle: "Glutes", secondary: ["Hamstrings"], equipment: "Barbell", type: "Compound", difficulty: "Beginner", rating: 4.8 },
];

const MUSCLE_FILTERS = ["All", "Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];
const EQUIPMENT_FILTERS = ["All", "Barbell", "Dumbbells", "Cable", "Machine", "Bodyweight", "Bands", "Kettlebell"];
const TYPE_FILTERS = ["All", "Compound", "Isolation"];

export function ExerciseDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISES[0] | null>(null);

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = muscleFilter === "All" || ex.muscle === muscleFilter;
    const matchesEquipment = equipmentFilter === "All" || ex.equipment === equipmentFilter;
    const matchesType = typeFilter === "All" || ex.type === typeFilter;
    return matchesSearch && matchesMuscle && matchesEquipment && matchesType;
  });

  return (
    <section id="exercise-discovery" className="section bg-[var(--grad-radial)]">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-medium mb-6">
                <Icon icon={Search} size={14} />
                Smart Exercise Discovery
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Find the Right <GradientText>Exercise</GradientText>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Search 500+ exercises by muscle group, equipment, movement pattern, or name. Detailed form cues, video references, and alternatives included.
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
                <span className="text-sm text-white/50 font-mono">macro-exercise-discovery.tsx</span>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  {filteredExercises.length} exercises found
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="glass rounded-xl p-5 border border-white/10 sticky top-24">
                      <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Icon icon={Filter} size={18} className="text-cyan-400" />
                        Filters
                      </h4>
                      <div className="space-y-4">
                        <FilterGroup
                          label="Search"
                          icon={Search}
                          placeholder="Search exercises…"
                          value={searchQuery}
                          onChange={setSearchQuery}
                        />
                        <FilterGroup
                          label="Muscle Group"
                          icon={Activity}
                          options={MUSCLE_FILTERS}
                          value={muscleFilter}
                          onChange={setMuscleFilter}
                        />
                        <FilterGroup
                          label="Equipment"
                          icon={Dumbbell}
                          options={EQUIPMENT_FILTERS}
                          value={equipmentFilter}
                          onChange={setEquipmentFilter}
                        />
                        <FilterGroup
                          label="Movement Type"
                          icon={ChevronRight}
                          options={TYPE_FILTERS}
                          value={typeFilter}
                          onChange={setTypeFilter}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="glass rounded-xl p-5 border border-white/10">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider">Exercise</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">Primary Muscle</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">Secondary</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden md:table-cell">Equipment</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">Type</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider hidden lg:table-cell">Difficulty</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider">Rating</th>
                              <th className="pb-3 text-xs font-medium text-white/50 uppercase tracking-wider"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {filteredExercises.map((ex, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedExercise(ex)}>
                                <td className="py-4 font-medium text-white">{ex.name}</td>
                                <td className="py-4 text-white/60 hidden md:table-cell">{ex.muscle}</td>
                                <td className="py-4 text-white/50 text-sm hidden lg:table-cell">{ex.secondary.join(", ") || "—"}</td>
                                <td className="py-4 text-white/60 hidden md:table-cell">{ex.equipment}</td>
                                <td className="py-4 hidden lg:table-cell">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${ex.type === "Compound" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                                    {ex.type}
                                  </span>
                                </td>
                                <td className="py-4 text-white/50 hidden lg:table-cell">{ex.difficulty}</td>
                                <td className="py-4 flex items-center gap-1">
                                  <Icon icon={Star} size={12} className="text-yellow-400" />
                                  <span className="text-white/70 text-sm font-medium">{ex.rating}</span>
                                </td>
                                <td className="py-4 text-right">
                                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="View exercise details">
                                    <Icon icon={ExternalLink} size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>

      {selectedExercise && (
        <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </section>
  );
}

const SELECT_ARROW = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='%236fc8ff' d='M4 6l4 4 4-4'/></svg>";

function FilterGroup({ label, icon: IconComponent, options, value, onChange, placeholder }: {
  label: string;
  icon: LucideIcon;
  options?: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5 flex items-center gap-1.5">
        <IconComponent size={12} className="text-white/40" />
        {label}
      </label>
      {options ? (
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
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-white/30"
        />
      )}
    </div>
  );
}

function ExerciseDetailModal({ exercise, onClose }: { exercise: typeof EXERCISES[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="exercise-title">
      <div className="glass rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 id="exercise-title" className="text-xl font-medium text-white">{exercise.name}</h2>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors" aria-label="Close">
            <Icon icon={X} size={20} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-cyan-400 text-sm">{exercise.muscle}</span>
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">{exercise.type}</span>
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm">{exercise.difficulty}</span>
            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">{exercise.equipment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={Star} size={16} className="text-yellow-400" />
            <span className="font-medium text-white">{exercise.rating}/5.0</span>
            <span className="text-white/50">• {exercise.secondary.length > 0 ? `Secondary: ${exercise.secondary.join(", ")}` : "No significant secondary muscles"}</span>
          </div>
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-medium text-white mb-3">How to Perform</h4>
            <p className="text-white/60 leading-relaxed">
              Detailed form cues, video references, and alternative movements would be displayed here.
              Macro provides step-by-step instructions, common mistakes to avoid, and progression/regression options.
            </p>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
            <button onClick={onClose} className="btn-secondary">Close</button>
            <button className="btn-primary"><Icon icon={ChevronRight} size={16} /> Add to Workout</button>
          </div>
        </div>
      </div>
    </div>
  );
}