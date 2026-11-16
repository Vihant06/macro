import api from './api';

/**
 * Macros service — matches NestJS MacrosController
 * All endpoints are JWT-protected. Backend wraps in { success, data, timestamp }.
 * 
 * GET /macros/today -> data: { date, goals, consumed, remaining, percentComplete }
 * GET /macros/week?endDate=  -> data: { startDate, endDate, daysTracked, weeklyTotals, dailyAverages, goals, weeklyGoalTotals }
 * GET /macros/distribution?date= -> data: { date, totalCalories, distribution: { protein, carbs, fat } }
 * GET /macros/monthly?month=&year= -> data: { month, year, dailyData[], monthlyAverage }
 */
export const macroService = {
  async getTodayTotals(date) {
    const params = date ? { date } : {};
    const { data: envelope } = await api.get('/macros/today', { params });
    return envelope.data;
  },

  async getWeeklySummary(endDate) {
    const params = endDate ? { endDate } : {};
    const { data: envelope } = await api.get('/macros/week', { params });
    return envelope.data;
  },

  async getMacroDistribution(date) {
    const params = date ? { date } : {};
    const { data: envelope } = await api.get('/macros/distribution', { params });
    return envelope.data;
  },

  async getMonthlyTrend(month, year) {
    const { data: envelope } = await api.get('/macros/monthly', { params: { month, year } });
    return envelope.data;
  },
};

/**
 * Food service — matches NestJS FoodController
 * 
 * POST   /food           -> create entry
 * GET    /food?date=&mealType= -> list entries
 * GET    /food/daily-totals?date= -> daily totals
 * GET    /food/:id        -> single entry
 * PATCH  /food/:id        -> update entry
 * DELETE /food/:id        -> delete entry
 */
export const foodService = {
  async getEntries(date, mealType) {
    const params = {};
    if (date) params.date = date;
    if (mealType) params.mealType = mealType;
    const { data: envelope } = await api.get('/food', { params });
    return envelope.data;
  },

  async getDailyTotals(date) {
    const { data: envelope } = await api.get('/food/daily-totals', { params: { date } });
    return envelope.data;
  },

  async createEntry(entry) {
    const { data: envelope } = await api.post('/food', entry);
    return envelope.data;
  },

  async updateEntry(id, updates) {
    const { data: envelope } = await api.patch(`/food/${id}`, updates);
    return envelope.data;
  },

  async deleteEntry(id) {
    await api.delete(`/food/${id}`);
  },
};

/**
 * Weight service — matches NestJS WeightController
 * 
 * POST   /weight         -> log weight
 * GET    /weight?startDate=&endDate=&limit= -> list logs
 * GET    /weight/trend?days= -> trend analysis
 * PATCH  /weight/:id     -> update log
 * DELETE /weight/:id     -> delete log
 */
export const weightService = {
  async logWeight(weight, date, bodyFatPercentage, notes) {
    const { data: envelope } = await api.post('/weight', { weight, date, bodyFatPercentage, notes });
    return envelope.data;
  },

  async getLogs(startDate, endDate, limit) {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (limit) params.limit = limit;
    const { data: envelope } = await api.get('/weight', { params });
    return envelope.data;
  },

  async getTrend(days = 30) {
    const { data: envelope } = await api.get('/weight/trend', { params: { days } });
    return envelope.data;
  },

  async deleteLog(id) {
    await api.delete(`/weight/${id}`);
  },
};

/**
 * User/Profile service — matches NestJS UsersController
 * 
 * GET    /users/profile -> user profile
 * PATCH  /users/profile -> update profile
 * GET    /users/goals   -> macro goals
 * PATCH  /users/goals   -> update goals
 * POST   /users/goals/calculate -> auto-calculate goals
 */
export const userService = {
  async getProfile() {
    const { data: envelope } = await api.get('/users/profile');
    return envelope.data;
  },

  async updateProfile(updates) {
    const { data: envelope } = await api.patch('/users/profile', updates);
    return envelope.data;
  },

  async getGoals() {
    const { data: envelope } = await api.get('/users/goals');
    return envelope.data;
  },

  async updateGoals(goals) {
    const { data: envelope } = await api.patch('/users/goals', goals);
    return envelope.data;
  },

  async calculateGoals(data) {
    const { data: envelope } = await api.post('/users/goals/calculate', data);
    return envelope.data;
  },
};

/**
 * AI service — matches NestJS AiController
 */
export const aiService = {
  async chat(message) {
    const { data: envelope } = await api.post('/ai/chat', { message });
    return envelope.data;
  }
};