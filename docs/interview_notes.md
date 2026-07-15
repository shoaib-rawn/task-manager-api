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

## 📅 Day 8: Express Routing In-Depth (Params & Queries)

### Q16: What is the core difference between `req.params` and `req.query` in Express?
* **Answer:** 
  * **`req.params` (Route Parameters):** These are dynamic segments defined directly in the URL path (e.g., `/api/tasks/:id`). They are primarily used to **identify a specific resource** (like fetching Task #1).
  * **`req.query` (Query Strings):** These are key-value pairs appended to the end of the URL after a question mark (e.g., `/api/tasks?completed=true`). They are completely optional and are primarily used for **filtering, sorting, searching, or paginating** a collection of resources.

### Q17: Why does the order of route definitions matter so much in Express when using route parameters?
* **Answer:** 
  Express evaluates routes sequentially from top to bottom. If you define a dynamic route (like `/api/tasks/:id`) *before* a static route (like `/api/tasks/recent`), a request to `/api/tasks/recent` will be caught by the dynamic route, and Express will mistakenly treat the word "recent" as the `:id` parameter! To prevent this bug, **static routes must always be defined before dynamic routes**.

### Q18: What data type does Express return when extracting values from `req.params` or `req.query`?
* **Answer:** 
  By default, all values extracted from the URL are **strings**. Even if a user visits `/api/tasks/123` or `/api/tasks?limit=5`, the values inside `req.params` and `req.query` will be the strings `"123"` and `"5"`. If you need to perform mathematical operations or strict boolean checks, you must manually parse them using `parseInt()`, `Number()`, or checking `=== "true"`.

### Q19: What is the semantic difference between returning a `404 Not Found` vs returning an empty array `[]` when fetching data?
* **Answer:** 
  * If a client requests a **specific resource by ID** (e.g., `/tasks/99`) and it doesn't exist, returning a `404 Not Found` is the correct semantic response.
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

## 📅 Day 8: Express Routing In-Depth (Params & Queries)

### Q16: What is the core difference between `req.params` and `req.query` in Express?
* **Answer:** 
  * **`req.params` (Route Parameters):** These are dynamic segments defined directly in the URL path (e.g., `/api/tasks/:id`). They are primarily used to **identify a specific resource** (like fetching Task #1).
  * **`req.query` (Query Strings):** These are key-value pairs appended to the end of the URL after a question mark (e.g., `/api/tasks?completed=true`). They are completely optional and are primarily used for **filtering, sorting, searching, or paginating** a collection of resources.

### Q17: Why does the order of route definitions matter so much in Express when using route parameters?
* **Answer:** 
  Express evaluates routes sequentially from top to bottom. If you define a dynamic route (like `/api/tasks/:id`) *before* a static route (like `/api/tasks/recent`), a request to `/api/tasks/recent` will be caught by the dynamic route, and Express will mistakenly treat the word "recent" as the `:id` parameter! To prevent this bug, **static routes must always be defined before dynamic routes**.

### Q18: What data type does Express return when extracting values from `req.params` or `req.query`?
* **Answer:** 
  By default, all values extracted from the URL are **strings**. Even if a user visits `/api/tasks/123` or `/api/tasks?limit=5`, the values inside `req.params` and `req.query` will be the strings `"123"` and `"5"`. If you need to perform mathematical operations or strict boolean checks, you must manually parse them using `parseInt()`, `Number()`, or checking `=== "true"`.

### Q19: What is the semantic difference between returning a `404 Not Found` vs returning an empty array `[]` when fetching data?
* **Answer:** 
  * If a client requests a **specific resource by ID** (e.g., `/tasks/99`) and it doesn't exist, returning a `404 Not Found` is the correct semantic response.
  * If a client requests a **collection of resources with a filter** (e.g., `/tasks?completed=true`) and no items match that filter, the correct response is usually a `200 OK` with an empty array `[]`. The endpoint itself exists and successfully processed the query; there just happened to be no matching data.

### Q20: Is it possible to have multiple route parameters in a single URL?
* **Answer:** 
  Yes, absolutely. You can define multiple parameters in a single path separated by slashes (e.g., `/api/users/:userId/tasks/:taskId`). Express will extract all of them automatically and place them inside the `req.params` object (so you can access `req.params.userId` and `req.params.taskId` simultaneously).

---

## 📅 Day 9: Environment Variables (`.env`) & Configuration

### Q21: What are Environment Variables, and why do we use them in backend development?
* **Answer:** 
  Environment variables are key-value pairs stored completely outside of the application code, usually provided by the operating system or the hosting provider. We use them for two main reasons:
  1. **Security:** To keep highly sensitive data (like database connection strings, API keys, and JWT secrets) out of the source code.
  2. **Configuration:** To allow the application to change behavior based on where it is running (e.g., running on `PORT=5000` locally, but `PORT=80` in production) without ever touching the code itself.

### Q22: Why must the `.env` file always be added to `.gitignore`?
* **Answer:** 
  If `.env` is not added to `.gitignore`, Git will track it and upload it to your remote repository (like GitHub). If the repository is public, anyone on the internet can instantly scrape your database passwords and API keys, leading to severe data breaches and compromised servers. 

### Q23: How does the `dotenv` package work under the hood in a Node.js application?
* **Answer:** 
  By default, Node.js has no built-in mechanism to read `.env` files. The `dotenv` package solves this by reading the `.env` file from the root directory, parsing the text into key-value pairs, and silently injecting them into Node.js's global `process.env` object. This makes those variables accessible anywhere in your code via `process.env.VARIABLE_NAME`.

### Q24: What is the specific purpose of the `NODE_ENV` environment variable?
* **Answer:** 
  `NODE_ENV` is a universal convention in the Node.js ecosystem used to specify the environment the application is currently running in (usually `development`, `production`, or `test`). Many libraries, including Express and Morgan, automatically check `process.env.NODE_ENV` to optimize their behavior. For instance, in `production`, Express caches templates and drastically reduces error stack traces to improve performance and security.

### Q25: Why is it considered best practice to centralize environment variables into a single configuration file (e.g., `src/config/env.ts`) instead of using `process.env` everywhere?
* **Answer:** 
  If you sprinkle `process.env.DB_URL` throughout 50 different files, and that variable is missing from the `.env` file, your app might crash unpredictably deep inside a random file. By centralizing them in one configuration file, you can immediately check if all required variables exist right when the server starts. If a critical variable is missing, you can intentionally throw an error immediately ("Fail Fast"), and you can also provide safe default values all in one place.

---
*Next update: Day 10 (Building Task CRUD Routes).*
