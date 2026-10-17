import type { AppContainer } from "@atl/core";
import type { EntityManager } from "@mikro-orm/sqlite";
import { asFunction, asValue } from "awilix";
import type { Orm } from "./orm";
import { createProjectService, type ProjectService } from "./services/projects";
import { createSessionService, type SessionService } from "./services/sessions";

declare module "@atl/core" {
  interface Cradle {
    orm: Orm;
    /** A fresh EntityManager fork per container scope (i.e. per request). */
    em: EntityManager;
    sessions: SessionService;
    projects: ProjectService;
  }
}

export function registerDb(container: AppContainer, orm: Orm): void {
  container.register({
    orm: asValue(orm),
    em: asFunction(({ orm }: { orm: Orm }) => orm.em.fork()).scoped(),
    sessions: asFunction(createSessionService).scoped(),
    projects: asFunction(createProjectService).scoped(),
  });
}
