const registry: ItemToAssemble[] = [];

type ItemToAssemble = ToAssemble<unknown> & {
  type: Injectable;
  value?: unknown;
};

type Newable<T> = {
  new (...args: any[]): T;
};

type Callable<T> = (...args: any[]) => T;

type Injectable =
  | string
  | Newable<unknown>
  | Callable<unknown>;

interface ClassToAssemble<T> {
  class: Newable<T>;
  dependencies?: Injectable[];
}

interface ValueToAssemble<T> {
  token: string;
  value: T;
}

interface FunctionToAssemble<T> {
  function: Callable<T>;
  dependencies?: Injectable[];
}

export type ToAssemble<T> =
  | ClassToAssemble<T>
  | FunctionToAssemble<T>
  | ValueToAssemble<T>;

export function assemble<T>(toAssemble: ToAssemble<T>) {
  if ("class" in toAssemble) {
    registry.push({
      type: toAssemble.class,
      ...toAssemble,
    });
  }
  if ("token" in toAssemble) {
    registry.push({
      type: toAssemble.token,
      ...toAssemble,
    });
  }
  if ("function" in toAssemble) {
    registry.push({
      type: toAssemble.function,
      ...toAssemble,
    });
  }
}

export function get<T>(token: Injectable): T {
  const injectable = registry.find((item) => {
    return item.type === token;
  });

  const errMsg =
    `Provided token: "${token.toString()}" is not registered for dependency injection`;

  if (!injectable) {
    throw new Error(errMsg);
  }

  if ("class" in injectable) {
    const deps: unknown[] = injectable.dependencies?.map((toInject) =>
      get(toInject)
    ) ?? [];
    return <T> new injectable.class(...deps);
  }

  if ("function" in injectable) {
    const deps: unknown[] = injectable.dependencies?.map((toInject) => {
      return get(toInject);
    }) ?? [];

    return <T> injectable.function(...deps);
  }

  if ("token" in injectable) {
    return <T> injectable.value;
  }

  throw new Error(errMsg);
}
