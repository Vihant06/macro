"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const recipe_schema_1 = require("./schemas/recipe.schema");
let RecipesService = class RecipesService {
    recipeModel;
    constructor(recipeModel) {
        this.recipeModel = recipeModel;
    }
    async create(userId, createRecipeDto) {
        const recipe = await this.recipeModel.create({
            ...createRecipeDto,
            userId,
        });
        return recipe;
    }
    async findAll(userId, options) {
        const query = { userId };
        if (options?.tag) {
            query.tags = options.tag;
        }
        if (options?.search) {
            query.name = { $regex: options.search, $options: 'i' };
        }
        const recipes = await this.recipeModel
            .find(query)
            .sort({ name: 1 })
            .limit(options?.limit || 100)
            .exec();
        return recipes.map((recipe) => this.serializeRecipe(recipe));
    }
    async findOne(userId, recipeId) {
        const recipe = await this.recipeModel
            .findOne({ _id: recipeId, userId })
            .exec();
        if (!recipe) {
            throw new common_1.NotFoundException('Recipe not found');
        }
        return recipe;
    }
    async update(userId, recipeId, updateRecipeDto) {
        const recipe = await this.recipeModel
            .findOneAndUpdate({ _id: recipeId, userId }, updateRecipeDto, { new: true, runValidators: true })
            .exec();
        if (!recipe) {
            throw new common_1.NotFoundException('Recipe not found');
        }
        return recipe;
    }
    async remove(userId, recipeId) {
        const result = await this.recipeModel.deleteOne({
            _id: recipeId,
            userId,
        });
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException('Recipe not found');
        }
    }
    async findById(recipeId) {
        return this.recipeModel.findById(recipeId).exec();
    }
    serializeRecipe(recipe) {
        return {
            id: recipe._id,
            userId: recipe.userId,
            name: recipe.name,
            description: recipe.description,
            servings: recipe.servings,
            prepTimeMinutes: recipe.prepTimeMinutes,
            cookTimeMinutes: recipe.cookTimeMinutes,
            ingredients: recipe.ingredients || [],
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fat: recipe.fat,
            tags: recipe.tags || [],
            isPublic: recipe.isPublic,
        };
    }
};
exports.RecipesService = RecipesService;
exports.RecipesService = RecipesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(recipe_schema_1.Recipe.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RecipesService);
//# sourceMappingURL=recipes.service.js.map