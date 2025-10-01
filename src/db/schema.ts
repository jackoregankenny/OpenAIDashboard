import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Sites table - each school gets a site
export const sites = sqliteTable('sites', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  domain: text('domain').notNull().unique(),
  logoUrl: text('logo_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Theme tokens for each site
export const themes = sqliteTable('themes', {
  id: text('id').primaryKey(),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  primaryColor: text('primary_color').notNull().default('#3b82f6'),
  secondaryColor: text('secondary_color').notNull().default('#8b5cf6'),
  accentColor: text('accent_color').notNull().default('#10b981'),
  backgroundColor: text('background_color').notNull().default('#ffffff'),
  textColor: text('text_color').notNull().default('#1f2937'),
  fontFamily: text('font_family').notNull().default('Inter'),
  headingFont: text('heading_font').notNull().default('Inter'),
  borderRadius: text('border_radius').notNull().default('0.5rem'),
  spacing: text('spacing').notNull().default('1rem'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Pages for each site
export const pages = sqliteTable('pages', {
  id: text('id').primaryKey(),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  blocks: text('blocks').notNull().default('[]'), // JSON array of blocks
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Media/assets storage
export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  siteId: text('site_id').notNull().references(() => sites.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  altText: text('alt_text'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Types for TypeScript
export type Site = typeof sites.$inferSelect;
export type NewSite = typeof sites.$inferInsert;
export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

