import { useState } from "react";
import styled from "styled-components";
import { WORD_LIST } from "./data";

type Word = {
  weight: number;
  word: string;
  number: number;
};

const formatNumber = (nr: number) => {
  if (nr < 10) return `0${nr}`;
  return nr.toString();
};

const weightedRandom2 = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8];
  const weight = [8, 7, 6, 5, 4, 3, 2, 1];

  let randomArray: any[] = [];
  array.forEach((item, index) => {
    var clone = Array(weight[index]).fill(item);
    randomArray.push(...clone);
  });

  const result = randomArray[~~(Math.random() * randomArray.length)];
  return result;
};

const weightedRandom = (items: any[], weights: number[]) => {
  let i = 0;
  for (i = 0; i < weights.length; i++) {
    weights[i] += weights[i - 1] || 1;
  }
  console.log(weights);

  const random = Math.random() * weights[weights.length - 1];
  console.log(random);

  for (i = 0; i < weights.length; i++) {
    if (weights[i] > random) break;
  }
  return items[i];
};

const getWeightedRandom = (words: Word[]) => {
  return weightedRandom(
    words,
    words.map((w) => w.weight)
  );
};

const getRandom = (words: Word[]) => {
  console.log(words);
  const index = Math.round(Math.random() * 100);
  return {
    ...words[index],
  };
};

const NumberImageMemory = ({}) => {
  const [quiz, setQuiz] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const [currentWord, setCurrentWord] = useState<any>();
  const [count, setCount] = useState(4);
  const [words, setWords] = useState(WORD_LIST);

  const handleCount = (value: number) => {
    if (value === 4) {
      setCurrentWord(getWeightedRandom(words));
    }
    if (value > 0) {
      setCount(value - 1);
    }

    setTimeout(() => {
      if (value > 0) {
        handleCount(value - 1);
      }
    }, 1000);
  };

  const handleQuizClick = () => {
    if (!quiz) {
      handleCount(count);
    }
    if (quiz) {
      setCount(4);
    }
    setQuiz(!quiz);
  };

  const handleCorrection = (correction: string) => {
    handleCount(4);
    let newWords: Word[] = [];
    if (correction === "correct") {
      newWords = words.map((w) =>
        w.number === currentWord?.number ? { ...w, weight: w.weight + 1 } : w
      );
    }
    if (correction === "wrong") {
      newWords = words.map((w) => {
        if (w.number === currentWord?.number) {
          return { ...w, weight: w.weight - 1 };
        }
        return w;
      });
    }
    setWords(newWords.sort((a, b) => a.weight - b.weight));
  };

  return (
    <Wrapper>
      <Container>
        <Buttons>
          <Button onClick={() => setShowWords(!showWords)}>
            {showWords ? "Ord" : "Nummer"}
          </Button>
          <Button onClick={handleQuizClick}>{quiz ? "Lista" : "Quiz"}</Button>
        </Buttons>
        <>
          <Title>{quiz ? "Quiz" : "Nummer och ord"}</Title>
          {quiz && (
            <Quiz>
              <Buttons>
                <Word>
                  {showWords
                    ? currentWord.word
                    : formatNumber(currentWord.number)}
                </Word>
                <Counter>
                  {count > 0
                    ? count
                    : showWords
                    ? formatNumber(currentWord.number)
                    : currentWord.word}
                </Counter>
              </Buttons>
              {count === 0 && (
                <Buttons>
                  <Button
                    bgColor="#358555"
                    onClick={() => handleCorrection("correct")}
                  >
                    Rätt
                  </Button>
                  <Button
                    bgColor="#853a35"
                    onClick={() => handleCorrection("wrong")}
                  >
                    Fel
                  </Button>
                </Buttons>
              )}
            </Quiz>
          )}
          {!quiz && (
            <List>
              {words.map(({ number, word }, i) => (
                <li key={word}>
                  <Number>{formatNumber(number)}</Number> - {word}
                </li>
              ))}
            </List>
          )}
        </>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Container = styled.div`
  box-sizing: border-box;
  max-width: 400px;
  margin: 0 auto;
`;
const Buttons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;
const Button = styled.button<{ bgColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  line-height: 26px;
  font-weight: 700;
  font-size: 12px;
  padding: 10px 36px;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  background-color: ${(p) => p.bgColor || "#444"};
  color: white;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  width: 100%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: box-shadow 150ms ease;
  :hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  }
  :active {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  :first-child {
    margin-right: 10px;
  }
`;
const Quiz = styled.div`
  box-sizing: border-box;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;
const Word = styled.strong`
  font-size: 35px;
`;
const Counter = styled.span`
  font-size: 35px;
`;
const Title = styled.h2`
  margin: 40px 0 5px;
`;
const List = styled.ul`
  box-sizing: border-box;
  list-style-type: none;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  li {
    padding: 5px;
  }
`;
const Number = styled.span`
  opacity: 0.4;
`;

export default NumberImageMemory;
