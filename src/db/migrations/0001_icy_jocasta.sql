CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"type" varchar NOT NULL,
	"location_type" varchar NOT NULL,
	"location" varchar,
	"description" varchar,
	"salary" integer NOT NULL,
	"company_name" varchar NOT NULL,
	"application_email" varchar,
	"application_url" varchar,
	"company_logo_url" varchar,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
