import { test } from '@playwright/test';
import { setupBoard, assertMoveSucceeds, assertMoveFails } from './helpers';

test.describe('Queen Movement Rules', () => {
  // These tests use white queen but the rules apply to both colors
  // since movement patterns are identical regardless of piece color
  test('can move horizontally and vertically', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3Q4/8/8/8 w - - 0 1');
    
    // Test horizontal moves
    await assertMoveSucceeds(page, 'd4', 'h4', 'wQ'); // Right
    await assertMoveSucceeds(page, 'h4', 'd4', 'wQ'); // Left
    
    // Test vertical moves
    await assertMoveSucceeds(page, 'd4', 'd8', 'wQ'); // Up
    await assertMoveSucceeds(page, 'd8', 'd4', 'wQ'); // Down
  });

  test('can move diagonally', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3Q4/8/8/8 w - - 0 1');
    
    // Test diagonal moves
    await assertMoveSucceeds(page, 'd4', 'h8', 'wQ'); // Up-right
    await assertMoveSucceeds(page, 'h8', 'd4', 'wQ'); // Down-left
    await assertMoveSucceeds(page, 'd4', 'a7', 'wQ'); // Up-left
    await assertMoveSucceeds(page, 'a7', 'd4', 'wQ'); // Down-right
  });

  test('cannot move in L-shape pattern', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3Q4/8/8/8 w - - 0 1');
    await assertMoveFails(page, 'd4', 'e6', 'wQ'); // Knight-like move
  });

  test('can capture enemy pieces', async ({ page }) => {
    await setupBoard(page, '8/8/8/3p4/3Q4/8/8/8 w - - 0 1');
    await assertMoveSucceeds(page, 'd4', 'd5', 'wQ');
  });

  test('cannot move through pieces', async ({ page }) => {
    await setupBoard(page, '8/8/8/3p4/3Q4/8/8/8 w - - 0 1');
    await assertMoveFails(page, 'd4', 'd6', 'wQ');
  });
});
