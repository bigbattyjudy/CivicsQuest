import { type WordSet, type InsertWordSet, type GameState, type InsertGameState } from "@shared/schema";

export interface IStorage {
  getWordSets(): Promise<WordSet[]>;
  getWordSet(id: number): Promise<WordSet | undefined>;
  createWordSet(wordSet: InsertWordSet): Promise<WordSet>;
  getGameState(id: number): Promise<GameState | undefined>;
  createGameState(gameState: InsertGameState): Promise<GameState>;
  updateGameState(id: number, gameState: Partial<GameState>): Promise<GameState>;
}

export class MemStorage implements IStorage {
  private wordSets: Map<number, WordSet>;
  private gameStates: Map<number, GameState>;
  private currentWordSetId: number;
  private currentGameStateId: number;

  constructor() {
    this.wordSets = new Map();
    this.gameStates = new Map();
    this.currentWordSetId = 1;
    this.currentGameStateId = 1;
    
    // Initialize with sample word sets
    const civicsWordSets: InsertWordSet[] = [
      {
        name: "Branches of Government",
        difficulty: "easy",
        categories: ["Executive", "Legislative", "Judicial"],
        words: [
          { word: "President", category: "Executive" },
          { word: "Congress", category: "Legislative" },
          { word: "Supreme Court", category: "Judicial" },
          { word: "Vice President", category: "Executive" },
          { word: "Senate", category: "Legislative" },
          { word: "Federal Judge", category: "Judicial" },
          { word: "Cabinet", category: "Executive" },
          { word: "House", category: "Legislative" },
          { word: "Chief Justice", category: "Judicial" }
        ]
      },
      {
        name: "Constitutional Rights",
        difficulty: "medium",
        categories: ["Individual Rights", "Political Rights", "Legal Rights"],
        words: [
          { word: "Free Speech", category: "Individual Rights" },
          { word: "Voting", category: "Political Rights" },
          { word: "Fair Trial", category: "Legal Rights" },
          { word: "Religion", category: "Individual Rights" },
          { word: "Assembly", category: "Political Rights" },
          { word: "Due Process", category: "Legal Rights" },
          { word: "Press", category: "Individual Rights" },
          { word: "Petition", category: "Political Rights" },
          { word: "Counsel", category: "Legal Rights" }
        ]
      }
    ];

    civicsWordSets.forEach(set => this.createWordSet(set));
  }

  async getWordSets(): Promise<WordSet[]> {
    return Array.from(this.wordSets.values());
  }

  async getWordSet(id: number): Promise<WordSet | undefined> {
    return this.wordSets.get(id);
  }

  async createWordSet(wordSet: InsertWordSet): Promise<WordSet> {
    const id = this.currentWordSetId++;
    const newWordSet = { ...wordSet, id };
    this.wordSets.set(id, newWordSet);
    return newWordSet;
  }

  async getGameState(id: number): Promise<GameState | undefined> {
    return this.gameStates.get(id);
  }

  async createGameState(gameState: InsertGameState): Promise<GameState> {
    const id = this.currentGameStateId++;
    const newGameState = { ...gameState, id };
    this.gameStates.set(id, newGameState);
    return newGameState;
  }

  async updateGameState(id: number, update: Partial<GameState>): Promise<GameState> {
    const existing = this.gameStates.get(id);
    if (!existing) {
      throw new Error("Game state not found");
    }
    const updated = { ...existing, ...update };
    this.gameStates.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
