import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameStateSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/word-sets", async (req, res) => {
    const wordSets = await storage.getWordSets();
    res.json(wordSets);
  });

  app.get("/api/word-sets/:id", async (req, res) => {
    const wordSet = await storage.getWordSet(parseInt(req.params.id));
    if (!wordSet) {
      res.status(404).json({ message: "Word set not found" });
      return;
    }
    res.json(wordSet);
  });

  app.post("/api/game-states", async (req, res) => {
    const parsed = insertGameStateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid game state data" });
      return;
    }
    const gameState = await storage.createGameState(parsed.data);
    res.json(gameState);
  });

  app.patch("/api/game-states/:id", async (req, res) => {
    try {
      const gameState = await storage.updateGameState(
        parseInt(req.params.id),
        req.body
      );
      res.json(gameState);
    } catch (err) {
      res.status(404).json({ message: "Game state not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
