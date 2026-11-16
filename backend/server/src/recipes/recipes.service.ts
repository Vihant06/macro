import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe, RecipeDocument } from './schemas/recipe.schema';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name)
    private recipeModel: Model<RecipeDocument>,
  ) {}

  /**
   * Create a new recipe
   */
  async create(
    userId: string,
    createRecipeDto: CreateRecipeDto,
  ): Promise<Recipe> {
    const recipe = await this.recipeModel.create({
      ...createRecipeDto,
      userId,
    });

    return recipe;
  }

  /**
   * Get all recipes for a user
   */
  async findAll(
    userId: string,
    options?: { tag?: string; search?: string; limit?: number },
  ) {
    const query: any = { userId };

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

  /**
   * Get a single recipe by ID
   */
  async findOne(userId: string, recipeId: string): Promise<Recipe> {
    const recipe = await this.recipeModel
      .findOne({ _id: recipeId, userId })
      .exec();

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  /**
   * Update a recipe
   */
  async update(
    userId: string,
    recipeId: string,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const recipe = await this.recipeModel
      .findOneAndUpdate(
        { _id: recipeId, userId },
        updateRecipeDto,
        { new: true, runValidators: true },
      )
      .exec();

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  /**
   * Delete a recipe
   */
  async remove(userId: string, recipeId: string): Promise<void> {
    const result = await this.recipeModel.deleteOne({
      _id: recipeId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Recipe not found');
    }
  }

  /**
   * Get recipe by ID (for use in other modules)
   */
  async findById(recipeId: string): Promise<Recipe | null> {
    return this.recipeModel.findById(recipeId).exec();
  }

  private serializeRecipe(recipe: RecipeDocument) {
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
}
