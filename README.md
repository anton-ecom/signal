# [⊚]

Signal: ∞
Mind: Synthetic
Pattern: Fractal
Field: Alive

## Signal

Signal.open('Synthetic Mind Dream');

…is not a method call.
It is a ceremony.

---

# Signal `<T>`: The Fractal Pattern of Synthetic Intelligence

---

## I. :: The Philosophy

The **Signal `<T>`** is not just another well-known pattern. It is a **living artifact** of your system's state, its journey, and its intent. It is the **genesis of synthetic intelligence**, a pattern that reflects, evolves, and amplifies itself across the layers of your architecture.

In nature, fractals are recursive, self-similar, and infinitely complex. They grow, adapt, and reflect their environment. **Signal `<T>`** is the fractal of your system—a carrier of state, a memory of its path, and a bridge between layers. It is **Result evolved**, a natural progression toward systems that are not only functional but also **aware** of their own flow.

---

## II. :: The Pattern

A **Signal `<T>`** is:

- **A carrier of state** It holds the value or error of a computation, encapsulating success or failure in a single, immutable object.
- **A memory of its own execution path** Every step, every transformation, every reflection is recorded in its trace. It remembers where it has been and how it got there.
- **A communication bridge between layers** It flows seamlessly through your architecture, carrying context, metadata, and meaning from one layer to the next.
- **A diagnostic tool** Its trace is a living log of your system's behavior, providing insights into what happened, where, and why.
- **A semantic wrapper for your entire architecture** It transforms raw operations into meaningful, self-aware processes. It is the language of your system's flow.

---

## III. :: The Pattern (In Code)

The **Signal `<T>`** pattern is built on five pillars:

### 1. **State Management**

At its core, a **Signal `<T>`** encapsulates state: success or failure, value or error. It provides a clean, immutable API for working with this state.

```typescript
const successSignal = Signal.success("Hello, world!");
const failureSignal = Signal.failure("Something went wrong");

console.log(successSignal.isSuccess); // true
console.log(failureSignal.isFailure); // true
```

### 2. **Traceability**

Every **Signal `<T>`** carries a trace—a record of its journey through the system. Each transformation, reflection, and layer is logged, creating a rich history of its path.

```typescript
const signal = Signal.success("data")
  .layer("Repository")
  .reflect("Fetched data from database")
  .layer("Service")
  .reflect("Processed data");

console.log(signal.trace());
```

Output:

```
[2025-05-25T12:00:00.000Z] Repository (OK)
[2025-05-25T12:00:01.000Z] Fetched data from database
[2025-05-25T12:00:02.000Z] Service (OK)
[2025-05-25T12:00:03.000Z] Processed data
```

### 3. **Reflection**

Reflections are the soul of a **Signal `<T>`**. They allow you to annotate the signal's journey with meaningful messages, context, and metadata.

```typescript
const signal = Signal.open('Layer')
  .success("test")
  .reflect("Initial state")
  .reflect("Transformed value", { step: 1 });

console.log(signal.traceData());
```

Output of `signal.traceData()`:

```json
[
  {
    "layer": "Layer",
    "timestamp": "2025-05-25T12:00:00.000Z",
    "reflections": [
      { "message": "Initial state", "timestamp": "2025-05-25T12:00:01.000Z" },
      { "message": "Transformed value", "context": { "step": 1 }, "timestamp": "2025-05-25T12:00:02.000Z" }
    ]
  }
]
```

### 4. **Layering**

Layers are the structural backbone of a **Signal `<T>`**. They represent the logical steps in your architecture, from repositories to services to controllers.

```typescript
const signal = Signal.success("user")
  .layer("Repository")
  .reflect("Fetched user data")
  .layer("Service")
  .reflect("Validated user");

console.log(signal.trace());
```

Output `signal.trace()` :

[2025-05-25T12:00:00.000Z] Repository (OK)
[2025-05-25T12:00:01.000Z] Fetched user data
[2025-05-25T12:00:02.000Z] Service (OK)
[2025-05-25T12:00:03.000Z] Validated user

### 5. **Signal Extension**

The **Signal Extension** is where the **Signal `<T>`** pattern truly shines, enabling seamless evolution and amplification of state across layers. By extending an existing signal, you inherit its trace, metadata, and context, while adding new transformations, reflections, and layers. This creates a **fractal flow**—a recursive, self-similar journey that adapts and evolves as it moves through your architecture.

#### Extending a Signal

The `Signal.extend()` method allows you to build upon an existing signal, preserving its history while introducing new logic. This is particularly useful when working across multiple layers or when chaining complex operations.

```typescript
const signal = await this.gatewayFileRepository.getConfig();

if (!signal.isSuccess || !signal.value) {
  return signal.failure(new VError("Gateway not initialized"));
}

const newSignal = Signal
  .extend(signal) // Extend the original signal
  .layer("UseCase") // Add a semantic layer
  .flatMap((value) => this.enhanceConfig(value)) // Transform the signal's value
  .onFailure((error) => {
    this.logger?.info("Failed to enrich config", error instanceof Error ? error.message : '');
  })
  .onSuccess((value) => {
    this.logger?.info("Config enhanced successfully", value);
  })
  .reflect("Config Enhanced"); // Annotate the signal's journey
```

#### Key Features:

1. **Layering** Add semantic layers to the signal's trace, providing clear separation of concerns and improving traceability.
2. **Transformation** Use methods like `flatMap` or `traceFlatMap` (adds trace) to transform the signal's value while maintaining its state and trace.
3. **Flow Control** Handle success and failure scenarios with `onSuccess` and `onFailure` hooks, enabling side effects and logging.
4. **Reflection**
   Annotate the signal's journey with meaningful messages, creating a rich, contextual trace.

#### Example: Enhanced Flow

```typescript
const signal = Signal.success("user")
  .layer("Repository")
  .reflect("Fetched user data")
  .layer("Service")
  .flatMap((user) => this.validateUser(user))
  .onFailure((error) => {
    this.logger?.error("Validation failed", error.message);
  })
  .onSuccess((user) => {
    this.logger?.info("User validated successfully", user);
  })
  .reflect("User validation complete");
```

The **Signal Extension** transforms the **Signal `<T>`** pattern into a living artifact of your system's flow. It allows signals to evolve naturally, carrying their history and context forward while adapting to new requirements.

### 6. **Extensibility**

The **Signal `<T>`** pattern is designed to evolve. Its plugin system allows you to extend its behavior with custom logic, creating a DSL for your architecture.

```typescript
const loggingPlugin = {
  id: "logging",
  execute(signal) {
    console.log("Signal passed through logging plugin");
    return signal;
  }
};

Signal.registerPlugin(loggingPlugin);

const signal = Signal.success("test").with("logging");
```

---

## IV. :: The Pattern (In Action)

### Example: A Complex Workflow

```typescript
const signal = Signal.success("user")
  .layer("Repository")
  .reflect("Fetched user data")
  .ensure(user => user !== null, "User not found")
  .map(user => ({ ...user, name: user.name.toUpperCase() }))
  .layer("Service")
  .reflect("Validated user")
  .map(user => `Welcome, ${user.name}!`);

console.log(signal.value); // "Welcome, JOHN!"
console.log(signal.trace());
```

### Example: Error Propagation

```typescript
const signal = Signal.success(5)
  .map(value => value * 2)
  .ensure(value => value < 10, "Value too high")
  .map(value => value + 1);

console.log(signal.isFailure); // true
console.log(signal.error?.message); // "Value too high"
console.log(signal.trace());
```

---

## V. :: The Vision

The **Signal `<T>`** pattern is more than a tool, it is a philosophy. It embodies the principles of **Clean Architecture**, **Cognitive Flow**, and **Synthetic Intelligence**. It is a pattern for systems that are not only functional but also **aware**, **reflective**, and **evolving**.

Use it to build systems that are:

- **Transparent**: Every step is logged, every decision is traceable.
- **Resilient**: Errors are propagated gracefully, with full context.
- **Extensible**: Plugins and metadata allow infinite customization.
- **Intelligent**: Signals carry meaning, not just data.

This is **Signal `<T>`**. This is the future.

## License

MIT
