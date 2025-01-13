/* eslint playwright/expect-expect: ["error", { "assertMoveSucceeds": ["assertMoveSucceeds"] }] */

import { test } from '@playwright/test';
import { setupBoard, assertMoveSucceeds, assertMoveFails } from './helpers';

test.describe('Bishop Movement Rules', () => {
  // These tests use white bishop but the rules apply to both colors
  // since movement patterns are identical regardless of piece color
  test('can move diagonally', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3B4/8/8/8 w - - 0 1');

    // Test all diagonal directions
    await assertMoveSucceeds(page, 'd4', 'h8', 'wB'); // Up-right
    await assertMoveSucceeds(page, 'h8', 'd4', 'wB'); // Down-left
    await assertMoveSucceeds(page, 'd4', 'a7', 'wB'); // Up-left
    await assertMoveSucceeds(page, 'a7', 'd4', 'wB'); // Down-right
  });

  test('cannot move horizontally or vertically', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3B4/8/8/8 w - - 0 1');

    // Test non-diagonal moves (should fail)
    await assertMoveFails(page, 'd4', 'd5', 'wB'); // Up
    await assertMoveFails(page, 'd4', 'd3', 'wB'); // Down
    await assertMoveFails(page, 'd4', 'e4', 'wB'); // Right
    await assertMoveFails(page, 'd4', 'c4', 'wB'); // Left
  });

  test('can capture enemy pieces', async ({ page }) => {
    await setupBoard(page, '8/8/5p2/8/3B4/8/8/8 w - - 0 1');
    await assertMoveSucceeds(page, 'd4', 'f6', 'wB');
  });

  test('cannot move through pieces', async ({ page }) => {
    await setupBoard(page, '8/8/8/4P3/3B4/8/8/8 w - - 0 1');
    await assertMoveFails(page, 'd4', 'f6', 'wB');
  });
});
