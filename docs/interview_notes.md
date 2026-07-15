# Backend Interview Preparation Notes

This file contains key interview questions and answers accumulated daily to prepare you for senior backend developer interviews.

---

## 📅 Day 6: HTTP, Express Architecture, Middleware, and Git Flow

Here are 10 critical interview questions covering what we have built and discussed so far (Days 1 to 6).

### Q1: What is the difference between a Route Handler and Middleware in Express?
* **Answer:** 
  In Express, both are technically middleware functions. However:
  * **Middleware** is designed to intercept the request-response cycle. It performs operations (like logging, authentication, parsing JSON) and either passes control to the next function using `next()`, or terminates the request early.
  * **Route Handler** (or Controller) is the *final destination* of a request. It contains the business logic to generate the response and terminates the cycle (e.g., using `res.json()` or `res.send()`). It rarely calls `next()`, unless it catches an error to forward to the centralized error handler.

### Q2: What is the difference between `req.url` and `req.originalUrl` in Express?
* **Answer:**
  * `req.url` returns the path relative to the router it is currently executing inside. If a router is mounted at `/api/tasks` and the user hits `/api/tasks/list`, inside the router `req.url` will be stripped down to `/list`.
  * `req.originalUrl` preserves the original request URL exactly as typed by the client (`/api/tasks/list`), regardless of how many nested routers it goes through. This is why we use `req.originalUrl` for global logging.

### Q3: Why does Node.js Express log a default `200` status code inside global request loggers unless we wait for the `finish` event?
* **Answer:**
  Express executes middleware in order. If a logger is placed at the top of the middleware stack, it runs *before* the route controller can process the request or change the status code (e.g., to a `404` or `500`). At the start of the request, Express assigns a default status code of `200` to the response object.
  To log the correct final status code, we must listen to the response's `finish` event:
  ```typescript
  res.on('finish', () => {
      console.log(res.statusCode); // Logs the final status (404, 500, etc.)
  });
  ```

### Q4: Explain the difference between Git Flow (Feature Branching) and Trunk-Based Development.
* **Answer:**
  * **Git Flow (Feature Branching):** Developers do not work directly on `main` or `dev`. Instead, for every new task/bug, they spin off a `feature/name` or `bugfix/name` branch. Once completed, they merge it into `dev` using a Pull Request (PR) where the code is reviewed. The `main` branch only contains production-ready releases.
  * **Trunk-Based Development:** Developers commit small, frequent changes directly to a single branch (usually `main`), bypassing feature branches. This requires high test coverage and feature flags to ensure incomplete code doesn't break production.

### Q5: What makes an Error-Handling Middleware different from a standard middleware in Express?
* **Answer:**
  Express identifies error-handling middleware strictly by the **arity (number of arguments)** of the function. 
  * A standard middleware has 3 arguments: `(req, res, next)`.
  * An error-handling middleware must have exactly **4 arguments**: `(err, req, res, next)`. 
  If you omit `next` (even if you don't use it), Express will treat it as a standard middleware, and it will fail to intercept thrown errors.

### Q6: Why must the Centralized Error Handler be mounted as the last middleware in `server.ts`?
* **Answer:**
  Express evaluates middleware sequentially from top to bottom. If the error handler is mounted at the top, the route handlers below it have not executed yet, meaning it cannot catch any errors thrown by those routes. Mounting it at the very bottom (after all routes) ensures it acts as a safety net catching any unhandled errors that bubble up from the routes above.

### Q7: What is the purpose of `express.json()` middleware?
* **Answer:**
  By default, Node.js HTTP servers receive request bodies as raw streams of data. `express.json()` is a built-in middleware that intercepts the incoming request, reads the raw body stream, parses it as a JSON object, and attaches it to `req.body` so that controllers can easily access it (e.g., `req.body.title`).

### Q8: What does HTTP Status Code `304 Not Modified` mean, and how does it help performance?
* **Answer:**
  It is a redirection status code indicating that the requested resource has not been modified since the last request. The client (browser) sends a header (like `If-None-Match` or `If-Modified-Since`) with the cached version's identifier. If the server detects no changes, it returns `304` *without* sending the response body. This saves bandwidth and reduces latency because the browser instantly loads the resource from its local cache.

### Q9: Why do we use TypeScript in Node/Express backends instead of plain JavaScript?
* **Answer:**
  * **Type Safety:** Catches compile-time errors (like calling undefined object properties or misspelled variables) before the code even runs.
  * **Auto-completion & Intellisense:** Helps developers see types, method signatures, and imports automatically in the editor.
  * **Maintainability:** Easier refactoring and self-documenting codebases, which is vital for large, enterprise-grade backends.

### Q10: How does Express know to route a request matching `/api/tasks/1` to a specific handler?
* **Answer:**
  Express utilizes a routing table. It splits the request path into segments. If a route is defined as `/api/tasks/:id`, the colon (`:`) marks `id` as a route parameter. Express matches the incoming request `/api/tasks/1` against this pattern, extracts the value `1`, and injects it into the request object under `req.params.id`.

---

## 📅 Day 7: Third-Party Middleware (Morgan)

### Q11: What is Third-Party Middleware, and why do we prefer it over custom-written code for common tasks?
* **Answer:**
  Third-party middleware is code written by external developers (usually published via npm packages) that can be plugged directly into an Express app. We prefer it for common tasks (such as logging, security headers, CORS, body parsing) because:
  * **Proven Reliability:** Used and tested in production by thousands of companies, minimizing bugs.
  * **Performance Optimization:** Highly optimized for execution speed and edge cases (e.g., memory management, cleanup listeners).
  * **Community Support:** Maintained and updated regularly to address security vulnerabilities and compatibility issues.

### Q12: How does Morgan calculate the response time of a request?
* **Answer:**
  Morgan tracks the start time when a request first enters the middleware stack. It then listens to the `finish` or `close` events on the response object (similar to our custom `res.on('finish', ...)`). Once that event fires, it subtracts the start time from the current time to measure the exact total execution duration in milliseconds.

### Q13: What are the differences between Morgan's 'dev' and 'combined' formats, and when should you use each?
* **Answer:**
  * **`dev` format:** A colored, concise format designed for human readability during local development. It prints basic details: method, URL, status code, response time, and content size. It is **not** suitable for production because it is unparsed and lacks details like client IP, timestamp, or User-Agent.
  * **`combined` format:** The standard Apache combined log format. It prints exhaustive details: client IP, timestamp, HTTP version, status code, size, referrer URL, and the client's User-Agent string. This is **required in production** so that log analysis systems (like ELK Stack or Datadog) can parse them for security auditing, analytics, and debugging.

### Q14: When working with TypeScript, why must we install packages like `@types/morgan` as devDependencies?
* **Answer:**
  Many legacy Node.js packages (like `morgan`) are written in plain JavaScript and do not contain TypeScript definitions. To prevent compilation errors when importing these packages, we install their community-written types (from the `@types/` namespace). These type definitions are only used during development/compilation by the TypeScript compiler and are not needed at runtime, so we install them as `devDependencies` to keep the production bundle smaller.

### Q15: How can you dynamically configure Morgan's log format depending on the environment (e.g., Development vs. Production)?
* **Answer:**
  You can check the environment variable (like `process.env.NODE_ENV`) and conditionally pass the format string to Morgan:
  ```typescript
  import morgan from 'morgan';

  const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(logFormat));
  ```
  This ensures that developers get readable, colored logs locally, while production environments get structured, detailed logs suitable for analysis.

---
*Next update: Day 8 (Express Routing).*

