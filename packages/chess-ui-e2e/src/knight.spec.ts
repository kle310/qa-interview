import { test } from '@playwright/test';
import { setupBoard, assertMoveSucceeds, assertMoveFails } from './helpers';

test.describe('Knight Movement Rules', () => {
  // These tests use white knight but the rules apply to both colors
  // since movement patterns are identical regardless of piece color
  test('can move in L-shape patterns', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3N4/8/8/8 w - - 0 1');

    // Test all eight possible L-shape moves
    await assertMoveSucceeds(page, 'd4', 'e6', 'wN'); // Up 2, Right 1
    await assertMoveSucceeds(page, 'e6', 'd4', 'wN'); // Down 2, Left 1
    await assertMoveSucceeds(page, 'd4', 'e6', 'wN'); // Up 2, Left 1
    await assertMoveSucceeds(page, 'e6', 'd4', 'wN'); // Down 2, Right 1

    await assertMoveSucceeds(page, 'd4', 'f5', 'wN'); // Up 1, Right 2
    await assertMoveSucceeds(page, 'f5', 'd4', 'wN'); // Down 1, Left 2
    await assertMoveSucceeds(page, 'd4', 'b5', 'wN'); // Up 1, Left 2
    await assertMoveSucceeds(page, 'b5', 'd4', 'wN'); // Down 1, Right 2
  });

  test('cannot move in non-L-shape patterns', async ({ page }) => {
    await setupBoard(page, '8/8/8/8/3N4/8/8/8 w - - 0 1');

    // Test invalid moves
    await assertMoveFails(page, 'd4', 'd5', 'wN'); // Straight up
    await assertMoveFails(page, 'd4', 'e4', 'wN'); // Straight right
    await assertMoveFails(page, 'd4', 'e5', 'wN'); // Diagonal
    await assertMoveFails(page, 'd4', 'f6', 'wN'); // Long diagonal
  });

  test('can capture enemy pieces', async ({ page }) => {
    await setupBoard(page, '8/8/4p3/8/3N4/8/8/8 w - - 0 1');
    await assertMoveSucceeds(page, 'd4', 'e6', 'wN');
  });

  test('can jump over pieces', async ({ page }) => {
    await setupBoard(page, '8/8/4p3/3p4/3N4/8/8/8 w - - 0 1');
    await assertMoveSucceeds(page, 'd4', 'e6', 'wN');
  });
});
