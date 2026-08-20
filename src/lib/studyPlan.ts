import { loadTodos } from "./todos.js";
import type { TodoRecord } from "../schemas/todoRecord.js";

type Difficulty = "easy" | "medium" | "hard";

export type TaskStudyInfo = {
  taskId: number;
  remainingHours: number;
  difficulty: Difficulty;
  preferredSessionHours: number;
};

  

export type GenerateStudyPlanOptions = {
  startDate: string;
  endDate: string;
  dailyStudyHours: number;
  goal: string;
  unavailableDates?: string[];
  taskInfo?: TaskStudyInfo[];
  additionalInstructions?: string;
};

type StudyTask = {
  id: number;
  title: string;
  priority: TodoRecord["priority"];
  deadline: string;

  remainingHours: number;
  difficulty: Difficulty;
  preferredSessionHours: number;

  dueWithinPeriod: boolean;
  isOverdue: boolean;

  reviewRequired: boolean;
  reviewHoursRemaining: number;
};

type StudySession = {
  taskId: number;
  title: string;
  type: "study" | "review";
  hours: number;
};

type DayPlan = {
  date: string;
  availableHours: number;
  scheduledHours: number;
  sessions: StudySession[];
};

const EPSILON = 0.01;

const PRIORITY_WEIGHT: Record<
  TodoRecord["priority"],
  number
> = {
  high: 3,
  medium: 2,
  low: 1,
};

function toDate(value: string): Date {
  const [year, month, day] = value
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(
  date: Date,
  days: number,
): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDatesBetween(
  startDate: string,
  endDate: string,
): string[] {
  const dates: string[] = [];

  let current = toDate(startDate);
  const end = toDate(endDate);

  while (current <= end) {
    dates.push(formatDate(current));
    current = addDays(current, 1);
  }

  return dates;
}

function getDaysUntil(
  fromDate: string,
  toDateString: string,
): number {
  const from = toDate(fromDate);
  const to = toDate(toDateString);

  return Math.floor(
    (to.getTime() - from.getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

function isWithinRange(
  date: string,
  startDate: string,
  endDate: string,
): boolean {
  return (
    date >= startDate &&
    date <= endDate
  );
}

function getTaskInfo(
  taskId: number,
  taskInfo: TaskStudyInfo[],
): TaskStudyInfo | undefined {
  return taskInfo.find(
    (info) => info.taskId === taskId,
  );
}

function getRemainingCapacity(
  day: DayPlan,
): number {
  return Number(
    (
      day.availableHours -
      day.scheduledHours
    ).toFixed(2),
  );
}

function addSession(
  day: DayPlan,
  session: StudySession,
): boolean {
  const capacity = getRemainingCapacity(day);

  if (
    session.hours <= 0 ||
    session.hours > capacity + EPSILON
  ) {
    return false;
  }

  day.sessions.push({
    ...session,
    hours: Number(
      session.hours.toFixed(2),
    ),
  });

  day.scheduledHours = Number(
    (
      day.scheduledHours +
      session.hours
    ).toFixed(2),
  );

  return true;
}

function createDayPlans(
  startDate: string,
  endDate: string,
  dailyStudyHours: number,
  unavailableDates: string[],
): DayPlan[] {
  const unavailable = new Set(
    unavailableDates,
  );

  return getDatesBetween(
    startDate,
    endDate,
  ).map((date) => ({
    date,
    availableHours: unavailable.has(date)
      ? 0
      : dailyStudyHours,
    scheduledHours: 0,
    sessions: [],
  }));
}

function calculateReviewHours(
  task: StudyTask,
): number {
  if (task.remainingHours <= 2) {
    return 0.5;
  }

  if (task.remainingHours <= 5) {
    return 1;
  }

  if (task.remainingHours <= 10) {
    return 1.5;
  }

  return 2;
}

/*
 * Main rule:
 *
 * 1. Tasks due inside the requested period always come first.
 * 2. Among those tasks:
 *    overdue -> closest deadline -> priority.
 * 3. Review is NOT scheduled before enough main study is completed.
 * 4. After current-period tasks are handled,
 *    remaining capacity goes to future tasks.
 * 5. Future tasks are ranked by:
 *    priority + deadline pressure + workload pressure.
 */
function compareTasks(
  a: StudyTask,
  b: StudyTask,
  currentDate: string,
): number {
  // Current requested period always has priority.
  if (
    a.dueWithinPeriod !==
    b.dueWithinPeriod
  ) {
    return a.dueWithinPeriod ? -1 : 1;
  }

  // Overdue tasks first, but only while
  // they still have remaining work.
  if (
    a.isOverdue !== b.isOverdue
  ) {
    return a.isOverdue ? -1 : 1;
  }

  const aDaysUntil =
    getDaysUntil(
      currentDate,
      a.deadline,
    );

  const bDaysUntil =
    getDaysUntil(
      currentDate,
      b.deadline,
    );

  // Deadline urgency inside the same category.
  if (aDaysUntil !== bDaysUntil) {
    return aDaysUntil - bDaysUntil;
  }

  // Higher priority next.
  const priorityDifference =
    PRIORITY_WEIGHT[b.priority] -
    PRIORITY_WEIGHT[a.priority];

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  // Larger remaining workload gets earlier attention.
  return (
    b.remainingHours -
    a.remainingHours
  );
}

/*
 * Determines whether a future task should start now.
 *
 * Example:
 * - Exam is 3 weeks away
 * - 30 hours remain
 * - User has limited daily capacity
 *
 * The task should start now instead of waiting
 * until the deadline becomes very close.
 */
function getFutureTaskPressure(
  task: StudyTask,
  currentDate: string,
): number {
  const daysUntilDeadline =
    Math.max(
      1,
      getDaysUntil(
        currentDate,
        task.deadline,
      ),
    );

  const workloadPerDay =
    task.remainingHours /
    daysUntilDeadline;

  const priorityScore =
    PRIORITY_WEIGHT[task.priority] * 10;

  const deadlineScore =
    100 / daysUntilDeadline;

  const workloadScore =
    workloadPerDay * 20;

  const difficultyScore =
    task.difficulty === "hard"
      ? 5
      : task.difficulty === "medium"
        ? 3
        : 1;

  return (
    priorityScore +
    deadlineScore +
    workloadScore +
    difficultyScore
  );
}

function getBestTaskForDay(
  tasks: StudyTask[],
  currentDate: string,
): StudyTask | undefined {
  const available = tasks.filter(
    (task) =>
      task.remainingHours > EPSILON &&
      currentDate < task.deadline,
  );

  if (available.length === 0) {
    return undefined;
  }

  const currentPeriodTasks =
    available.filter(
      (task) => task.dueWithinPeriod,
    );

  // Absolutely prioritize obligations
  // inside the requested period.
  if (currentPeriodTasks.length > 0) {
    return [...currentPeriodTasks].sort(
      (a, b) =>
        compareTasks(
          a,
          b,
          currentDate,
        ),
    )[0];
  }

  // If the current period is covered,
  // intelligently start future tasks.
  return [...available].sort(
    (a, b) =>
      getFutureTaskPressure(
        b,
        currentDate,
      ) -
      getFutureTaskPressure(
        a,
        currentDate,
      ),
  )[0];
}

function canFitUsefulSession(
  task: StudyTask,
  capacity: number,
): boolean {
  if (
    task.remainingHours <= capacity +
      EPSILON
  ) {
    return true;
  }

  return (
    capacity + EPSILON >=
    task.preferredSessionHours
  );
}

function getSessionHours(
  task: StudyTask,
  capacity: number,
): number {
  // If the task can be finished today,
  // finish it.
  if (
    task.remainingHours <=
    capacity + EPSILON
  ) {
    return task.remainingHours;
  }

  /*
   * Never automatically split into random
   * 1h / 1.5h / 2h chunks.
   *
   * Use the student's preferred useful block.
   */
  const preferred =
    task.preferredSessionHours;

  if (capacity >= preferred) {
    return Math.min(
      preferred,
      task.remainingHours,
    );
  }

  return 0;
}

function scheduleMainStudy(
  dayPlans: DayPlan[],
  tasks: StudyTask[],
): void {
  for (const day of dayPlans) {
    let attempts = 0;

    while (
      getRemainingCapacity(day) >= 0.25 &&
      attempts < 100
    ) {
      attempts += 1;

      const capacity =
        getRemainingCapacity(day);

      const candidates = tasks
        .filter(
          (task) =>
            task.remainingHours >
              EPSILON &&
            day.date < task.deadline &&
            canFitUsefulSession(
              task,
              capacity,
            ),
        )
        .sort((a, b) => {
          if (
            a.dueWithinPeriod !==
            b.dueWithinPeriod
          ) {
            return a.dueWithinPeriod
              ? -1
              : 1;
          }

          if (
            a.dueWithinPeriod &&
            b.dueWithinPeriod
          ) {
            return compareTasks(
              a,
              b,
              day.date,
            );
          }

          return (
            getFutureTaskPressure(
              b,
              day.date,
            ) -
            getFutureTaskPressure(
              a,
              day.date,
            )
          );
        });

      if (candidates.length === 0) {
        break;
      }

      const task = candidates[0];

      const hours = getSessionHours(
        task,
        capacity,
      );

      if (hours <= EPSILON) {
        break;
      }

      const added = addSession(day, {
        taskId: task.id,
        title: task.title,
        type: "study",
        hours,
      });

      if (!added) {
        break;
      }

      task.remainingHours = Number(
        (
          task.remainingHours -
          hours
        ).toFixed(2),
      );
    }
  }
}

/*
 * Review rule:
 *
 * Review is scheduled only after the main study
 * for that task has been completed.
 *
 * Review must happen before the deadline,
 * preferably on the previous available day.
 */
function scheduleReviews(
  dayPlans: DayPlan[],
  tasks: StudyTask[],
  warnings: string[],
): void {
  for (const task of tasks) {
    if (!task.dueWithinPeriod) {
      continue;
    }

    if (
      task.remainingHours > EPSILON
    ) {
      continue;
    }

    if (!task.reviewRequired) {
      continue;
    }

    const deadlineIndex =
      dayPlans.findIndex(
        (day) =>
          day.date === task.deadline,
      );

    if (deadlineIndex <= 0) {
      continue;
    }

    let remainingReview =
      task.reviewHoursRemaining;

    // Start with the day immediately before
    // the deadline, then move backwards.
    for (
      let index = deadlineIndex - 1;
      index >= 0 &&
      remainingReview > EPSILON;
      index--
    ) {
      const day = dayPlans[index];

      const capacity =
        getRemainingCapacity(day);

      if (capacity <= EPSILON) {
        continue;
      }

      const hours = Math.min(
        capacity,
        remainingReview,
      );

      const added = addSession(day, {
        taskId: task.id,
        title: task.title,
        type: "review",
        hours,
      });

      if (added) {
        remainingReview = Number(
          (
            remainingReview -
            hours
          ).toFixed(2),
        );
      }
    }

    task.reviewHoursRemaining =
      remainingReview;

    if (
      remainingReview > EPSILON
    ) {
      warnings.push(
        `Not enough capacity to schedule the full review for "${task.title}" before its deadline.`,
      );
    }
  }
}

function validatePlan(
  dayPlans: DayPlan[],
  tasks: StudyTask[],
): string[] {
  const warnings: string[] = [];

  for (const day of dayPlans) {
    if (
      day.scheduledHours >
      day.availableHours + EPSILON
    ) {
      warnings.push(
        `Plan error: ${day.date} exceeds the available study time.`,
      );
    }

    for (const session of day.sessions) {
      const task = tasks.find(
        (item) =>
          item.id === session.taskId,
      );

      if (
        task &&
        day.date >= task.deadline
      ) {
        warnings.push(
          `Plan error: "${task.title}" was scheduled on or after its deadline.`,
        );
      }
    }
  }

  return warnings;
}

export async function generateStudyPlan(
  options: GenerateStudyPlanOptions,
) {
  const {
    startDate,
    endDate,
    dailyStudyHours,
    unavailableDates = [],
    taskInfo = [],
    additionalInstructions,
  } = options;

  if (toDate(startDate) > toDate(endDate)) {
    throw new Error(
      "startDate must be before or equal to endDate.",
    );
  }

  if (
    !Number.isFinite(dailyStudyHours) ||
    dailyStudyHours <= 0 ||
    dailyStudyHours > 24
  ) {
    throw new Error(
      "dailyStudyHours must be greater than zero and at most 24.",
    );
  }

  const todos = await loadTodos();

  const openTasks = todos.filter(
    (task) =>
      task.status === "open",
  );

  if (openTasks.length === 0) {
    return {
      needsMoreInformation: false,
      period: {
        startDate,
        endDate,
      },
      dailyStudyHours,
      days: [],
      unfinishedTasks: [],
      warnings: [
        "There are no open tasks to include in the study plan.",
      ],
    };
  }

  /*
   * We do not need information for every
   * task in the database blindly.
   *
   * We first ask for:
   * 1. tasks due during the requested period
   * 2. overdue tasks
   *
   * Future tasks can be considered only if
   * there is remaining capacity.
   */
  const immediateTasks =
    openTasks.filter(
      (task) =>
        task.deadline <= endDate,
    );

  const missingImmediateInfo =
    immediateTasks
      .filter(
        (task) =>
          !getTaskInfo(
            task.id,
            taskInfo,
          ),
      )
      .map((task) => ({
        taskId: task.id,
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
      }));

  if (
    missingImmediateInfo.length > 0
  ) {
    return {
      needsMoreInformation: true,

      missingTaskInfo:
        missingImmediateInfo,

      message:
        "Before creating a reliable plan, ask the user how many study/work hours remain and what a useful study session length is for each required task. Do not guess.",
    };
  }

  /*
   * Future tasks without information are
   * not silently guessed.
   *
   * If they become necessary to fill the
   * requested period, the caller should ask
   * for their information and run the tool again.
   */
  const knownTasks = openTasks.filter(
    (task) =>
      getTaskInfo(
        task.id,
        taskInfo,
      ),
  );

  const studyTasks: StudyTask[] =
    knownTasks.map((task) => {
      const info = getTaskInfo(
        task.id,
        taskInfo,
      );

      if (!info) {
        throw new Error(
          `Missing study information for "${task.title}".`,
        );
      }

      const dueWithinPeriod =
        isWithinRange(
          task.deadline,
          startDate,
          endDate,
        );

      const isOverdue =
        task.deadline < startDate;

      const temporaryTask: StudyTask = {
        id: task.id,
        title: task.title,
        priority: task.priority,
        deadline: task.deadline,

        // IMPORTANT:
        // This means remaining hours NOW,
        // not total hours from the beginning.
        remainingHours:
          info.remainingHours,

        difficulty:
          info.difficulty,

        preferredSessionHours:
          info.preferredSessionHours,

        dueWithinPeriod,
        isOverdue,

        reviewRequired: false,
        reviewHoursRemaining: 0,
      };

      /*
       * Review is required only for tasks
       * inside the requested period.
       *
       * It will only be scheduled after
       * the main work is completed.
       */
      if (
        dueWithinPeriod &&
        !isOverdue
      ) {
        temporaryTask.reviewRequired =
          true;

        temporaryTask.reviewHoursRemaining =
          calculateReviewHours(
            temporaryTask,
          );
      }

      return temporaryTask;
    });

  const dayPlans = createDayPlans(
    startDate,
    endDate,
    dailyStudyHours,
    unavailableDates,
  );

  const warnings: string[] = [];

  /*
   * PHASE 1:
   *
   * Fill the period with actual work.
   *
   * Tasks inside this period always come first.
   *
   * Only after those tasks are covered can
   * future tasks consume remaining capacity.
   */
  scheduleMainStudy(
    dayPlans,
    studyTasks,
  );

  /*
   * PHASE 2:
   *
   * Schedule review only after the main
   * study is completed.
   */
  scheduleReviews(
    dayPlans,
    studyTasks,
    warnings,
  );

  /*
   * If review was added and displaced
   * capacity, try to use any remaining
   * capacity again for future tasks.
   */
  scheduleMainStudy(
    dayPlans,
    studyTasks,
  );

  const unfinishedTasks =
    studyTasks
      .filter(
        (task) =>
          task.remainingHours >
            EPSILON ||
          task.reviewHoursRemaining >
            EPSILON,
      )
      .map((task) => ({
        taskId: task.id,
        title: task.title,
        priority: task.priority,
        deadline: task.deadline,
        remainingStudyHours:
          task.remainingHours,
        remainingReviewHours:
          task.reviewHoursRemaining,
      }));

  /*
   * Important:
   *
   * We only say that time is insufficient
   * after all available days have been used.
   */
  const allCapacityUsed =
    dayPlans.every(
      (day) =>
        getRemainingCapacity(day) <
        0.25,
    );

  const unfinishedRequiredTasks =
    studyTasks.filter(
      (task) =>
        task.dueWithinPeriod &&
        (task.remainingHours > EPSILON ||
          task.reviewHoursRemaining >
            EPSILON),
    );

  if (
    unfinishedRequiredTasks.length > 0
  ) {
    warnings.push(
      "The requested period does not contain enough available study time to complete all tasks due within that period. The plan used all possible capacity before reporting this shortage.",
    );
  }

  const futureTasksWithNoInfo =
    openTasks
      .filter(
        (task) =>
          task.deadline > endDate &&
          !getTaskInfo(
            task.id,
            taskInfo,
          ),
      )
      .map((task) => ({
        taskId: task.id,
        title: task.title,
        deadline: task.deadline,
        priority: task.priority,
      }));

  const freeHours = dayPlans.reduce(
    (total, day) =>
      total +
      getRemainingCapacity(day),
    0,
  );

  if (
    freeHours >= 0.25 &&
    futureTasksWithNoInfo.length > 0
  ) {
    warnings.push(
      "There is still free time in the requested period, but some future tasks have no remaining-hours information. Ask the user for the remaining workload of the most relevant future tasks instead of guessing.",
    );
  }

  warnings.push(
    ...validatePlan(
      dayPlans,
      studyTasks,
    ),
  );

  return {
    needsMoreInformation: false,

    period: {
      startDate,
      endDate,
    },

    dailyStudyHours,

    additionalInstructions,

    days: dayPlans.map((day) => ({
      date: day.date,

      availableHours:
        day.availableHours,

      scheduledHours:
        day.scheduledHours,

      freeHours: Number(
        getRemainingCapacity(day).toFixed(
          2,
        ),
      ),

      sessions: day.sessions,
    })),

    unfinishedTasks,

    allCapacityUsed,

    warnings,
  };
}