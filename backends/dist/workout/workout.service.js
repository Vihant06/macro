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
exports.WorkoutService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const workout_session_schema_1 = require("./schemas/workout-session.schema");
const exercise_log_schema_1 = require("./schemas/exercise-log.schema");
let WorkoutService = class WorkoutService {
    workoutSessionModel;
    exerciseLogModel;
    constructor(workoutSessionModel, exerciseLogModel) {
        this.workoutSessionModel = workoutSessionModel;
        this.exerciseLogModel = exerciseLogModel;
    }
    async start(userId, createWorkoutDto) {
        const activeSession = await this.workoutSessionModel
            .findOne({ userId, status: 'active' })
            .sort({ startTime: -1 })
            .exec();
        if (activeSession) {
            return this.serializeSession(activeSession);
        }
        const session = await this.workoutSessionModel.create({
            userId,
            workoutName: createWorkoutDto.workoutName || 'Workout Session',
            exercises: [],
            startTime: new Date(),
            status: 'active',
        });
        if (createWorkoutDto.exercises?.length) {
            const exerciseLogs = await this.exerciseLogModel.insertMany(createWorkoutDto.exercises.map((exercise) => ({
                userId,
                sessionId: session._id.toString(),
                exerciseName: exercise.exerciseName,
                targetSets: exercise.targetSets,
                targetReps: exercise.targetReps,
                notes: exercise.notes || '',
                sets: [],
                totalVolume: 0,
            })));
            session.exercises = exerciseLogs.map((exercise) => exercise._id.toString());
            await session.save();
        }
        return this.serializeSession(session);
    }
    async getActiveSession(userId) {
        const session = await this.workoutSessionModel
            .findOne({ userId, status: 'active' })
            .sort({ startTime: -1 })
            .exec();
        if (!session)
            return null;
        return this.serializeSession(session);
    }
    async updateProgress(userId, sessionId, updateData) {
        return this.update(userId, sessionId, updateData);
    }
    async addExercise(userId, sessionId, addExerciseDto) {
        const session = await this.workoutSessionModel.findOne({ _id: sessionId, userId });
        if (!session) {
            throw new common_1.NotFoundException('Workout session not found');
        }
        const exerciseLog = await this.exerciseLogModel.create({
            userId,
            sessionId,
            exerciseName: addExerciseDto.exerciseName,
            targetSets: addExerciseDto.targetSets || 3,
            targetReps: addExerciseDto.targetReps || 10,
            notes: addExerciseDto.notes,
            sets: [],
        });
        await this.workoutSessionModel.findByIdAndUpdate(sessionId, {
            $push: { exercises: exerciseLog._id.toString() },
        });
        return this.serializeExercise(exerciseLog);
    }
    async completeSet(userId, sessionId, exerciseName, completeSetDto) {
        const exercise = await this.exerciseLogModel.findOne({
            sessionId,
            exerciseName,
            userId,
        });
        if (!exercise) {
            throw new common_1.NotFoundException('Exercise not found in this session');
        }
        const newSet = {
            completed: true,
            weight: completeSetDto.weight || 0,
            reps: completeSetDto.reps || 0,
            timestamp: new Date(),
        };
        exercise.sets.push(newSet);
        exercise.totalVolume += (completeSetDto.weight || 0) * (completeSetDto.reps || 0);
        await exercise.save();
        await this.updateSessionVolume(sessionId);
        return this.serializeExercise(exercise);
    }
    async update(userId, sessionId, updateData) {
        const session = await this.workoutSessionModel
            .findOneAndUpdate({ _id: sessionId, userId }, updateData, { new: true, runValidators: true })
            .exec();
        if (!session) {
            throw new common_1.NotFoundException('Workout session not found');
        }
        return this.serializeSession(session);
    }
    async end(userId, sessionId) {
        const session = await this.workoutSessionModel.findOne({ _id: sessionId, userId });
        if (!session) {
            throw new common_1.NotFoundException('Workout session not found');
        }
        session.endTime = new Date();
        session.status = 'completed';
        session.duration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
        session.totalDuration = session.duration;
        await session.save();
        return this.serializeSession(session);
    }
    async getHistory(userId, limit = 10) {
        const sessions = await this.workoutSessionModel
            .find({ userId, status: 'completed' })
            .sort({ startTime: -1 })
            .limit(limit)
            .exec();
        return sessions.map((session) => this.serializeSession(session));
    }
    async getSessionExercises(userId, sessionId) {
        const exercises = await this.exerciseLogModel
            .find({ sessionId, userId })
            .exec();
        return exercises.map((exercise) => this.serializeExercise(exercise));
    }
    async updateSessionVolume(sessionId) {
        const exercises = await this.exerciseLogModel.find({ sessionId });
        const totalVolume = exercises.reduce((sum, ex) => sum + (ex.totalVolume || 0), 0);
        await this.workoutSessionModel.findByIdAndUpdate(sessionId, { totalVolume });
    }
    serializeSession(session) {
        return {
            id: session._id.toString(),
            userId: session.userId,
            workoutName: session.workoutName,
            startTime: session.startTime,
            endTime: session.endTime,
            status: session.status,
            exercises: session.exercises,
            exerciseCount: session.exercises.length,
            totalVolume: session.totalVolume,
            duration: session.duration,
            totalDuration: session.totalDuration || session.duration,
        };
    }
    serializeExercise(exercise) {
        return {
            id: exercise._id.toString(),
            userId: exercise.userId,
            sessionId: exercise.sessionId,
            exerciseName: exercise.exerciseName,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            sets: exercise.sets,
            notes: exercise.notes,
            totalVolume: exercise.totalVolume,
            completedSets: exercise.sets.filter((s) => s.completed).length,
        };
    }
};
exports.WorkoutService = WorkoutService;
exports.WorkoutService = WorkoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(workout_session_schema_1.WorkoutSession.name)),
    __param(1, (0, mongoose_1.InjectModel)(exercise_log_schema_1.ExerciseLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WorkoutService);
//# sourceMappingURL=workout.service.js.map