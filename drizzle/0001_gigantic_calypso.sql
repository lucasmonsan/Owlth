ALTER TABLE "session" ADD COLUMN "os" text;--> statement-breakpoint
CREATE INDEX "email_attempt_email_idx" ON "email_attempt" USING btree ("email");--> statement-breakpoint
CREATE INDEX "login_attempt_email_idx" ON "login_attempt" USING btree ("email");--> statement-breakpoint
CREATE INDEX "login_history_created_at_idx" ON "login_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "oauth_account_provider_idx" ON "oauth_account" USING btree ("provider","provider_id");--> statement-breakpoint
CREATE INDEX "user_app_user_id_idx" ON "user_app" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_app_app_id_idx" ON "user_app" USING btree ("app_id");