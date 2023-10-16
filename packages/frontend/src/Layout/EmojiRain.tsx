import { useState, useEffect } from 'react';

type Emoji = {
  id: number;
  left: number;
  animationDuration: number;
  fontSize: number;
  emoji: string;
};

const getEmojiId = (emoji: Emoji) => `emoji-${emoji.id}`;

export const EmojiRain = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    if (document.visibilityState !== 'visible') {
      return;
    }

    // Add a list of emojis from which to randomly select
    const emojiList = ['🏉', '🤌', '🍻'];

    const generateEmoji = (): Emoji => {
      let chosenEmoji;

      // Generate a random number between 0 and 100
      const randomNum = Math.random() * 100;

      // Assign emojis based on the probability distribution
      if (randomNum < 70) {
        chosenEmoji = emojiList[0]; // 70% probability for 🏉
      } else if (randomNum < 85) {
        chosenEmoji = emojiList[1]; // 15% probability for 🚗
      } else {
        chosenEmoji = emojiList[2]; // 15% probability for 🚀
      }

      return {
        id: Math.random(),
        left: Math.random() * 100,
        animationDuration: 6 + Math.random() * 5,
        fontSize: 20 + Math.random() * 30,
        emoji: chosenEmoji,
      };
    };

    const generateEmojis = () => {
      if (document.visibilityState === 'visible') {
        const newEmoji = generateEmoji();
        setEmojis(prevEmojis => [...prevEmojis, newEmoji]);
      }
    };

    const cleanUpEmojis = () => {
      setEmojis(prevEmojis =>
        prevEmojis.filter(
          emoji =>
            (document.getElementById(getEmojiId(emoji))?.getBoundingClientRect()
              ?.top ?? 0) < window.innerHeight,
        ),
      );
    };

    const emojiInterval = setInterval(generateEmojis, 1000); // Generate new emoji every 0.5 second
    const cleanUpInterval = setInterval(cleanUpEmojis, 2000); // Clean up emojis every 2 seconds

    return () => {
      clearInterval(emojiInterval); // Cleanup interval on component unmount
      clearInterval(cleanUpInterval); // Clean up emojis interval on component unmount
    };
  }, []);

  return (
    <>
      {emojis.map(emoji => (
        <span
          key={getEmojiId(emoji)}
          id={getEmojiId(emoji)} // Ensure id is a string to avoid React warnings
          className="absolute animate-spin"
          style={{
            left: `${emoji.left}vw`,
            top: '0vh',
            fontSize: `${emoji.fontSize}px`,
            animationDuration: `${emoji.animationDuration}s`,
            animationName: 'slide',
            animationTimingFunction: 'linear',
          }}
        >
          {emoji.emoji}
        </span>
      ))}
      {/* @ts-expect-error JSX tag not working */}
      <style jsx="true">{`
        @keyframes slide {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(100vh);
          }
        }
      `}</style>
    </>
  );
};
