#!/usr/bin/env node
import { Command } from "commander";
import {joinTokens} from "./utils/joinTokens.js";
import {safeInt} from "./utils/safeInt.js";
import {buildSearchUrl} from "./modules/location/buildSearchUrl.js";
import {SearchFilters} from "./types/SearchFilters.js";
import {safeFloat} from "./utils/safeFloat.js";
import {fetchListings} from "./modules/scraper/fetchListings.js";
import {fetchListing} from "./modules/scraper/fetchListing.js";
import process from 'node:process';

const program = new Command();
program.name("rightmove").description("Scrape Rightmove search results and listing details.");

const fail = (exc: unknown) => {
  console.error(exc instanceof Error ? exc.message : String(exc));
  process.exit(1);
}

program
  .command("search-url")
  .description("Build a Rightmove search URL from a postcode/outcode.")
  .argument("<postcode...>", "Postcode or outcode, e.g. 'SW1A 1AA'")
  .option("--property-type <type>", "sale or rent", "sale")
  .option("--building-type <code>", "F=flat, D=detached, S=semi, T=terraced")
  .option("--radius <miles>", "Search radius in miles", safeFloat)
  .option("--sort-by <sort>", "newest|oldest|price_low|price_high|most_reduced")
  .action(async (postcode: string[], opts) => {
    try {
      const url = await buildSearchUrl(joinTokens(postcode), {
        propertyType: opts.propertyType,
        buildingType: opts.buildingType,
        radius: opts.radius,
        sortBy: opts.sortBy,
      });
      console.log(url);
    } catch (exc) {
      fail(exc);
    }
  });

program
  .command("listings")
  .description("Fetch Rightmove listings for a postcode (URL built from filters, never taken raw).")
  .argument("<postcode...>", "Postcode or outcode, e.g. 'NG1 1AA'")
  .option("--property-type <type>", "sale or rent", "sale")
  .option("--building-type <code>", "F=flat, D=detached, S=semi, T=terraced")
  .option("--min-price <n>", "Minimum price", safeInt)
  .option("--max-price <n>", "Maximum price", safeInt)
  .option("--min-bedrooms <n>", "Minimum bedrooms", safeInt)
  .option("--max-bedrooms <n>", "Maximum bedrooms", safeInt)
  .option("--radius <miles>", "Search radius in miles", safeFloat)
  .option("--sort-by <sort>", "newest|oldest|price_low|price_high|most_reduced")
  .option("--max-pages <n>", "Pages to fetch", safeInt, 1)
  .option("--rate-limit <seconds>", "Delay between pages", safeFloat, 0.6)
  .option("--json", "Output full JSON instead of a table")
  .action(async (postcode: string[], opts) => {
    try {
      const filters: SearchFilters = {
        propertyType: opts.propertyType,
        buildingType: opts.buildingType,
        minPrice: opts.minPrice,
        maxPrice: opts.maxPrice,
        minBedrooms: opts.minBedrooms,
        maxBedrooms: opts.maxBedrooms,
        radius: opts.radius,
        sortBy: opts.sortBy,
      };
      const searchUrl = await buildSearchUrl(joinTokens(postcode), filters);
      const listings = await fetchListings(searchUrl, {
        maxPages: opts.maxPages,
        rateLimitSeconds: opts.rateLimit,
      });

      if (opts.json) {
        console.log(JSON.stringify(listings, null, 2));
        return;
      }
      console.log(`Listings (${listings.length})`);
      console.table(
        listings.slice(0, 20).map((l) => ({
          Price: l.price ?? "",
          Beds: l.bedrooms ?? "",
          Address: l.address ?? "",
        })),
      );
      if (listings.length > 20) console.log(`...and ${listings.length - 20} more`);
    } catch (exc) {
      fail(exc);
    }
  });

program
  .command("listing")
  .description("Fetch full details for an individual listing (numeric ID only).")
  .argument("<id>", "Numeric Rightmove property ID (max 12 digits)")
  .option("--json", "Output full JSON")
  .option("--include-raw", "Keep the raw PAGE_MODEL data (implies richer --json)")
  .action(async (id: string, opts) => {
    if (!/^[0-9]{1,12}$/.test(id.trim())) {
      fail(`property id must be a numeric Rightmove property ID (1-12 digits), got ${JSON.stringify(id)}`);
    }
    try {
      const detail = await fetchListing(id.trim());
      if (!opts.includeRaw) delete detail.raw;

      if (opts.json || opts.includeRaw) {
        console.log(JSON.stringify(detail, null, 2));
        return;
      }
      console.log(`Listing: ${detail.address ?? id}`);
      for (const [k, v] of Object.entries(detail)) {
        if (k === "raw" || v == null || (Array.isArray(v) && v.length === 0)) continue;
        const shown = Array.isArray(v)
          ? v.map((e) => (e !== null && typeof e === "object" ? JSON.stringify(e) : e)).join(", ")
          : v;
        console.log(`  ${k}: ${shown}`);
      }
    } catch (exc) {
      fail(exc);
    }
  });

void program.parseAsync();
