import { Page, test, expect } from '@playwright/test';

/**
 * Sets up a board position for testing
 * @param page Playwright page
 * @param fen FEN string to set up
 */
export async function setupBoard(page: Page, fen: string) {
  // await page.goto(`http://localhost:4200/custom?fen=${fen}`);
  await page.goto('/custom?fen=' + fen);

  await page.waitForLoadState('networkidle');

  /* WIP, trying to find alternative to using networkidle because networkidle 
  can be unstable in production due to tracking scrips and what not
  
  // await page.waitForLoadState('domcontentloaded'); // Wait for DOM to load

  // const divWhite = page.locator("div[data-square='d5']");
  // await expect(divWhite).toBeVisible();

  // // // Wait for the chessboard to be present
  // await page.waitForSelector('[data-square]', { state: 'visible' });

  // // // Wait for the pieces to be rendered
  // await page.waitForSelector('[data-piece]', { state: 'visible' });

  // // Verify all pieces on the board are visible
  // const pieces = page.locator('[data-piece]');
  // const count = await pieces.count();

  // // Calculate expected pieces from FEN
  // const fenPosition = fen.split(' ')[0];
  // let expectedPieceCount = 0;
  // for (const char of fenPosition) {
  //   if (!/[1-8\/]/.test(char)) {
  //     expectedPieceCount++;
  //   }
  // }

  // expect(count).toBe(expectedPieceCount);

  // // Verify each piece is visible
  // for (let i = 0; i < count; i++) {
  //   const piece = pieces.nth(i);
  //   await expect(piece).toBeVisible();
  // }

  // // Wait for the SVG element to be present and visible
  // await page.locator('svg').last().waitFor({ state: 'visible' });

  // // Optionally, wait for specific child elements within the SVG
  // await page.locator('svg > g').last().waitFor();

  // Ensure network requests have settled if applicable
  // await page.waitForSelector('[data-boardid="0"]', { state: 'visible' });
  // const board = await page.get
  // board.addEventListener('load', function() {
  //   console.log('here');
  // }

  // await page.waitForSelector('[data-boardid="0"]', { state: 'visible' });

  console.log('Chessboard is loaded!');
  */
}

/**
 * Asserts that a move succeeds
 * @param page Playwright page
 * @param from Starting square
 * @param to Target square
 * @param piece Piece type (e.g., 'wP', 'bK')
 */
export async function assertMoveSucceeds(
  page: Page,
  from: string,
  to: string,
  piece: string
) {
  await movePiece(page, from, to);
  const targetPiece = await getPieceAt(page, to);
  const sourcePiece = await getPieceAt(page, from);
  expect(targetPiece).toBe(piece);
  expect(sourcePiece).toBeNull();
}

/**
 * Asserts that a move fails
 * @param page Playwright page
 * @param from Starting square
 * @param to Target square
 * @param piece Piece type (e.g., 'wP', 'bK')
 */
export async function assertMoveFails(
  page: Page,
  from: string,
  to: string,
  piece: string
) {
  await movePiece(page, from, to);
  const sourcePiece = await getPieceAt(page, from);
  expect(sourcePiece).toBe(piece);
}

/**
 * Asserts that a pawn promotion succeeds
 * @param page Playwright page
 * @param color Color of the pawn (e.g., 'w', 'b')
 * @param promotionPiece Piece type to promote to (e.g., 'Q', 'R')
 */
export async function assertPawnPromotion(
  page: Page,
  color: string,
  promotionPiece: string
) {
  // Setup a pawn one square away from promotion
  const rank = color === 'w' ? '7' : '2';
  const promotionRank = color === 'w' ? '8' : '1';
  const fen =
    color === 'w'
      ? '8/3P4/8/8/8/8/8/8 w - - 0 1' // White pawn on d7
      : '8/8/8/8/8/8/3p4/8 b - - 0 1'; // Black pawn on d2

  await setupBoard(page, fen);

  // Start the pawn move
  await page.dragAndDrop(
    `[data-square="d${rank}"] [data-piece]`,
    `[data-square="d${promotionRank}"]`
  );

  // Wait for and handle the promotion dialog
  await page.waitForSelector('[data-piece]');
  await page.click(`[data-piece="${color}${promotionPiece}"]`);

  // Verify the promotion
  const promotedPiece = await getPieceAt(page, `d${promotionRank}`);
  expect(promotedPiece).toBe(`${color}${promotionPiece}`);
  expect(await getPieceAt(page, `d${rank}`)).toBeNull();
}

/**
 * Moves a piece on the board
 * @param page Playwright page
 * @param from Starting square
 * @param to Target square
 */
export async function movePiece(page: Page, from: string, to: string) {
  await page.dragAndDrop(
    `[data-square="${from}"] [data-piece]`,
    `[data-square="${to}"]`
  );
}

/**
 * Gets the piece at a square
 * @param page Playwright page
 * @param square Square to check
 * @returns Piece type or null if empty
 */
export async function getPieceAt(
  page: Page,
  square: string
): Promise<string | null> {
  const pieceExists =
    (await page.locator(`[data-square="${square}"] [data-piece]`).count()) > 0;
  if (!pieceExists) {
    return null;
  }
  const piece = await page
    .locator(`[data-square="${square}"] [data-piece]`)
    .getAttribute('data-piece');
  return piece;
}
