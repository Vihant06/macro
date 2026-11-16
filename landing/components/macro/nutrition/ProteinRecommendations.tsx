"use client";

import { useState } from "react";
import { ScrollReveal, StaggerContainer } from "../ui/ScrollReveal";
import { GradientText } from "../ui/GradientText";
import { Icon } from "../ui/Icon";
import { Flame, Dumbbell, Utensils, ChefHat, ShoppingCart, Zap, CheckCircle, Plus, Minus, Search, Filter, ChevronRight, type LucideIcon } from "lucide-react";

const PROTEIN_MEALS = [
  {
    name: "Greek Yogurt Power Bowl",
    protein: 48,
    calories: 420,
    carbs: 35,
    fat: 12,
    prepTime: "5 min",
    diet: ["High Protein", "Vegetarian"],
    ingredients: ["Greek yogurt 0% (250g)", "Whey isolate (1 scoop)", "Mixed berries (150g)", "Granola (30g)", "Chia seeds (1 tbsp)", "Honey (1 tsp)"],
    tags: ["Breakfast", "No Cook", "Meal Prep Friendly"],
  },
  {
    name: "Chicken & Rice Meal Prep",
    protein: 52,
    calories: 580,
    carbs: 65,
    fat: 14,
    prepTime: "30 min",
    diet: ["High Protein", "Gluten Free"],
    ingredients: ["Chicken breast (200g)", "Jasmine rice (180g cooked)", "Broccoli (150g)", "Olive oil (1 tbsp)", "Soy sauce (1 tbsp)", "Garlic & ginger"],
    tags: ["Lunch", "Meal Prep", "Batch Cook"],
  },
  {
    name: "Salmon & Sweet Potato",
    protein: 45,
    calories: 520,
    carbs: 40,
    fat: 22,
    prepTime: "25 min",
    diet: ["High Protein", "Mediterranean", "Gluten Free"],
    ingredients: ["Salmon fillet (180g)", "Sweet potato (200g)", "Asparagus (150g)", "Olive oil (1 tbsp)", "Lemon & dill", "Garlic"],
    tags: ["Dinner", "Omega-3", "Anti-Inflammatory"],
  },
  {
    name: "Turkey & Egg White Scramble",
    protein: 42,
    calories: 380,
    carbs: 15,
    fat: 16,
    prepTime: "10 min",
    diet: ["High Protein", "Low Carb", "Keto Friendly"],
    ingredients: ["Ground turkey 93% (120g)", "Egg whites (200ml)", "Spinach (100g)", "Mushrooms (80g)", "Feta cheese (30g)", "Olive oil spray"],
    tags: ["Breakfast", "Low Carb", "Quick"],
  },
  {
    name: "Tuna & Chickpea Salad",
    protein: 38,
    calories: 410,
    carbs: 30,
    fat: 18,
    prepTime: "5 min",
    diet: ["High Protein", "Mediterranean", "Pescatarian"],
    ingredients: ["Canned tuna in water (150g)", "Chickpeas (100g)", "Cherry tomatoes (100g)", "Red onion (50g)", "Olive oil (1 tbsp)", "Lemon & herbs"],
    tags: ["Lunch", "No Cook", "Budget Friendly"],
  },
  {
    name: "Protein Pancakes",
    protein: 35,
    calories: 390,
    carbs: 42,
    fat: 10,
    prepTime: "15 min",
    diet: ["High Protein", "Vegetarian"],
    ingredients: ["Oats (60g)", "Cottage cheese (100g)", "Eggs (2)", "Whey protein (1/2 scoop)", "Banana (1/2)", "Baking powder (1 tsp)"],
    tags: ["Breakfast", "Sweet", "Meal Prep Friendly"],
  },
  {
    name: "Lean Beef & Veggie Stir-Fry",
    protein: 48,
    calories: 480,
    carbs: 35,
    fat: 18,
    prepTime: "20 min",
    diet: ["High Protein", "Gluten Free"],
    ingredients: ["Lean beef sirloin (150g)", "Mixed vegetables (250g)", "Brown rice (150g cooked)", "Soy sauce (2 tbsp)", "Sesame oil (1 tsp)", "Ginger & garlic"],
    tags: ["Dinner", "Quick", "High Iron"],
  },
  {
    name: "Protein Overnight Oats",
    protein: 32,
    calories: 380,
    carbs: 45,
    fat: 10,
    prepTime: "5 min + overnight",
    diet: ["High Protein", "Vegetarian", "Meal Prep"],
    ingredients: ["Rolled oats (50g)", "Greek yogurt (100g)", "Whey protein (1/2 scoop)", "Almond milk (150ml)", "Peanut butter (1 tbsp)", "Cocoa powder (1 tsp)"],
    tags: ["Breakfast", "Make Ahead", "Chocolate"],
  },
];

const DIET_FILTERS = ["All", "High Protein", "Keto", "Mediterranean", "Vegan", "Vegetarian", "Paleo", "Low Carb", "Gluten Free"];
const MEAL_FILTERS = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];
const PROTEIN_RANGE = ["All", "30-35g", "35-40g", "40-45g", "45-50g", "50g+"];

export function ProteinRecommendations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState("All");
  const [mealFilter, setMealFilter] = useState("All");
  const [proteinFilter, setProteinFilter] = useState("All");
  const [sortBy, setSortBy] = useState("protein-desc");

  const filteredMeals = PROTEIN_MEALS.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiet = dietFilter === "All" || meal.diet.includes(dietFilter);
    const matchesMeal = mealFilter === "All" || meal.tags.includes(mealFilter);
    const matchesProtein = proteinFilter === "All" || 
      (proteinFilter === "30-35g" && meal.protein >= 30 && meal.protein < 35) ||
      (proteinFilter === "35-40g" && meal.protein >= 35 && meal.protein < 40) ||
      (proteinFilter === "40-45g" && meal.protein >= 40 && meal.protein < 45) ||
      (proteinFilter === "45-50g" && meal.protein >= 45 && meal.protein < 50) ||
      (proteinFilter === "50g+" && meal.protein >= 50);
    return matchesSearch && matchesDiet && matchesMeal && matchesProtein;
  }).sort((a, b) => {
    switch (sortBy) {
      case "protein-desc": return b.protein - a.protein;
      case "protein-asc": return a.protein - b.protein;
      case "calories-asc": return a.calories - b.calories;
      case "prep-time": return a.prepTime.localeCompare(b.prepTime);
      default: return 0;
    }
  });

  return (
    <section id="protein-recommendations" className="section">
      <div className="container-wide">
        <StaggerContainer baseDelay={0} staggerDelay={100} direction="up">
          <ScrollReveal delay={0}>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
                <Icon icon={Flame} size={14} />
                High-Protein Meals
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif leading-[1.05] mb-6 tracking-tight">
                Hit Your Protein Targets <GradientText variant="cyan">Effortlessly</GradientText>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Discover 500+ high-protein meals filtered by diet, meal type, and protein content. Each recipe includes macros, prep time, and grocery list integration.
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
                <span className="text-sm text-white/50 font-mono">macro-protein-discovery.tsx</span>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  {filteredMeals.length} meals found
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="glass rounded-xl p-5 border border-white/10 sticky top-24">
                      <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Icon icon={Filter} size={18} className="text-orange-400" />
                        Filters
                      </h4>
                      <div className="space-y-4">
                        <FilterGroup
                          label="Search"
                          icon={Search}
                          placeholder="Search meals, ingredients…"
                          value={searchQuery}
                          onChange={setSearchQuery}
                        />
                        <FilterGroup
                          label="Diet Style"
                          icon={Utensils}
                          options={DIET_FILTERS}
                          value={dietFilter}
                          onChange={setDietFilter}
                        />
                        <FilterGroup
                          label="Meal Type"
                          icon={ChefHat}
                          options={MEAL_FILTERS}
                          value={mealFilter}
                          onChange={setMealFilter}
                        />
                        <FilterGroup
                          label="Protein Range"
                          icon={Dumbbell}
                          options={PROTEIN_RANGE}
                          value={proteinFilter}
                          onChange={setProteinFilter}
                        />
                        <SelectField
                          label="Sort By"
                          value={sortBy}
                          options={[
                            { value: "protein-desc", label: "Protein: High to Low" },
                            { value: "protein-asc", label: "Protein: Low to High" },
                            { value: "calories-asc", label: "Calories: Low to High" },
                            { value: "prep-time", label: "Prep Time: Quick First" },
                          ]}
                          onChange={setSortBy}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="grid md:grid-cols-2 gap-6">
                      {filteredMeals.map((meal, i) => (
                        <MealCard key={i} meal={meal} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
              {[
                { icon: Zap, color: "text-yellow-400", title: "Instant Macros", desc: "Exact protein, carbs, fat per serving" },
                { icon: ShoppingCart, color: "text-green-400", title: "Grocery Integration", desc: "One-click add to shopping list" },
                { icon: ChefHat, color: "text-purple-400", title: "Meal Prep Guides", desc: "Batch cooking instructions included" },
              ].map((item, i) => (
                <div key={i} className="glass rounded-2xl p-6 hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 ${item.color} mb-4`}>
                    <Icon icon={item.icon} size={28} />
                  </div>
                  <h4 className="font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </StaggerContainer>
      </div>
    </section>
  );
}

const SELECT_ARROW = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='%23f97316' d='M4 6l4 4 4-4'/></svg>";

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
          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none pr-10"
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
          className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all placeholder-white/30"
        />
      )}
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none pr-10"
        style={{ backgroundImage: `url("${SELECT_ARROW}")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat" }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function MealCard({ meal, index }: { meal: typeof PROTEIN_MEALS[0]; index: number }) {
  return (
    <article className="glass rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-medium text-white group-hover:text-orange-400 transition-colors">{meal.name}</h3>
          <p className="text-white/50 text-sm">{meal.prepTime} • {meal.calories} cal</p>
        </div>
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <span className="font-bold text-orange-400 text-lg">{meal.protein}g</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {meal.diet.slice(0, 2).map((d, i) => (
          <span key={i} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs">{d}</span>
        ))}
        {meal.tags.slice(0, 2).map((t, i) => (
          <span key={i} className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs">{t}</span>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-white/5 rounded-xl">
        <div className="text-center">
          <div className="font-bold text-white text-lg">{meal.protein}g</div>
          <div className="text-white/50 text-xs">Protein</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-white text-lg">{meal.carbs}g</div>
          <div className="text-white/50 text-xs">Carbs</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-white text-lg">{meal.fat}g</div>
          <div className="text-white/50 text-xs">Fat</div>
        </div>
      </div>

      <details className="group">
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <span className="text-white/60 text-sm font-medium">View Ingredients</span>
          <Icon icon={ChevronRight} size={16} className="text-white/50 transition-transform group-open:rotate-90" />
        </summary>
        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
          {meal.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
              <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
              <span>{ing}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <Icon icon={Plus} size={16} className="text-orange-400" />
            <span className="text-orange-400 font-medium text-sm">Add to Meal Plan</span>
            <Icon icon={ShoppingCart} size={16} className="text-green-400 ml-auto" />
            <span className="text-green-400 font-medium text-sm">Add to Grocery List</span>
          </div>
        </div>
      </details>
    </article>
  );
}