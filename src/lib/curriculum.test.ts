import { describe, expect, it } from "vitest";
import { curriculum, isModuleUnlocked, type StudentLevel } from "./curriculum";

describe("isModuleUnlocked", () => {
    it("locks every module when the student has no level yet", () => {
        for (const module of curriculum) {
            expect(isModuleUnlocked(module.level, null)).toBe(false);
            expect(isModuleUnlocked(module.level, undefined)).toBe(false);
        }
    });

    it("lets a BEGINNER student access only BEGINNER modules", () => {
        expect(isModuleUnlocked("BEGINNER", "BEGINNER")).toBe(true);
        expect(isModuleUnlocked("INTERMEDIATE", "BEGINNER")).toBe(false);
        expect(isModuleUnlocked("ADVANCED", "BEGINNER")).toBe(false);
    });

    it("lets an INTERMEDIATE student access BEGINNER and INTERMEDIATE modules", () => {
        expect(isModuleUnlocked("BEGINNER", "INTERMEDIATE")).toBe(true);
        expect(isModuleUnlocked("INTERMEDIATE", "INTERMEDIATE")).toBe(true);
        expect(isModuleUnlocked("ADVANCED", "INTERMEDIATE")).toBe(false);
    });

    it("lets an ADVANCED student access every module", () => {
        const levels: StudentLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
        for (const moduleLevel of levels) {
            expect(isModuleUnlocked(moduleLevel, "ADVANCED")).toBe(true);
        }
    });
});

describe("curriculum data", () => {
    const validLevels: StudentLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

    it("is not empty", () => {
        expect(curriculum.length).toBeGreaterThan(0);
    });

    it("has unique module ids and unique lesson ids", () => {
        const moduleIds = curriculum.map((m) => m.id);
        const lessonIds = curriculum.flatMap((m) => m.lessons.map((l) => l.id));

        expect(new Set(moduleIds).size).toBe(moduleIds.length);
        expect(new Set(lessonIds).size).toBe(lessonIds.length);
    });

    it("only uses valid student levels", () => {
        for (const module of curriculum) {
            expect(validLevels).toContain(module.level);
        }
    });

    it("keeps every lesson pointing back to its module", () => {
        for (const module of curriculum) {
            expect(module.lessons.length).toBeGreaterThan(0);
            for (const lesson of module.lessons) {
                expect(lesson.module).toBe(module.id);
            }
        }
    });

    it("gives every lesson a title, objective and description", () => {
        for (const module of curriculum) {
            expect(module.title.trim()).not.toBe("");
            for (const lesson of module.lessons) {
                expect(lesson.title.trim()).not.toBe("");
                expect(lesson.objective.trim()).not.toBe("");
                expect(lesson.description.trim()).not.toBe("");
            }
        }
    });
});
