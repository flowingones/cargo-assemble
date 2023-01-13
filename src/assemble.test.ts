import { assemble, get } from "./mod.ts";
import { assertEquals } from "std/testing/asserts.ts";

Deno.test(`should return a expected value`, () => {
  assemble({
    token: "hello",
    value: "world",
  });

  assertEquals(get("hello"), "world");
});

Deno.test("should return valid class instance", () => {
  class Hello {
    say() {
      return "world";
    }
  }
  assemble({
    class: Hello,
  });

  assertEquals((get<Hello>(Hello)).say(), "world");
});

Deno.test("should return valid class instance with deps", () => {
  assemble({ token: "value", value: "univers" });

  class Hello2 {
    constructor(private readonly value: string) {
    }
    say() {
      return this.value;
    }
  }
  assemble({
    class: Hello2,
    dependencies: ["value"],
  });

  assertEquals((get<Hello2>(Hello2)).say(), "univers");
});

Deno.test("should return valid class instance with nested deps", () => {
  assemble({
    token: "newValue",
    value: "galaxy",
  });
  class HelloService {
    constructor(private readonly value: string) {
    }
    say() {
      return this.value;
    }
  }

  assemble({ class: HelloService, dependencies: ["newValue"] });

  class Hello3 {
    constructor(private readonly helloService: HelloService) {
    }
    say() {
      return this.helloService.say();
    }
  }
  assemble({
    class: Hello3,
    dependencies: [HelloService],
  });

  assertEquals((get<Hello3>(Hello3)).say(), "galaxy");
});

Deno.test("should return function result based on deps", () => {
  assemble({
    token: "hey",
    value: "ho",
  });

  function say(hello: string) {
    return hello;
  }

  assemble({ function: say, dependencies: ["hey"] });

  assertEquals(get<string>(say), "ho");
});
