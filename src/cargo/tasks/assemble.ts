import { Task } from "cargo/mod.ts";
import { assemble, ToAssemble } from "../../assemble.ts";

export const Assemble: Task = (toAssemble: ToAssemble<unknown>[]) => {
  return () => {
    if (Array.isArray(toAssemble)) {
      for (const item of toAssemble) {
        assemble(item);
      }
    }
  };
};
