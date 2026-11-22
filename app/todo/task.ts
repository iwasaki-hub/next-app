export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodoChange =
  | { type: "save"; tasks: Task[] }
  | { type: "toggle"; id: string; completed: boolean }
  | { type: "delete"; id: string };

export const importBatchSize = 100;
