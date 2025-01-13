import { test } from '@playwright/test';
import { setupBoard, assertMoveSucceeds, assertMoveFails } from './helpers';

test.describe('Rook Movement Rules', () => {
  // These tests use white rook but the rules apply to both colors
  // since movement patterns are identical regardless of piece color
  test('can move horizontally', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3R4/8/8/8 w - - 0 1');

    // Test horizontal moves
    await assertMoveSucceeds(page, 'd4', 'h4', 'wR'); // Right
    await assertMoveSucceeds(page, 'h4', 'a4', 'wR'); // Left
    await assertMoveSucceeds(page, 'a4', 'd4', 'wR'); // Back to center
  });

  test('can move vertically', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3R4/8/8/8 w - - 0 1');

    // Test vertical moves
    await assertMoveSucceeds(page, 'd4', 'd8', 'wR'); // Up
    await assertMoveSucceeds(page, 'd8', 'd1', 'wR'); // Down
    await assertMoveSucceeds(page, 'd1', 'd4', 'wR'); // Back to center
  });

  test('cannot move diagonally', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3R4/8/8/8 w - - 0 1');

    // Test diagonal moves (should fail)
    await assertMoveFails(page, 'd4', 'e5', 'wR');
    await assertMoveFails(page, 'd4', 'c5', 'wR');
    await assertMoveFails(page, 'd4', 'e3', 'wR');
    await assertMoveFails(page, 'd4', 'c3', 'wR');
  });

  test('can capture enemy pieces', async ({ page }) => {
    await setupBoard(page, '8/8/8/3p4/3R4/8/8/8 w - - 0 1');
    await assertMoveSucceeds(page, 'd4', 'd5', 'wR');
  });

  test('cannot move through pieces', async ({ page }) => {
    await setupBoard(page, '8/8/8/3p4/3R4/8/8/8 w - - 0 1');
    await assertMoveFails(page, 'd4', 'd6', 'wR');
  });
});
