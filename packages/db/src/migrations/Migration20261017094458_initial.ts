import { Migration } from '@mikro-orm/migrations';

export class Migration20261017094458_initial extends Migration {

  override name = 'Migration20261017094458_initial';

  override up(): void | Promise<void> {
    this.addSql(`create table \`setting\` (\`key\` text not null primary key, \`value\` text not null, \`updated_at\` datetime not null);`);

    this.addSql(`create table \`user\` (\`id\` integer not null primary key autoincrement, \`github_id\` integer not null, \`login\` text not null, \`name\` text null, \`avatar_url\` text null, \`created_at\` datetime not null, \`updated_at\` datetime not null);`);
    this.addSql(`create unique index \`user_github_id_unique\` on \`user\` (\`github_id\`);`);

    this.addSql(`create table \`session\` (\`id\` text not null primary key, \`user_id\` integer not null, \`expires_at\` datetime not null, \`created_at\` datetime not null, constraint \`session_user_id_foreign\` foreign key (\`user_id\`) references \`user\` (\`id\`) on delete cascade);`);
    this.addSql(`create index \`session_user_id_index\` on \`session\` (\`user_id\`);`);
    this.addSql(`create index \`session_expires_at_index\` on \`session\` (\`expires_at\`);`);

    this.addSql(`create table \`project\` (\`id\` integer not null primary key autoincrement, \`slug\` text not null, \`title\` text not null, \`summary\` text not null, \`description\` text null, \`repo_url\` text null, \`demo_url\` text null, \`status\` text check (\`status\` in ('idea', 'in-progress', 'shipped', 'abandoned')) not null default 'idea', \`tags\` json not null, \`owner_id\` integer not null, \`hidden\` integer not null default false, \`created_at\` datetime not null, \`updated_at\` datetime not null, constraint \`project_owner_id_foreign\` foreign key (\`owner_id\`) references \`user\` (\`id\`) on delete cascade);`);
    this.addSql(`create unique index \`project_slug_unique\` on \`project\` (\`slug\`);`);
    this.addSql(`create index \`project_owner_id_index\` on \`project\` (\`owner_id\`);`);
    this.addSql(`create index \`project_updated_at_index\` on \`project\` (\`updated_at\`);`);
  }

  override down(): void | Promise<void> {

    this.addSql(`drop table if exists \`setting\`;`);
    this.addSql(`drop table if exists \`user\`;`);
    this.addSql(`drop table if exists \`session\`;`);
    this.addSql(`drop table if exists \`project\`;`);
  }

}
