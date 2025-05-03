import { pgTable, varchar, timestamp, integer, text, boolean, pgEnum } from "drizzle-orm/pg-core";

export const attributeTypeEnum = pgEnum("attribute_types", ["ip", "domain"]);

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  info: varchar("info", { length: 255 }),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Foreign key
  mitigration: varchar("mitigration", { length: 255 }),
  threat_level_id: integer("threat_level_id"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_name: varchar("user_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  user_role: varchar("user_role", { length: 50 }).notNull().default("user"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tag_name: varchar("tag_name", { length: 255 }).notNull().unique(), // Renamed for consistency
  color: varchar("color", { length: 7 }).notNull().default("#000000"), // Default color
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const objects = pgTable("objects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  object_name: varchar("object_name", { length: 255 }),
  descripton: varchar("descripton", { length: 255 }),
});

export const object_virustotal_ip = pgTable("object_virustotal_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  malicious_score: integer("malicious_score"),
  suspicious_score: integer("suspicious_score"),
  undetected_score: integer("undetected_score"),
  harmless_score: integer("harmless_score"),
  reputation: varchar("reputation", { length: 255 }),
  last_report: timestamp("last_report", { withTimezone: true }),
});

export const object_virustotal_domain = pgTable("object_virustotal_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  malicious_score: integer("malicious_score"),
  suspicious_score: integer("suspicious_score"),
  undetected_score: integer("undetected_score"),
  harmless_score: integer("harmless_score"),
});

export const object_urlvoidData_domain = pgTable("object_urlvoidData_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  detectionCounts: varchar("detectionCounts", { length: 255 }),
  lastAnalysis: varchar("lastAnalysis", { length: 255 }),
  domainRegisteration: varchar("domainRegisteration", { length: 255 }),
});

export const object_neutrinoData_domain = pgTable("object_neutrinoData_domain", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  blocklist: text("blocklist").array(),
  is_malicious: boolean("is_malicious"),
  description: varchar("description", { length: 255 })
});

export const object_ismaliciousData_domain = pgTable(
  "object_ismaliciousData_domain",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity()
      .references(() => objects.id, { onDelete: "cascade" }),
    malicious_score: integer("malicious_score"),
    suspicious_score: integer("suspicious_score"),
    undetected_score: integer("undetected_score"),
    harmless_score: integer("harmless_score"),
    ip: varchar("ip", { length: 255 }),
    datacenter: varchar("datacenter", { length: 255 }),
    network: varchar("network", { length: 255 }),
  }
);

export const object_dbip_ip = pgTable("object_dbip_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  ip_type: varchar("ip_type", { length: 255 }),
  attack_target: varchar("attack_target", { length: 255 }),
  risk_level: varchar("risk_level", { length: 255 }),
});

export const object_criminals_ip = pgTable("object_criminals_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  inbound_score: varchar("inbound_score", { length: 255 }),
  ontbound_score: varchar("ontbound_score", { length: 255 }),
  last_report: timestamp("last_report", { withTimezone: true }),
});

export const object_criminalip_domain = pgTable("object_criminalip_domain", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  score: integer("score"),
  issue: text("issue").array(), 
});

export const object_blocklist_ip = pgTable("object_blocklist_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  attack_times: integer("attack_times"),
  reported: integer("reported"),
});

export const object_abuseipdb_ip = pgTable("object_abuseipdb_ip", {
  id: integer("id")
    .primaryKey().generatedAlwaysAsIdentity()
    .references(() => objects.id, { onDelete: "cascade" }),
  ip_version: varchar("ip_version", { length: 255 }),
  confidence_score: integer("confidence_score"),
  usage_type: varchar("usage_type", { length: 255 }),
  domain: varchar("domain", { length: 255 }),
  total_reports: integer("total_reports"),
  last_report: timestamp("last_report", { withTimezone: true }),
});

export const locations = pgTable("locations", {
  id: integer("id").generatedAlwaysAsIdentity(),
  att_value: varchar("att_value", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => attributes.value, { onDelete: "cascade" }),
  country: varchar("country", { length: 255 }),
  region: varchar("region", { length: 255 }),
  city: varchar("city", { length: 255 }),
  latitude: varchar("latitude", { length: 255 }),
  longtitude: varchar("longtitude", { length: 255 }),
  isp: varchar("isp", { length: 255 }),
  asn: varchar("asn", { length: 255 }),
});

export const event_tags = pgTable("event_tags", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tag_id: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }), // Foreign key
  event_id: integer("event_id").notNull().references(() => events.id, { onDelete: "cascade" }), // Foreign key
});

export const cve_data = pgTable("cve_data", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  asset_id: integer("asset_id")
    .notNull()
    .references(() => asset_attributes.id, { onDelete: "cascade" }),
  cve_id: varchar("cve_id", { length: 255 }),
  description: varchar("description", { length: 255 }),
  cvss_score: varchar("cvss_score", { length: 255 }),
  severity: varchar("severity", { length: 255 }),
  published: timestamp("published", { withTimezone: true }),
  last_modified: timestamp("last_modified", { withTimezone: true }),
});

export const attributes = pgTable("attributes", {
  id: integer("id").generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  type: attributeTypeEnum("type").notNull(), 
  value: varchar("value", { length: 255 }).notNull().primaryKey(), 
  firstseen: timestamp("firstseen", { withTimezone: true }), 
  lastseen: timestamp("lastseen", { withTimezone: true }),
});

export const asset_attributes = pgTable("asset_attributes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  event_id: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  asset_name: varchar("asset_name", { length: 255 }),
  version: varchar("version", { length: 255 }),
  vendor: varchar("vendor", { length: 255 }),
  cpe: varchar("cpe", { length: 255 }),
  source: varchar("source", { length: 255 }),
  exp: timestamp("exp", { withTimezone: true }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

