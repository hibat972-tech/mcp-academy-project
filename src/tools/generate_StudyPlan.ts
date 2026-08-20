import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generateStudyPlanInputSchema } from "../schemas/generate_StudyPlan.js";
import { generateStudyPlan } from "../lib/studyPlan.js";

export function registerGenerateStudyPlanTool(
  server: McpServer,
): void {
  server.registerTool(
    "generate_study_plan",
    {
      description:
        "Creates a personalized and realistic study plan using the student's existing incomplete tasks and actual remaining workload. The caller should first determine the requested date range. The planner must prioritize tasks and deadlines within the requested period regardless of whether their priority is high, medium, or low. Only after the current period's obligations have been scheduled should remaining capacity be used for future tasks. Future tasks should be selected based on priority, deadline urgency, remaining workload, and difficulty. The caller must not guess how long a task will take; when necessary information is missing, it should ask the student for the actual remaining hours and a useful study session length. The planner should use the student's real progress, avoid restarting already partially completed work, avoid arbitrary small study chunks, combine suitable easy tasks when capacity allows, schedule review only after sufficient main study has been completed, and use all reasonable available study capacity before reporting that the available time is insufficient.",

      inputSchema: generateStudyPlanInputSchema,
    },

    async ({
      startDate,
      endDate,
      dailyStudyHours,
      goal,
      unavailableDates,
      taskInfo,
      additionalInstructions,
    }) => {
      try {
        const plan = await generateStudyPlan({
          startDate,
          endDate,
          dailyStudyHours,
          goal,
          unavailableDates,
          taskInfo,
          additionalInstructions,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  ok: true,
                  plan,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        console.error(
          `generate_study_plan failed: ${(error as Error).message}`,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  ok: false,
                  error: (error as Error).message,
                },
                null,
                2,
              ),
            },
          ],
        };
      }
    },
  );
}