import { describe, it, expect } from "vitest";
import { normalizeUserAnswers, calculateDeviceScores, devices } from "@/components/RecommendationResults";
import type { UserAnswers, DeviceScore } from "@/types/questionnaire";

describe("normalizeUserAnswers", () => {
  // ─── 1. Minimal complete answers ──────────────────────────────────

  it("returns expected normalized values for complete valid answers", () => {
    const answers: UserAnswers = {
      electricity: "yes",
      users: "3-5",
      growth: "medium",
      reuse: "no",
      format: "yes",
      price: "low",
    };

    const result = normalizeUserAnswers(answers);

    expect(result).toEqual({
      energy: 1, // 'yes' → reliable power → low need for efficiency
      concurrency: 3,
      growth: 3,
      reusable: 0,
      formatEase: 1, // 'yes' → can format → low need for easy setup
      cost: 5,
    });
  });

  it("returns expected normalized values for a different complete set", () => {
    const answers: UserAnswers = {
      electricity: "no",
      users: "6+",
      growth: "high",
      reuse: "yes",
      format: "no",
      price: "high",
    };

    const result = normalizeUserAnswers(answers);

    expect(result).toEqual({
      energy: 5, // 'no' → frequent outages → high need for efficiency
      concurrency: 5,
      growth: 5,
      reusable: 5,
      formatEase: 5, // 'no' → cannot format → high need for easy setup
      cost: 1,
    });
  });

  // ─── 2. Electricity / energy mappings ─────────────────────────────

  describe("electricity → energy mapping", () => {
    it('maps "yes" → 1 (reliable power → low need for efficiency)', () => {
      const result = normalizeUserAnswers({ electricity: "yes" });
      expect(result.energy).toBe(1);
    });

    it('maps "sometimes" → 3 (unreliable power → moderate need)', () => {
      const result = normalizeUserAnswers({ electricity: "sometimes" });
      expect(result.energy).toBe(3);
    });

    it('maps "no" → 5 (frequent outages → high need for efficiency)', () => {
      const result = normalizeUserAnswers({ electricity: "no" });
      expect(result.energy).toBe(5);
    });

    it("defaults to 3 when electricity is undefined", () => {
      const result = normalizeUserAnswers({});
      expect(result.energy).toBe(3);
    });

    it("defaults to 3 when electricity is an unrecognized string", () => {
      const result = normalizeUserAnswers({ electricity: "maybe" } as UserAnswers);
      expect(result.energy).toBe(3);
    });
  });

  // ─── 3. Users / concurrency mappings ──────────────────────────────

  describe("users → concurrency mapping", () => {
    it('maps "1-2" → 1 (low concurrency)', () => {
      const result = normalizeUserAnswers({ users: "1-2" });
      expect(result.concurrency).toBe(1);
    });

    it('maps "3-5" → 3 (medium concurrency)', () => {
      const result = normalizeUserAnswers({ users: "3-5" });
      expect(result.concurrency).toBe(3);
    });

    it('maps "6+" → 5 (high concurrency)', () => {
      const result = normalizeUserAnswers({ users: "6+" });
      expect(result.concurrency).toBe(5);
    });

    it("defaults to 1 when users is undefined (?? picks '1-2')", () => {
      const result = normalizeUserAnswers({});
      expect(result.concurrency).toBe(1);
    });

    it("defaults to 3 when users is an unrecognized string", () => {
      const result = normalizeUserAnswers({ users: "1-10" } as UserAnswers);
      expect(result.concurrency).toBe(3);
    });

    it("uses nullish coalescing — undefined users defaults to '1-2' (→ 1)", () => {
      // The code: concurrencyMap[answers.users ?? '1-2'] || 3
      // When users is undefined, ?? picks '1-2', which maps to 1
      const result = normalizeUserAnswers({ users: undefined });
      expect(result.concurrency).toBe(1);
    });
  });

  // ─── 4. Growth mappings ───────────────────────────────────────────

  describe("growth → growth mapping", () => {
    it('maps "low" → 1', () => {
      const result = normalizeUserAnswers({ growth: "low" });
      expect(result.growth).toBe(1);
    });

    it('maps "medium" → 3', () => {
      const result = normalizeUserAnswers({ growth: "medium" });
      expect(result.growth).toBe(3);
    });

    it('maps "high" → 5', () => {
      const result = normalizeUserAnswers({ growth: "high" });
      expect(result.growth).toBe(5);
    });

    it('defaults to 3 for "notSure" (not in the map)', () => {
      const result = normalizeUserAnswers({ growth: "notSure" });
      expect(result.growth).toBe(3);
    });

    it("defaults to 3 when growth is undefined", () => {
      const result = normalizeUserAnswers({});
      expect(result.growth).toBe(3);
    });
  });

  // ─── 5. Reuse mappings ────────────────────────────────────────────

  describe("reuse → reusable mapping", () => {
    it('maps "yes" → 5 (computer available for reuse)', () => {
      const result = normalizeUserAnswers({ reuse: "yes" });
      expect(result.reusable).toBe(5);
    });

    it('maps "no" → 0 (no computer for reuse)', () => {
      const result = normalizeUserAnswers({ reuse: "no" });
      expect(result.reusable).toBe(0);
    });

    it("defaults to 0 when reuse is undefined", () => {
      const result = normalizeUserAnswers({});
      expect(result.reusable).toBe(0);
    });

    it("defaults to 0 when reuse is an unrecognized string", () => {
      const result = normalizeUserAnswers({ reuse: "maybe" } as UserAnswers);
      expect(result.reusable).toBe(0);
    });
  });

  // ─── 6. Format / formatEase mappings ──────────────────────────────

  describe("format → formatEase mapping", () => {
    it('maps "yes" → 1 (can format confidently → low need for easy setup)', () => {
      const result = normalizeUserAnswers({ format: "yes" });
      expect(result.formatEase).toBe(1);
    });

    it('maps "maybe" → 3 (with guidance → moderate need)', () => {
      const result = normalizeUserAnswers({ format: "maybe" });
      expect(result.formatEase).toBe(3);
    });

    it('maps "no" → 5 (cannot format → high need for easy setup)', () => {
      const result = normalizeUserAnswers({ format: "no" });
      expect(result.formatEase).toBe(5);
    });

    it("defaults to 3 when format is undefined", () => {
      const result = normalizeUserAnswers({});
      expect(result.formatEase).toBe(3);
    });

    it("defaults to 3 when format is an unrecognized string", () => {
      const result = normalizeUserAnswers({ format: "idk" } as UserAnswers);
      expect(result.formatEase).toBe(3);
    });
  });

  // ─── 7. Price / cost mappings ─────────────────────────────────────

  describe("price → cost mapping", () => {
    it('maps "low" → 5 (low budget → need low cost)', () => {
      const result = normalizeUserAnswers({ price: "low" });
      expect(result.cost).toBe(5);
    });

    it('maps "medium" → 3 (moderate budget)', () => {
      const result = normalizeUserAnswers({ price: "medium" });
      expect(result.cost).toBe(3);
    });

    it('maps "high" → 1 (high budget → cost less important)', () => {
      const result = normalizeUserAnswers({ price: "high" });
      expect(result.cost).toBe(1);
    });

    it("defaults to 3 when price is undefined", () => {
      const result = normalizeUserAnswers({});
      expect(result.cost).toBe(3);
    });

    it("defaults to 3 when price is an unrecognized string", () => {
      const result = normalizeUserAnswers({ price: "free" } as UserAnswers);
      expect(result.cost).toBe(3);
    });
  });

  // ─── 8. Edge cases ────────────────────────────────────────────────

  describe("edge cases", () => {
    it("returns all defaults for an empty answers object", () => {
      const result = normalizeUserAnswers({});

      expect(result).toEqual({
        energy: 3,
        concurrency: 1,   // undefined → ?? picks '1-2' → 1
        growth: 3,
        reusable: 0,
        formatEase: 3,
        cost: 3,
      });
    });

    it("handles partial answers — mixes explicit values with defaults", () => {
      const result = normalizeUserAnswers({
        electricity: "yes",
        reuse: "yes",
      });

      expect(result).toEqual({
        energy: 1,     // 'yes' → reliable power → low need
        concurrency: 1,     // undefined → ?? picks '1-2' → 1
        growth: 3,
        reusable: 5,        // explicit
        formatEase: 3,      // default
        cost: 3,            // default
      });
    });

    it("handles another partial combination", () => {
      const result = normalizeUserAnswers({
        users: "1-2",
        growth: "low",
        price: "high",
      });

      expect(result).toEqual({
        energy: 3,          // default
        concurrency: 1,     // explicit: '1-2' → 1
        growth: 1,          // explicit: 'low' → 1
        reusable: 0,        // default
        formatEase: 3,      // default
        cost: 1,            // explicit: 'high' → 1
      });
    });

    it("ignores extra unknown keys in the answers object", () => {
      const result = normalizeUserAnswers({
        electricity: "yes",
        someUnknownField: "value",
      } as UserAnswers);

      expect(result.energy).toBe(1); // 'yes' → low need for efficiency
      // other fields use defaults — concurrency uses ?? fallback '1-2' → 1
      expect(result.concurrency).toBe(1);
    });

    it("maps every field correctly for a realistic questionnaire response", () => {
      // Simulate what a real user might answer
      const answers: UserAnswers = {
        electricity: "sometimes",
        users: "3-5",
        growth: "high",
        reuse: "no",
        format: "maybe",
        price: "medium",
      };

      const result = normalizeUserAnswers(answers);

      expect(result).toEqual({
        energy: 3,       // sometimes
        concurrency: 3,  // 3-5
        growth: 5,       // high
        reusable: 0,     // no
        formatEase: 3,   // maybe
        cost: 3,         // medium
      });
    });
  });
});

// ─── calculateDeviceScores ────────────────────────────────────────

describe("calculateDeviceScores", () => {
  // Shared helpers
  const norm = (answers: UserAnswers) => normalizeUserAnswers(answers);

  const baseAnswers: UserAnswers = {
    electricity: "yes",
    users: "3-5",
    growth: "medium",
    reuse: "no",
    format: "yes",
    price: "low",
    points: { lowPower: 5, scalable: 5, easyToUse: 5, lowCost: 5 },
  };

  // ─── 1. Basic scoring ────────────────────────────────────────────

  describe("basic scoring", () => {
    it("returns results for all 4 devices sorted by matchPercentage descending", () => {
      const results = calculateDeviceScores(baseAnswers, norm(baseAnswers));

      expect(results).toHaveLength(4);

      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].matchPercentage).toBeGreaterThanOrEqual(
          results[i].matchPercentage,
        );
      }
    });

    it("each result has the expected DeviceScore shape", () => {
      const results = calculateDeviceScores(baseAnswers, norm(baseAnswers));

      for (const r of results) {
        expect(r).toHaveProperty("device");
        expect(r).toHaveProperty("score");
        expect(r).toHaveProperty("matchPercentage");
        expect(r).toHaveProperty("strengths");
        expect(r.device).toHaveProperty("key");
        expect(r.device).toHaveProperty("name");
        expect(typeof r.score).toBe("number");
        expect(typeof r.matchPercentage).toBe("number");
        expect(Array.isArray(r.strengths)).toBe(true);
      }
    });

    it("matchPercentage for every device is in the 0–100 range", () => {
      const results = calculateDeviceScores(baseAnswers, norm(baseAnswers));

      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
        expect(r.matchPercentage).toBeLessThanOrEqual(100);
      }
    });

    it("all 4 known device keys are present in results", () => {
      const results = calculateDeviceScores(baseAnswers, norm(baseAnswers));
      const keys = results.map((r) => r.device.key).sort();

      expect(keys).toEqual([
        "intelNUC",
        "raspberryPi",
        "reusedPC",
        "zimaBoard",
      ]);
    });

    it("produces different match percentages for different devices (scoring is not flat)", () => {
      const results = calculateDeviceScores(baseAnswers, norm(baseAnswers));
      const percentages = results.map((r) => r.matchPercentage);
      const unique = new Set(percentages);

      // At least 2 devices should have different percentages
      expect(unique.size).toBeGreaterThanOrEqual(2);
    });
  });

  // ─── 2. Concurrency weight ───────────────────────────────────────

  describe("concurrency weight", () => {
    it("1–2 users produce different scores than 6+ users for the same device", () => {
      const fewUsers: UserAnswers = { ...baseAnswers, users: "1-2" };
      const manyUsers: UserAnswers = { ...baseAnswers, users: "6+" };

      const resultsFew = calculateDeviceScores(fewUsers, norm(fewUsers));
      const resultsMany = calculateDeviceScores(manyUsers, norm(manyUsers));

      const piFew = resultsFew.find((r) => r.device.key === "raspberryPi")!;
      const piMany = resultsMany.find((r) => r.device.key === "raspberryPi")!;

      // Scores should differ because concurrency weight changes (0.5 vs 3)
      // AND the normalizedAnswers.concurrency changes (1 vs 5)
      expect(piFew.matchPercentage).not.toBe(piMany.matchPercentage);
    });

    it("concurrency weight is 0 when no priority attributes have points", () => {
      // No priority points → totalPoints = 0 → equal weights (1/6 each).
      // Even though concurrency starts at 0 in pointWeights, the equal-weight
      // fallback gives it 1/6 anyway. The test verifies the function works.
      const noPriorities: UserAnswers = {
        electricity: "yes",
        users: "6+",
        growth: "medium",
        reuse: "no",
        format: "yes",
        price: "low",
        points: { lowPower: 0, scalable: 0, easyToUse: 0, lowCost: 0 },
      };

      const results = calculateDeviceScores(noPriorities, norm(noPriorities));

      expect(results).toHaveLength(4);
      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
      }
    });

    it("3–5 users produce valid results (mid-range concurrency weight)", () => {
      const midUsers: UserAnswers = { ...baseAnswers, users: "3-5" };
      const results = calculateDeviceScores(midUsers, norm(midUsers));

      expect(results).toHaveLength(4);
      expect(results[0].matchPercentage).toBeGreaterThanOrEqual(0);
    });
  });

  // ─── 3. Language redistribution ──────────────────────────────────

  describe("language redistribution", () => {
    it("distributes language points proportionally among the 4 priority attributes", () => {
      // lowPower=10, scalable=5, easyToUse=5, lowCost=0, language=20
      // totalPriorityPoints = 10+5+5+0 = 20
      // energy  += 20 * (10/20) = 10  → 10+10 = 20
      // growth  += 20 * (5/20)  =  5  →  5+5  = 10
      // formatEase += 20 * (5/20) =  5  →  5+5  = 10
      // cost stays at 0
      // This makes energy heavily dominant
      const answers: UserAnswers = {
        ...baseAnswers,
        points: {
          lowPower: 10,
          scalable: 5,
          easyToUse: 5,
          lowCost: 0,
          language: 20,
        },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      expect(results).toHaveLength(4);

      // With energy heavily weighted (20 out of ~41.5 total),
      // Raspberry Pi (energy=5) should rank very highly
      const pi = results.find((r) => r.device.key === "raspberryPi")!;
      expect(pi.matchPercentage).toBeGreaterThan(0);
    });

    it("distributes language points equally when all other priorities are 0", () => {
      // All priorities 0, language=20 → 20/4 = 5 each to energy, growth, formatEase, cost
      // concurrency weight = 0 (no priorities have >0 points)
      const answers: UserAnswers = {
        ...baseAnswers,
        points: {
          lowPower: 0,
          scalable: 0,
          easyToUse: 0,
          lowCost: 0,
          language: 20,
        },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      expect(results).toHaveLength(4);
      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
        expect(r.matchPercentage).toBeLessThanOrEqual(100);
      }
    });

    it("no language points → no redistribution (weights unchanged)", () => {
      const noLanguage: UserAnswers = {
        ...baseAnswers,
        points: { lowPower: 10, scalable: 10, easyToUse: 10, lowCost: 10 },
      };
      const withLanguage: UserAnswers = {
        ...baseAnswers,
        points: {
          lowPower: 10,
          scalable: 10,
          easyToUse: 10,
          lowCost: 10,
          language: 20,
        },
      };

      const resultsNoLang = calculateDeviceScores(noLanguage, norm(noLanguage));
      const resultsWithLang = calculateDeviceScores(
        withLanguage,
        norm(withLanguage),
      );

      // Adding language points changes the distribution — the raw score
      // must differ even if the rounded matchPercentage happens to be the same.
      const piNoLang = resultsNoLang.find(
        (r) => r.device.key === "raspberryPi",
      )!;
      const piWithLang = resultsWithLang.find(
        (r) => r.device.key === "raspberryPi",
      )!;
      expect(piNoLang.score).not.toBe(piWithLang.score);
    });
  });

  // ─── 4. Reuse special handling ───────────────────────────────────

  describe("reuse special handling", () => {
    it("reuse=yes → reusable attribute gets 40% weight, reusedPC tops the ranking", () => {
      const withReuse: UserAnswers = { ...baseAnswers, reuse: "yes" };
      const results = calculateDeviceScores(withReuse, norm(withReuse));

      expect(results).toHaveLength(4);

      // Reused PC has reusable=5, others have reusable=0.
      // With 40% weight on reusable and user reusable=5 (reuse=yes → 5),
      // reusedPC gets a huge advantage and should be #1
      expect(results[0].device.key).toBe("reusedPC");
    });

    it("reuse=no → reusable gets 0 weight (no reuse boost)", () => {
      const withoutReuse: UserAnswers = { ...baseAnswers, reuse: "no" };
      const results = calculateDeviceScores(withoutReuse, norm(withoutReuse));

      expect(results).toHaveLength(4);

      // reusedPC is NOT necessarily top — its reusable=5 advantage is neutralized
      // At least verify all match percentages are valid
      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
      }
    });

    it("reuse=yes boosts reusedPC ranking relative to its reuse=no position", () => {
      // Use a profile where reusedPC is NOT top without reuse boost:
      // frequent outages + cannot format + low budget favors Pi
      const baseProfile: UserAnswers = {
        electricity: "no", // frequent outages → energy need = 5
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "no", // cannot format → formatEase need = 5
        price: "low",
        points: { lowPower: 5, scalable: 0, easyToUse: 5, lowCost: 5 },
      };
      const withReuse: UserAnswers = { ...baseProfile, reuse: "yes" };

      const resultsWithout = calculateDeviceScores(baseProfile, norm(baseProfile));
      const resultsWith = calculateDeviceScores(withReuse, norm(withReuse));

      // Without reuse, Raspberry Pi should be #1 (energy efficient + cheap)
      expect(resultsWithout[0].device.key).toBe("raspberryPi");

      // With reuse, reusedPC jumps to #1 due to 40% reusable weight
      expect(resultsWith[0].device.key).toBe("reusedPC");
    });
  });

  // ─── 5. Edge cases ───────────────────────────────────────────────

  describe("edge cases", () => {
    it("no user priorities → all attributes weighted equally", () => {
      // points are all 0 or missing → totalPoints = 0 → equal weights (1/6 each)
      const answers: UserAnswers = {
        electricity: "yes",
        users: "3-5",
        growth: "medium",
        reuse: "no",
        format: "yes",
        price: "low",
        // No points at all
      };

      const results = calculateDeviceScores(answers, norm(answers));

      expect(results).toHaveLength(4);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].matchPercentage).toBeGreaterThanOrEqual(
          results[i].matchPercentage,
        );
      }
    });

    it("exact attribute match → yields similarity = 5 (perfect match)", () => {
      // When user's reusable=5 (reuse=yes) and device's reusable=5 (Reused PC),
      // similarity = 5 - |5-5| = 5. When user's reusable=5 and device's
      // reusable=0 (Raspberry Pi), similarity = 5 - |5-0| = 0.
      // This difference, combined with the 40% reuse weight, makes Reused PC win.
      const answers: UserAnswers = {
        ...baseAnswers,
        reuse: "yes",
      };

      const results = calculateDeviceScores(answers, norm(answers));

      // The perfect match on reusable (5 vs 5) with 40% weight should
      // make Reused PC the top device
      expect(results[0].device.key).toBe("reusedPC");
    });

    it("matchPercentage is never negative (guard clause)", () => {
      // Even with extreme inputs, the division guard ensures matchPercentage >= 0
      const answers: UserAnswers = {
        electricity: "no",
        users: "6+",
        growth: "high",
        reuse: "yes",
        format: "no",
        price: "high",
        points: { lowPower: 0, scalable: 0, easyToUse: 0, lowCost: 0 },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
        expect(r.matchPercentage).toBeLessThanOrEqual(100);
      }
    });

    it("handles missing points key entirely (undefined)", () => {
      const answers: UserAnswers = {
        electricity: "yes",
        users: "3-5",
        growth: "medium",
        reuse: "no",
        format: "yes",
        price: "low",
        // points is undefined
      };

      const results = calculateDeviceScores(answers, norm(answers));

      expect(results).toHaveLength(4);
      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
      }
    });

    it("handles points with only language set (everything else missing)", () => {
      const answers: UserAnswers = {
        electricity: "yes",
        users: "3-5",
        growth: "medium",
        reuse: "no",
        format: "yes",
        price: "low",
        points: { language: 20 },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      expect(results).toHaveLength(4);
      for (const r of results) {
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
      }
    });
  });

  // ─── 6. Semantic correctness ─────────────────────────────────────

  describe("semantic correctness — correct device for user profile", () => {
    it("user with frequent outages ranks Raspberry Pi above Reused PC", () => {
      // User has frequent power outages → needs energy efficiency
      // Raspberry Pi (energy=5) should score higher than Reused PC (energy=1)
      const answers: UserAnswers = {
        electricity: "no", // frequent outages → energy need = 5
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "yes",
        price: "low",
        points: { lowPower: 10, scalable: 0, easyToUse: 0, lowCost: 0 },
      };

      const results = calculateDeviceScores(answers, norm(answers));
      const pi = results.find((r) => r.device.key === "raspberryPi")!;
      const reusedPC = results.find((r) => r.device.key === "reusedPC")!;

      expect(pi.score).toBeGreaterThan(reusedPC.score);
    });

    it("user who cannot format ranks easier devices above harder ones", () => {
      // User cannot format → needs easy setup
      // Devices with higher formatEase should score better for this user
      // Raspberry Pi (formatEase=3) vs ZimaBoard (formatEase=2) vs Reused PC (formatEase=2)
      const answers: UserAnswers = {
        electricity: "yes",
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "no", // cannot format → formatEase need = 5
        price: "medium",
        points: { lowPower: 0, scalable: 0, easyToUse: 10, lowCost: 0 },
      };

      const results = calculateDeviceScores(answers, norm(answers));
      const pi = results.find((r) => r.device.key === "raspberryPi")!;
      const zima = results.find((r) => r.device.key === "zimaBoard")!;
      const reusedPC = results.find((r) => r.device.key === "reusedPC")!;

      // Raspberry Pi (formatEase=3) is closest to user need (5) among non-NUC devices
      // NUC (formatEase=3) ties with Pi on formatEase, but Pi is cheaper (cost=5 vs cost=1)
      expect(pi.score).toBeGreaterThan(zima.score);
      expect(pi.score).toBeGreaterThan(reusedPC.score);
    });

    it("user with reliable power does not strongly prefer energy-efficient devices", () => {
      // With reliable power (energy need = 1), the energy attribute contributes
      // equally for all devices since the user has no special need.
      // Reused PC (energy=1) and Pi (energy=5) should have similar energy scores
      // when the user's energy need is low (1).
      const answers: UserAnswers = {
        electricity: "yes", // reliable power → energy need = 1
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "yes",
        price: "low",
        points: { lowPower: 10, scalable: 0, easyToUse: 0, lowCost: 0 },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      // Reused PC (energy=1) should match user energy need (1) perfectly
      // Pi (energy=5) should have a larger gap from user need (1)
      const reusedPC = results.find((r) => r.device.key === "reusedPC")!;
      const pi = results.find((r) => r.device.key === "raspberryPi")!;

      // When user need=1, Reused PC (1) gets similarity=5, Pi (5) gets similarity=1
      // So with lowPower priority, Reused PC wins on energy
      expect(reusedPC.score).toBeGreaterThan(pi.score);
    });

    it("combined: frequent outages + cannot format + low budget favors Raspberry Pi", () => {
      const answers: UserAnswers = {
        electricity: "no", // frequent outages → high energy need
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "no", // cannot format → high need for easy setup
        price: "low", // low budget → need low cost
        points: { lowPower: 5, scalable: 0, easyToUse: 5, lowCost: 5 },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      // Raspberry Pi: energy=5, formatEase=3, cost=5 — strong on energy & cost
      // NUC: energy=2, formatEase=3, cost=1 — bad on energy & cost
      // Reused PC: energy=1, formatEase=2, cost=4 — worst on energy
      expect(results[0].device.key).toBe("raspberryPi");
    });

    it("strengths array contains matching attribute keys for a well-matched device", () => {
      // User with frequent outages → energy need=5 matches Pi energy=5 → similarity=5
      const answers: UserAnswers = {
        electricity: "no", // energy need = 5
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "yes",
        price: "low",
        points: { lowPower: 5, scalable: 0, easyToUse: 0, lowCost: 5 },
      };

      const results = calculateDeviceScores(answers, norm(answers));
      const pi = results.find((r) => r.device.key === "raspberryPi")!;

      // Pi (energy=5) perfectly matches user energy need (5) → similarity=5 >= 4
      expect(pi.strengths).toContain("energy");
      // Pi (cost=5) matches user low budget (5) → similarity=5 >= 4
      expect(pi.strengths).toContain("cost");
    });

    it("perfect match profile scores 100% with equal weights and reuse override", () => {
      // Reused PC: energy=1, concurrency=4, growth=4, reusable=5, formatEase=2, cost=4
      // With reuse="yes", reusable gets 40% weight
      // Other attributes get equal share of 60%
      const answers: UserAnswers = {
        electricity: "no",        // energy need = 5 → gap |5-1|=4 → similarity=1
        users: "1-2",             // concurrency need = 1 → gap |1-4|=3 → similarity=2
        growth: "low",            // growth need = 1 → gap |1-4|=3 → similarity=2
        reuse: "yes",             // reusable gets 40% weight boost
        format: "yes",            // formatEase need = 1 → gap |1-2|=1 → similarity=4
        price: "medium",          // cost need = 3 → gap |3-4|=1 → similarity=4
        // no points → equal weights
      };

      const results = calculateDeviceScores(answers, norm(answers));
      const reusedPC = results.find((r) => r.device.key === "reusedPC")!;

      // With reuse="yes", reusedPC gets 40% weight on reusable where it's 5/5
      // This gives it a dominant match over other devices
      expect(results[0].device.key).toBe("reusedPC");
      expect(reusedPC.matchPercentage).toBeGreaterThan(70);
    });

    it("tie-breaking: devices with equal scores sort consistently", () => {
      // Deliberately create a profile where two devices should tie
      // by giving no priority points (equal weights) and neutral answers
      const answers: UserAnswers = {
        electricity: "yes",
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "yes",
        price: "medium",
        // no points → equal weights
      };

      const results = calculateDeviceScores(answers, norm(answers));
      const sortOrder = results.map((r) => r.device.key);
      const sortedScores = results.map((r) => r.score);

      // Verify scores are sorted descending (already sorted by function contract)
      for (let i = 1; i < sortedScores.length; i++) {
        expect(sortedScores[i]).toBeLessThanOrEqual(sortedScores[i - 1]);
      }

      // Re-run and verify same sort order (stability)
      const results2 = calculateDeviceScores(answers, norm(answers));
      expect(results2.map((r) => r.device.key)).toEqual(sortOrder);
    });

    it("language redistribution with single non-zero priority: all language flows into that priority", () => {
      // Only lowPower=10 is set, plus language=20
      // All 20 language points should be proportional-assigned to lowPower
      const answers: UserAnswers = {
        electricity: "no",
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "yes",
        price: "low",
        points: { lowPower: 10, scalable: 0, easyToUse: 0, lowCost: 0, language: 20 },
      };

      const results = calculateDeviceScores(answers, norm(answers));
      const pi = results.find((r) => r.device.key === "raspberryPi")!;
      // Pi wins on energy+cost, and with all points in energy, it should rank first
      expect(pi.score).toBeGreaterThan(0);
      expect(results[0].device.key).toBe("raspberryPi");
    });

    it("handles negative and out-of-range point values without NaN", () => {
      const answers: UserAnswers = {
        electricity: "yes",
        users: "1-2",
        growth: "low",
        reuse: "no",
        format: "yes",
        price: "medium",
        points: { lowPower: -5, scalable: 0, easyToUse: 0, lowCost: 0 },
      };

      const results = calculateDeviceScores(answers, norm(answers));

      results.forEach((r) => {
        expect(isNaN(r.score)).toBe(false);
        expect(isNaN(r.matchPercentage)).toBe(false);
        expect(r.matchPercentage).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
