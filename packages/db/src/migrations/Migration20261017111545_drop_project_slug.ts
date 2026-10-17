import { Migration } from '@mikro-orm/migrations';

export class Migration20261017111545_drop_project_slug extends Migration {

  override name = 'Migration20261017111545_drop_project_slug';

  override up(): void | Promise<void> {
    this.addSql(`drop index \`project_slug_unique\`;`);
    this.addSql(`alter table \`project\` drop column \`slug\`;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`project\` add column \`slug\` text not null;`);
    this.addSql(`create unique index \`project_slug_unique\` on \`project\` (\`slug\`);`);
  }

}
