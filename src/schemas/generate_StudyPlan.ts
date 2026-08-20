import * as z from "zod/v4";

export const taskStudyInfoSchema = z.object({
  taskId: z
    .number()
    .int()
    .positive()
    .describe("The numeric ID of the task"),

  remainingHours: z
    .number()
    .positive()
    .describe(
      "The number of hours still remaining for this task based on the student's actual progress",
    ),

  difficulty: z
    .enum(["easy", "medium", "hard"])
    .describe("How difficult this task is for the student"),

  preferredSessionHours: z
    .number()
    .positive()
    .describe(
      "The minimum useful number of hours the student prefers to study this task in one session",
    ),
});

export const generateStudyPlanInputSchema = z.object({
  startDate: z
    .iso.date()
    .describe("The first date of the requested study plan"),

  endDate: z
    .iso.date()
    .describe("The last date of the requested study plan"),

  dailyStudyHours: z
    .number()
    .positive()
    .max(24)
    .describe(
      "The approximate number of hours available for studying on each available day",
    ),

  goal: z
    .string()
    .min(1)
    .describe("The user's goal for this study plan"),

  unavailableDates: z
    .array(z.iso.date())
    .optional()
    .describe(
      "Dates when the student is completely unavailable for studying",
    ),

  taskInfo: z
    .array(taskStudyInfoSchema)
    .optional()
    .describe(
      "Actual remaining study information provided by the student for tasks where the system needs more information",
    ),

  additionalInstructions: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Any additional preferences or constraints for the study plan",
    ),
});