import { test, expect } from '@playwright/test';
import {
  setupBoard,
  assertMoveSucceeds,
  assertMoveFails,
  getPieceAt,
} from './helpers';

test.describe('King Movement Rules', () => {
  // These tests use white king but the rules apply to both colors
  // since movement patterns are identical regardless of piece color
  test('can move one square in any direction', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3K4/8/8/8 w - - 0 1');

    // Test all eight possible one-square moves
    await assertMoveSucceeds(page, 'd4', 'd5', 'wK'); // Up
    await assertMoveSucceeds(page, 'd5', 'e5', 'wK'); // Right
    await assertMoveSucceeds(page, 'e5', 'e4', 'wK'); // Down
    await assertMoveSucceeds(page, 'e4', 'd4', 'wK'); // Left

    await assertMoveSucceeds(page, 'd4', 'e5', 'wK'); // Up-Right
    await assertMoveSucceeds(page, 'e5', 'f4', 'wK'); // Down-Right
    await assertMoveSucceeds(page, 'f4', 'e3', 'wK'); // Down-Left
    await assertMoveSucceeds(page, 'e3', 'd4', 'wK'); // Up-Left
  });

  test('cannot move more than one square', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3K4/8/8/8 w - - 0 1');

    // Test moves of two squares (should fail)
    await assertMoveFails(page, 'd4', 'd6', 'wK'); // Two squares up
    await assertMoveFails(page, 'd4', 'f4', 'wK'); // Two squares right
    await assertMoveFails(page, 'd4', 'd2', 'wK'); // Two squares down
    await assertMoveFails(page, 'd4', 'b4', 'wK'); // Two squares left
  });

  test('can capture enemy pieces', async ({ page }) => {
    await setupBoard(page, '8/8/8/3p4/3K4/8/8/8 w - - 0 1');
    await assertMoveSucceeds(page, 'd4', 'd5', 'wK');
  });

  test('cannot move into check', async ({ page }) => {
    await setupBoard(page, '8/8/8/3r4/2K5/8/8/8 w - - 1 1');
    await assertMoveFails(page, 'c4', 'd4', 'wK');
  });

  test('can castle kingside', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/8/8/8/4K2R w K - 0 1');
    await assertMoveSucceeds(page, 'e1', 'g1', 'wK');
    expect(await getPieceAt(page, 'f1')).toBe('wR');
  });

  test('can castle queenside', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/8/8/8/R3K3 w Q - 0 1');
    await assertMoveSucceeds(page, 'e1', 'c1', 'wK');
    expect(await getPieceAt(page, 'd1')).toBe('wR');
  });
});
