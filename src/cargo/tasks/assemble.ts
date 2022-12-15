import { Task } from "cargo/mod.ts";
import { assemble, ToAssemble } from "../../assemble.ts";

export const Assemble = (toAssemble: ToAssemble<unknown>[]): Task => {
  return () => {
    if (Array.isArray(toAssemble)) {
      for (const item of toAssemble) {
        assemble(item);
      }
    }
  };
};
