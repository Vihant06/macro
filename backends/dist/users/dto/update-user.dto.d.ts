export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum ActivityLevel {
    SEDENTARY = "sedentary",
    LIGHTLY_ACTIVE = "lightly_active",
    MODERATELY_ACTIVE = "moderately_active",
    VERY_ACTIVE = "very_active",
    EXTREMELY_ACTIVE = "extremely_active"
}
export declare enum Goal {
    LOSE_WEIGHT = "lose_weight",
    MAINTAIN = "maintain",
    GAIN_MUSCLE = "gain_muscle"
}
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    age?: number;
    gender?: Gender;
    height?: number;
    weight?: number;
    bodyFat?: number;
    activityLevel?: ActivityLevel;
    goal?: Goal;
}
