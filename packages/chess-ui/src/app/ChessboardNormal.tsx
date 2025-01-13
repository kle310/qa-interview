import { Chessboard } from 'react-chessboard';
import { useState } from 'react';
import { Chess } from 'chess.js';

export const ChessboardNormal = () => {
  const [game, setGame] = useState(new Chess());

  function makeAMove(move: any) {
    const gameCopy = { ...game };

    const result = gameCopy.move(move);
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

  return (
    <div
      css={{
        width: '500px',
        height: '500px',
      }}
      data-fen={game.fen()}
    >
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
    </div>
  );
};
