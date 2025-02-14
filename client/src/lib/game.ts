import { type WordSet } from "@shared/schema";

export function calculateScore(
  selectedWords: { word: string; category: string }[],
  wordSet: WordSet
): number {
  const correctSelections = selectedWords.filter(
    (selection) =>
      wordSet.words.find(
        (w) => w.word === selection.word && w.category === selection.category
      )
  );
  return Math.floor((correctSelections.length / wordSet.words.length) * 100);
}

export function checkCategoryComplete(
  category: string,
  selectedWords: { word: string; category: string }[],
  wordSet: WordSet
): boolean {
  const categoryWords = wordSet.words.filter((w) => w.category === category);
  const selectedCategoryWords = selectedWords.filter(
    (w) => w.category === category
  );
  return (
    categoryWords.length === selectedCategoryWords.length &&
    categoryWords.every((word) =>
      selectedCategoryWords.find((sw) => sw.word === word.word)
    )
  );
}
