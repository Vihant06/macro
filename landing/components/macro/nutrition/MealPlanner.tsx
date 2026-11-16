"use client";

import { useState } from "react";
import { ScrollReveal, StaggerContainer } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Icon } from "../ui/Icon";
import { Utensils, Target, Flame, Dumbbell, ArrowRight, CheckCircle, ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react";
import { ThinkingOrb } from "../ui/ThinkingOrb";

const MEALS = [
  { name: "Breakfast", time: "7:30 AM", calories: 580, protein: 42, carbs: 55, fat: 18, items: ["Greek yogurt (200g)", "Mixed berries (150g)", "Granola (40g)", "Honey (1 tbsp)", "Chia seeds (1 tbsp)"] },
  { name: "Lunch", time: "12:30 PM", calories: 650, protein: 48, carbs: 65, fat: 22, items: ["Grilled chicken breast (180g)", "Quinoa (150g cooked)", "Roasted vegetables (200g)", "Olive oil (1 tbsp)", "Lemon-tahini dressing"] },
  { name: "Pre-Workout", time: "4:00 PM", calories: 320, protein: 25, carbs: 40, fat: 8, items: ["Banana (1 medium)", "Whey protein isolate (30g)", "Almond butter (1 tbsp)", "Oat milk (200ml)"] },
  { name: "Dinner", time: "7:30 PM", calories: 620, protein: 50, carbs: 45, fat: 25, items: ["Salmon fillet (180g)", "Sweet potato (200g)", "Asparagus (150g)", "Olive oil (1 tbsp)", "Herb butter (1 tsp)"] },
  { name: "Late Snack", time: "9:30 PM", calories: 250, protein: 20, carbs: 15, fat: 12, items: ["Cottage cheese (150g)", "Pineapple chunks (100g)", "Walnuts (15g)"] },
];

const DIET_OPTIONS = ["No Preference", "High Protein", "Keto", "Mediterranean", "Vegan", "Vegetarian", "Paleo", "Low Carb", "Intermittent Fasting"];
const ALLERGIES = ["None", "Dairy", "Gluten", "Nuts", "Shellfish", "Soy", "Eggs"];

export function MealPlanner() {
  const [step, setStep] = useState<"configure" | "generating" | "result">("configure");
  const [formData, setFormData] = useState({
    calories: "2400",
    protein: "185",
    carbs: "280",
    fat: "75",
    diet: "High Protein",
    mealsPerDay: "5",
    allergies: "None",
    budget: "Moderate",
    prepTime: "30-45 min",
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

  const totals = MEALS.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <section id="planner" className="section">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
                <Icon icon={Utensils} size={14} />
                Meal Plan Generator
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                AI Nutrition <GradientText variant="cyan">Planner</GradientText>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Set your targets, preferences, and constraints. Macro generates a complete meal plan with recipes, macros per meal, and a grocery list.
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
                <span className="text-sm text-white/50 font-mono">macro-nutrition-planner.tsx</span>
                <div className="flex items-center gap-2">
                  {step === "generating" && (
                    <>
                      <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-medium">Generating…</span>
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
                          <Icon icon={Target} size={18} className="text-green-400" />
                          Daily Targets
                        </h4>
                        <div className="space-y-4">
                          <InputField label="Calories" value={formData.calories} onChange={(v) => setFormData({...formData, calories: v})} type="number" />
                          <InputField label="Protein (g)" value={formData.protein} onChange={(v) => setFormData({...formData, protein: v})} type="number" />
                          <InputField label="Carbs (g)" value={formData.carbs} onChange={(v) => setFormData({...formData, carbs: v})} type="number" />
                          <InputField label="Fat (g)" value={formData.fat} onChange={(v) => setFormData({...formData, fat: v})} type="number" />
                          <SelectField label="Diet Style" value={formData.diet} options={DIET_OPTIONS} onChange={(v) => setFormData({...formData, diet: v})} />
                          <SelectField label="Meals/Day" value={formData.mealsPerDay} options={["3", "4", "5", "6"]} onChange={(v) => setFormData({...formData, mealsPerDay: v})} />
                          <SelectField label="Allergies" value={formData.allergies} options={ALLERGIES} onChange={(v) => setFormData({...formData, allergies: v})} />
                          <SelectField label="Budget" value={formData.budget} options={["Budget", "Moderate", "Premium"]} onChange={(v) => setFormData({...formData, budget: v})} />
                          <SelectField label="Max Prep Time" value={formData.prepTime} options={["15-20 min", "20-30 min", "30-45 min", "45-60 min", "60+ min"]} onChange={(v) => setFormData({...formData, prepTime: v})} />
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <div className="glass rounded-xl p-5 border border-white/10 h-full">
                        <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                          <Icon icon={Target} size={18} className="text-green-400" />
                          Macro Distribution Preview
                        </h4>
                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <MacroRing label="Protein" value={`${formData.protein}g`} target={`${formData.protein}g`} color="red" current={parseInt(formData.protein) || 0} max={parseInt(formData.protein) || 1} />
                          <MacroRing label="Carbs" value={`${formData.carbs}g`} target={`${formData.carbs}g`} color="blue" current={parseInt(formData.carbs) || 0} max={parseInt(formData.carbs) || 1} />
                          <MacroRing label="Fats" value={`${formData.fat}g`} target={`${formData.fat}g`} color="yellow" current={parseInt(formData.fat) || 0} max={parseInt(formData.fat) || 1} />
                          <MacroRing label="Calories" value={`${formData.calories}`} target={`${formData.calories}`} color="cyan" current={parseInt(formData.calories) || 0} max={parseInt(formData.calories) || 1} />
                        </div>
                        <div className="glass rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/50 text-sm">Protein %</span>
                            <span className="font-medium text-white">
                              {((parseInt(formData.protein) * 4) / parseInt(formData.calories) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/50 text-sm">Carbs %</span>
                            <span className="font-medium text-white">
                              {((parseInt(formData.carbs) * 4) / parseInt(formData.calories) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Fat %</span>
                            <span className="font-medium text-white">
                              {((parseInt(formData.fat) * 9) / parseInt(formData.calories) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === "generating" && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin mb-6" />
                    <h3 className="text-xl font-medium text-white mb-2">Generating Your Meal Plan…</h3>
                    <p className="text-white/50">Calculating macros, selecting recipes, optimizing grocery list</p>
                    <div className="mt-6 flex items-center gap-2 text-green-400/80">
                      <ThinkingOrb state="composing" size={20} speed={1.2} />
                      <span className="text-sm">This usually takes a few seconds</span>
                    </div>
                  </div>
                )}

                {step === "result" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-white">Your Meal Plan — {formData.calories} cal / {formData.protein}g protein</h3>
                      <div className="flex items-center gap-2">
                        <button className="btn-secondary">Regenerate</button>
                        <button className="btn-primary"><Icon icon={ArrowRight} size={16} /> Export Plan</button>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-4 gap-6">
                      <div className="lg:col-span-1 space-y-4">
                        <div className="glass rounded-xl p-5 border border-white/10">
                          <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                            <Icon icon={Target} size={18} className="text-red-400" />
                            Daily Targets
                          </h4>
                          <div className="space-y-4">
                            <MacroProgress label="Protein" current={totals.protein} target={parseInt(formData.protein)} unit="g" color="red" />
                            <MacroProgress label="Carbs" current={totals.carbs} target={parseInt(formData.carbs)} unit="g" color="blue" />
                            <MacroProgress label="Fats" current={totals.fat} target={parseInt(formData.fat)} unit="g" color="yellow" />
                            <MacroProgress label="Calories" current={totals.calories} target={parseInt(formData.calories)} unit="cal" color="cyan" />
                          </div>
                        </div>
                        <div className="glass rounded-xl p-5 border border-white/10">
                          <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                            <Icon icon={Target} size={18} className="text-green-400" />
                            Preferences
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">{formData.diet}</span>
                            <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm">{formData.mealsPerDay} meals/day</span>
                            <span className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm">{formData.prepTime}</span>
                            <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm">{formData.budget}</span>
                            {formData.allergies !== "None" && (
                              <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm">No {formData.allergies}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-3 space-y-4">
                        <div className="glass rounded-xl p-5 border border-white/10">
                          <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                            <Icon icon={Utensils} size={18} className="text-green-400" />
                            Today's Meals
                          </h4>
                          <div className="space-y-3">
                            {MEALS.map((meal, i) => (
                              <MealCard key={i} meal={meal} index={i} />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-4">
                          <button className="btn-secondary" onClick={handleReset}><Icon icon={ChevronLeft} size={16} /> Adjust Targets</button>
                          <button className="btn-primary"><Icon icon={ArrowRight} size={16} /> View Grocery List</button>
                        </div>
                      </div>
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

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
      />
    </div>
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
        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all appearance-none pr-10"
        style={{ backgroundImage: `url("${SELECT_ARROW}")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat" }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function MacroRing({ label, value, target, color, current, max }: { label: string; value: string; target: string; color: "red" | "blue" | "yellow" | "cyan"; current: number; max: number }) {
  const percentage = Math.min(current / max, 1);
  const strokeDashoffset = 100 - percentage * 100;
  
  const colors = {
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
    cyan: "text-cyan-400",
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">{label}</span>
        <span className="font-medium text-white text-sm">{value}</span>
      </div>
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="4" strokeOpacity="0.1" />
          <circle
            cx="32" cy="32" r="28"
            fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
            strokeDasharray="176" strokeDashoffset={strokeDashoffset}
            className={`${colors[color]} transition-all duration-1000`}
            style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-white text-xs">{Math.round(percentage * 100)}%</span>
        </div>
      </div>
    </div>
  );
}

function MacroProgress({ label, current, target, unit, color }: { label: string; current: number; target: number; unit: string; color: "red" | "blue" | "yellow" | "cyan" }) {
  const percentage = Math.min(current / target, 1);
  
  const colors = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-white/60 text-sm">{label}</span>
        <span className="font-medium text-white text-sm">{current}{unit} / {target}{unit}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${colors[color]} rounded-full transition-all duration-1000`} style={{ width: `${percentage * 100}%` }} />
      </div>
    </div>
  );
}

function MealCard({ meal, index }: { meal: typeof MEALS[0]; index: number }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        <span className="text-green-400 font-medium text-sm">{index + 1}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h5 className="font-medium text-white">{meal.name}</h5>
          <span className="text-sm text-white/40">{meal.time}</span>
        </div>
        <p className="text-white/60 text-sm mb-2">{meal.items.join(", ")}</p>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1"><Icon icon={Flame} size={12} /> {meal.calories} cal</span>
          <span className="flex items-center gap-1 text-red-400"><Icon icon={Dumbbell} size={12} /> {meal.protein}g protein</span>
          <span className="flex items-center gap-1 text-blue-400">{meal.carbs}g carbs</span>
          <span className="flex items-center gap-1 text-yellow-400">{meal.fat}g fat</span>
        </div>
      </div>
      <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors opacity-0 group-hover:opacity-100" aria-label="Swap meal">
        <Icon icon={ChevronRight} size={14} />
      </button>
    </div>
  );
}