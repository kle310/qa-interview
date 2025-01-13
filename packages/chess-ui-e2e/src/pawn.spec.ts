import { test, expect } from '@playwright/test';
import {
  setupBoard,
  assertMoveSucceeds,
  assertMoveFails,
  assertPawnPromotion,
  getPieceAt,
} from './helpers';

test.describe('Pawn Rules', () => {
  test.describe('White Pawn', () => {
    test.describe('Basic Movement', () => {
      test('moves forward one square', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/8/8/3P4/8 w - - 0 1');
        await assertMoveSucceeds(page, 'd2', 'd3', 'wP');
      });

      test('can move two squares on first move', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/8/8/3P4/8 w - - 0 1');
        await assertMoveSucceeds(page, 'd2', 'd4', 'wP');
      });
    });

    test.describe('Illegal Moves', () => {
      test('cannot move two squares after first move', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/8/3P4/8/8 w - - 0 1');
        await assertMoveFails(page, 'd3', 'd5', 'wP');
      });
      test('cannot move backward', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/3P4/8/8/8 w - - 0 1');
        await assertMoveFails(page, 'd4', 'd3', 'wP');
      });

      test('cannot move sideways', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/3P4/8/8/8 w - - 0 1');
        await assertMoveFails(page, 'd4', 'e4', 'wP');
        await assertMoveFails(page, 'd4', 'c4', 'wP');
      });

      test('cannot move diagonally without capture', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/8/8/3P4/8 w - - 0 1');
        await assertMoveFails(page, 'd2', 'e3', 'wP');
      });

      test('cannot capture friendly pieces', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/8/4P3/3P4/8 w - - 0 1');
        await assertMoveFails(page, 'd2', 'e3', 'wP');
      });
    });

    test.describe('Captures', () => {
      test('captures diagonally', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/8/4p3/3P4/8 w - - 0 1');
        await assertMoveSucceeds(page, 'd2', 'e3', 'wP');
      });

      test('en passant capture', async ({ page }) => {
        await setupBoard(page, '8/5p2/8/4P3/8/8/8/8 b - - 0 1');
        await assertMoveSucceeds(page, 'f7', 'f5', 'bP');
        await assertMoveSucceeds(page, 'e5', 'f6', 'wP');
        expect(await getPieceAt(page, 'f5')).toBeNull();
      });
    });

    test.describe('Promotion', () => {
      test('promotes to knight', async ({ page }) => {
        await assertPawnPromotion(page, 'w', 'N');
      });

      test('promotes to bishop', async ({ page }) => {
        await assertPawnPromotion(page, 'w', 'B');
      });

      test('promotes to rook', async ({ page }) => {
        await assertPawnPromotion(page, 'w', 'R');
      });

      test('promotes to queen', async ({ page }) => {
        await assertPawnPromotion(page, 'w', 'Q');
      });
    });
  });

  test.describe('Black Pawn', () => {
    test.describe('Basic Movement', () => {
      test('moves forward one square', async ({ page }) => {
        await setupBoard(page, '8/3p4/8/8/8/8/8/8 b - - 0 1');
        await assertMoveSucceeds(page, 'd7', 'd6', 'bP');
      });

      test('can move two squares on first move', async ({ page }) => {
        await setupBoard(page, '8/3p4/8/8/8/8/8/8 b - - 0 1');
        await assertMoveSucceeds(page, 'd7', 'd5', 'bP');
      });
    });

    test.describe('Illegal Moves', () => {
      test('cannot move two squares after first move', async ({ page }) => {
        await setupBoard(page, '8/8/8/3p4/8/8/8/8 b - - 0 1');
        await assertMoveFails(page, 'd5', 'd3', 'bP');
      });
      test('cannot move backward', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/3p4/8/8/8 b - - 0 1');
        await assertMoveFails(page, 'd4', 'd5', 'bP');
      });

      test('cannot move sideways', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/3p4/8/8/8 b - - 0 1');
        await assertMoveFails(page, 'd4', 'e4', 'bP');
        await assertMoveFails(page, 'd4', 'c4', 'bP');
      });

      test('cannot move diagonally without capture', async ({ page }) => {
        await setupBoard(page, '8/3p4/8/8/8/8/8/8 b - - 0 1');
        await assertMoveFails(page, 'd7', 'e6', 'bP');
      });

      test('cannot capture friendly pieces', async ({ page }) => {
        await setupBoard(page, '8/3p4/4p3/8/8/8/8/8 b - - 0 1');
        await assertMoveFails(page, 'd7', 'e6', 'bP');
      });
    });

    test.describe('Captures', () => {
      test('captures diagonally', async ({ page }) => {
        await setupBoard(page, '8/3p4/4P3/8/8/8/8/8 b - - 0 1');
        await assertMoveSucceeds(page, 'd7', 'e6', 'bP');
      });

      test('en passant capture', async ({ page }) => {
        await setupBoard(page, '8/8/8/8/4p3/8/3P4/8 w - - 0 1');
        await assertMoveSucceeds(page, 'd2', 'd4', 'wP');
        await assertMoveSucceeds(page, 'e4', 'd3', 'bP');
        expect(await getPieceAt(page, 'd4')).toBeNull();
      });
    });

    test.describe('Promotion', () => {
      test('promotes to knight', async ({ page }) => {
        await assertPawnPromotion(page, 'b', 'N');
      });

      test('promotes to bishop', async ({ page }) => {
        await assertPawnPromotion(page, 'b', 'B');
      });

      test('promotes to rook', async ({ page }) => {
        await assertPawnPromotion(page, 'b', 'R');
      });

      test('promotes to queen', async ({ page }) => {
        await assertPawnPromotion(page, 'b', 'Q');
      });
    });
  });
});
