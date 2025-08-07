CREATE INDEX "search_index" ON "jobs" USING gin ((
          setweight(to_tsvector('english', "title"), 'A') ||
          setweight(to_tsvector('english', "company_name"), 'B') ||
          setweight(to_tsvector('english', "type"), 'C') ||
          setweight(to_tsvector('english', "location_type"), 'D')
      ));