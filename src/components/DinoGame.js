import React, { useState, useEffect, useCallback } from 'react';

function DinoGame() {
  const [dinoPosition, setDinoPosition] = useState(0);
  const [cactusPosition, setCactusPosition] = useState(400);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentCactus, setCurrentCactus] = useState('🌵');
  const [gameStarted, setGameStarted] = useState(false);
  const [cactusCount, setCactusCount] = useState(1);

  const cactusTypes = ['🌵', '🌴', '🎋', '🌲', '🎄'];
  
  const getRandomCactus = () => {
    const randomIndex = Math.floor(Math.random() * cactusTypes.length);
    const count = Math.floor(Math.random() * 3) + 1;
    setCactusCount(count);
    return cactusTypes[randomIndex].repeat(count);
  };

  const jump = useCallback(() => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setDinoPosition(100);
      
      setTimeout(() => {
        setDinoPosition(0);
        setIsJumping(false);
      }, 500);
    }
  }, [isJumping, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setCactusPosition(400);
    setCurrentCactus('🌵');
    setCactusCount(1);
  };

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      if (!gameStarted) {
        startGame();
      } else if (gameOver) {
        startGame();
      } else {
        jump();
      }
    }
  }, [gameStarted, gameOver, jump]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (gameStarted && !gameOver) {
        setCactusPosition((prevPosition) => {
          if (prevPosition <= -50) {
            setScore(prev => {
              const newScore = prev + (10 * cactusCount);
              if (newScore >= 1000) {
                setGameOver(true);
              }
              return newScore;
            });
            setCurrentCactus(getRandomCactus());
            return 400;
          }
          return prevPosition - 5;
        });

        const DINO_WIDTH = 30;  // Slightly smaller than visual size
        const DINO_HEIGHT = 30; // Slightly smaller than visual size
        const CACTUS_WIDTH = 15; // Smaller than visual size per cactus
        
        const dinoBottom = dinoPosition;
        const dinoLeft = 50;
        
        const cactusLeft = cactusPosition;
        
        // Only check collision when dino is near ground level
        if (dinoBottom < 20) {  // dino is near ground
          // Check collision for each cactus in the group
          for (let i = 0; i < cactusCount; i++) {
            const currentCactusLeft = cactusLeft + (i * CACTUS_WIDTH);
            const currentCactusRight = currentCactusLeft + CACTUS_WIDTH;
            
            if (currentCactusRight > dinoLeft && 
                currentCactusLeft < (dinoLeft + DINO_WIDTH)) {
              setGameOver(true);
              break;
            }
          }
        }
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [cactusPosition, dinoPosition, gameOver, gameStarted, cactusCount]);

  return (
    <div 
      style={{
        height: '200px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid black',
        cursor: 'pointer'
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: dinoPosition,
          left: '50px',
          width: '40px',
          height: '40px',
          transition: isJumping ? 'bottom 0.5s' : 'none'
        }}
      >
        🦖
      </div>
      
      {gameStarted && !gameOver && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${cactusPosition}px`,
            width: `${20 * cactusCount}px`,
            height: '40px',
          }}
        >
          {currentCactus}
        </div>
      )}
      
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        分数: {score}/1000
      </div>
      
      {!gameStarted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px'
          }}
        >
          按空格键开始游戏
        </div>
      )}
      
      {gameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px'
          }}
        >
          {score >= 1000 ? '恭喜获胜！' : '游戏结束!'} 按空格键重新开始
        </div>
      )}
    </div>
  );
}

export default DinoGame; 