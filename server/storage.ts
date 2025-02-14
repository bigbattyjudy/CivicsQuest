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
      },
      {
        name: "Federal Holidays",
        difficulty: "medium",
        wordGroups: [
          {
            words: ["Independence Day", "July 4th", "Declaration of Independence", "American Revolution"],
            explanation: "Independence Day commemorates the adoption of the Declaration of Independence on July 4th, 1776, marking America's independence from British rule during the American Revolution."
          },
          {
            words: ["Memorial Day", "Last Monday May", "Armed Forces", "Military Service"],
            explanation: "Memorial Day honors military personnel who died while serving in the United States Armed Forces. It is observed on the last Monday in May."
          },
          {
            words: ["Labor Day", "Workers Rights", "Trade Unions", "September First Monday"],
            explanation: "Labor Day, celebrated on the first Monday in September, honors the American labor movement and workers' contributions to the nation's development."
          }
        ],
        definitions: {
          "Independence Day": "National holiday celebrating America's independence from Great Britain",
          "July 4th": "Date when the Declaration of Independence was adopted in 1776",
          "Declaration of Independence": "Document announcing the 13 colonies' independence from British rule",
          "American Revolution": "War for independence fought between Great Britain and the American colonies",
          "Memorial Day": "Holiday honoring U.S. military personnel who died while serving",
          "Last Monday May": "Traditional date for observing Memorial Day",
          "Armed Forces": "Combined military forces of the United States",
          "Military Service": "Active duty in any branch of the U.S. military",
          "Labor Day": "Holiday celebrating American workers and their achievements",
          "Workers Rights": "Legal protections and benefits for employees",
          "Trade Unions": "Organizations that represent workers' interests",
          "September First Monday": "Traditional date for observing Labor Day"
        }
      },
      {
        name: "Rights & Citizenship",
        difficulty: "hard",
        wordGroups: [
          {
            words: ["First Amendment", "Free Speech", "Free Press", "Religious Freedom"],
            explanation: "The First Amendment protects fundamental civil liberties including freedom of speech, press, and religion. These rights apply to all persons in the U.S., citizens and non-citizens alike."
          },
          {
            words: ["Due Process", "Legal Representation", "Fair Trial", "Miranda Rights"],
            explanation: "These are fundamental legal protections guaranteed by the Constitution. Due process ensures fair treatment in the legal system, including the right to an attorney and a fair trial."
          },
          {
            words: ["Citizenship", "Naturalization", "Green Card", "Voting Rights"],
            explanation: "These terms relate to immigration and citizenship. While Green Card holders have many rights, only citizens can vote in federal elections. Naturalization is the process of becoming a citizen."
          }
        ],
        definitions: {
          "First Amendment": "Constitutional amendment protecting key civil liberties",
          "Free Speech": "Right to express opinions without government censorship",
          "Free Press": "Right of media to publish without government control",
          "Religious Freedom": "Right to practice any religion or no religion",
          "Due Process": "Legal requirement for fair treatment in the justice system",
          "Legal Representation": "Right to have an attorney in legal proceedings",
          "Fair Trial": "Right to an impartial hearing in court",
          "Miranda Rights": "Right to remain silent and have an attorney present during questioning",
          "Citizenship": "Status of being a legal member of the country",
          "Naturalization": "Process of becoming a U.S. citizen",
          "Green Card": "Permanent resident status in the United States",
          "Voting Rights": "Right to participate in elections (citizens only)"
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