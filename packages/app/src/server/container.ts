import { cache } from "react";
import { createAppContainer, globalSingleton, loadConfig, type AppContainer } from "@atl/core";
import { entities, initOrm, registerDb } from "@atl/db";

/**
 * The DI container: config, ORM and everything packages register. The database is migrated at
 * startup by `instrumentation.ts`. Server-only — never import this from a client component.
 *
 * Keyed by the `entities` array, not a name: Next.js bundles route handlers and pages separately,
 * each with its own copy of `@atl/db`, and MikroORM matches entities by object identity. So every
 * copy gets its own container (and SQLite connection) built from the entities it will query with.
 */
export function getContainer(): Promise<AppContainer> {
  return globalSingleton(entities, async () => {
    const config = loadConfig();
    const container = createAppContainer(config);
    registerDb(container, await initOrm(config));
    return container;
  });
}

/**
 * The request's child scope: scoped registrations (like `em`) get one instance per request.
 * Memoized with React `cache`, so the session check and the page share one `em` and the entities
 * they load (passing an entity from one `em` fork to another confuses MikroORM's identity map).
 * Route handlers run outside React's request cache and get a fresh scope per call.
 */
export const requestScope = cache(async (): Promise<AppContainer> => {
  return (await getContainer()).createScope();
});
