import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wordSets = pgTable("word_sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  difficulty: text("difficulty").notNull(),
  categories: jsonb("categories").$type<string[]>().notNull(),
  words: jsonb("words").$type<{word: string, category: string}[]>().notNull()
});

export const gameState = pgTable("game_states", {
  id: serial("id").primaryKey(),
  wordSetId: integer("word_set_id").notNull(),
  selectedWords: jsonb("selected_words").$type<{word: string, category: string}[]>().notNull(),
  score: integer("score").notNull(),
  completed: boolean("completed").notNull()
});

export const insertWordSetSchema = createInsertSchema(wordSets);
export const insertGameStateSchema = createInsertSchema(gameState);

export type WordSet = typeof wordSets.$inferSelect;
export type InsertWordSet = z.infer<typeof insertWordSetSchema>;
export type GameState = typeof gameState.$inferSelect;
export type InsertGameState = z.infer<typeof insertGameStateSchema>;