import { Project, PROJECT_STATUSES, type ProjectStatus } from "./Project";
import { Session } from "./Session";
import { Setting } from "./Setting";
import { User } from "./User";

export { Project, PROJECT_STATUSES, Session, Setting, User, type ProjectStatus };

/** Every entity the ORM knows about — add new ones here. */
export const entities = [Setting, User, Session, Project];
