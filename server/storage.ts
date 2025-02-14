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
        wordGroups: [
          {
            words: ["President", "Vice President", "Cabinet", "Executive Orders"],
            explanation: "These all relate to the Executive Branch, which is responsible for implementing and enforcing federal laws."
          },
          {
            words: ["Senate", "House", "Congress", "Legislature"],
            explanation: "These make up the Legislative Branch, which is responsible for making laws."
          },
          {
            words: ["Supreme Court", "Federal Judge", "Chief Justice", "Judicial Review"],
            explanation: "These are part of the Judicial Branch, which interprets laws and determines if they are constitutional."
          }
        ],
        definitions: {
          "President": "Head of the Executive Branch and Commander in Chief",
          "Vice President": "Second in command of the Executive Branch, President of the Senate",
          "Cabinet": "Advisory body to the President, heads of federal departments",
          "Executive Orders": "Official directives from the President to federal agencies",
          "Senate": "Upper chamber of Congress, two senators per state",
          "House": "Lower chamber of Congress, representatives based on state population",
          "Congress": "Legislative body of the federal government",
          "Legislature": "Branch of government that makes laws",
          "Supreme Court": "Highest court in the federal judiciary",
          "Federal Judge": "Appointed judicial officer who resolves disputes",
          "Chief Justice": "Head of the Supreme Court and federal judiciary",
          "Judicial Review": "Power to determine if laws are constitutional"
        }
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
    const newWordSet = { id, ...wordSet };
    this.wordSets.set(id, newWordSet);
    return newWordSet;
  }

  async getGameState(id: number): Promise<GameState | undefined> {
    return this.gameStates.get(id);
  }

  async createGameState(gameState: InsertGameState): Promise<GameState> {
    const id = this.currentGameStateId++;
    const newGameState = { id, ...gameState };
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