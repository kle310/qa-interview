import { Chessboard } from 'react-chessboard';
import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { useSearchParams } from 'react-router';

export const ChessboardCustomBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [isReady, setReady] = useState(false);
  const [searchParams] = useSearchParams();
  const params = searchParams.get('fen');
  useEffect(() => {
    if (!params) return;
    game.load(params);
    setReady(true);
  }, [params]);

  function makeAMove(move: any) {
    const gameCopy = { ...game };

    const result = gameCopy.move(move);
    if (result) {
      // Always reset to white's turn
      game.load(game.fen().replace(/ (w|b) /, ' w '));
    }
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    return true;
  }
  if (!isReady) return;
  return (
    <div
      css={{
        width: '500px',
        height: '500px',
      }}
      data-fen={game.fen()}
    >
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
};
