import React, { useState, useEffect } from "react";
import "./App.css";
import CardComponent from "./Components/cards/cards";
import { Card } from "./types";
import { Learning } from "./Components/learning/learning";

function App() {
  const [deck, setDeck] = useState<Array<Card>>([]);
  const [dealtCards, setDealtCards] = useState<Array<Array<Card>>>([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [deckIndex, setDeckIndex] = useState<number>(0);
  const [selectedDeckCard, setSelectedDeckCard] = useState<boolean>(false);
  const [selectedDealtCard, setSelectedDealtCard] = useState<boolean>(false);
  const [aces, setAces] = useState<Array<Array<Card>>>([[], [], [], []]);

  const makeDeck = () => {
    const deck: any = [];
    const suits = ["hearts", "spades", "diamonds", "clubs"];
    suits.forEach((suit) => {
      const color = suit === "hearts" || suit === "diamonds" ? "red" : "black";
      for (let i = 1; i < 14; i++) {
        let newCard = {
          suit,
          color,
          number: i,
          flipped: false,
          selected: false,
        };
        deck.push(newCard);
      }
    });
    return deck;
  };
  const shuffleDeck = (deck: Array<Card>) => {
    const shuffledDeck = [];
    for (let i = 0; i < 52; i++) {
      const randNumber = Math.floor(Math.random() * (deck.length - 1));
      const removedCard = deck.splice(randNumber, 1);
      shuffledDeck.push(...removedCard);
    }
    return shuffledDeck;
  };
  const dealCards = (deck: Array<Card>) => {
    const dCards: Array<Array<Card>> = [[], [], [], [], [], [], []];

    for (let i = 0; i < 7; i++) {
      const removedCard = deck.splice(0, i + 1);
      removedCard[removedCard.length - 1].flipped = true;
      dCards[i].push(...removedCard);
    }
    return dCards;
  };
  const startGame = () => {
    const deck = makeDeck();
    const shuffledDeck = shuffleDeck(deck);
    const dealDeck = dealCards(shuffledDeck);
    shuffledDeck.forEach((card) => {
      card.flipped = true;
    });

    setDeck(shuffledDeck);
    setDealtCards(dealDeck);
  };

  useEffect(() => {
    startGame();
  }, []);
  const nextCard = () => {
    const newDeck = [...deck];
    newDeck[deckIndex].selected = false;
    setDeck(newDeck);
    if (deckIndex === deck.length - 1) {
      setDeckIndex(0);
    } else {
      setDeckIndex(deckIndex + 1);
    }
  };

  const handleDeckClick = () => {
    const newDeck = [...deck];
    if (newDeck[deckIndex].selected) {
      setSelectedDeckCard(false);
    } else {
      setSelectedDeckCard(true);
    }
    newDeck[deckIndex].selected = !newDeck[deckIndex].selected;
    setDeck(newDeck);
  };
  const handleDealtCardClick = (colIndex: number, rowIndex: number) => {
    // alert("dealt card clicked");
    const dCards = [...dealtCards];
    const newDeck = [...deck];
    //check if a card has been selected
    if (selectedDealtCard || selectedDeckCard) {
      //check if the card is from dealtCards
      if (selectedDealtCard) {
        const { card, selectedCol, selectedRow } =
          getCurrentlySelectedDealtCard();
        let currentCard = dCards[colIndex][rowIndex];
        //checking if the card can be moved
        if (
          card.color !== currentCard.color &&
          currentCard.number - card.number === 1
        ) {
          let amountOfCardsRemoved = dCards[selectedCol!].length - selectedRow!;
          const removedPrevCard = dCards[selectedCol!].splice(
            selectedRow!,
            amountOfCardsRemoved
          );
          const prevColumnLength = dCards[selectedCol!].length;
          if (prevColumnLength) {
            dCards[selectedCol!][prevColumnLength - 1].flipped = true;
          }
          dCards[colIndex].push(...removedPrevCard);
          dCards.forEach((col) => {
            col.forEach((card) => {
              card.selected = false;
            });
          });
          setSelectedDealtCard(false);
          setDealtCards(dCards);
        }
        //if card cant be moved
        else {
          dCards.forEach((col) => {
            col.forEach((card) => {
              card.selected = false;
            });
          });
          setSelectedDealtCard(false);
        }
      } else if (selectedDeckCard) {
        let prevCard = newDeck[deckIndex];
        let currentCard = dCards[colIndex][rowIndex];
        if (
          prevCard.color !== currentCard.color &&
          currentCard.number - prevCard.number === 1
        ) {
          newDeck[deckIndex].selected = false;
          const removedCard = newDeck.splice(deckIndex, 1);
          dCards[colIndex].push(...removedCard);
          if (newDeck.length === deckIndex) {
            setDeckIndex(deckIndex - 1);
          }
          setSelectedDeckCard(false);
        }
      } else {
        newDeck[deckIndex].selected = false;
        setSelectedDeckCard(false);
      }
    } else {
      dCards[colIndex][rowIndex].selected = true;
      setSelectedDealtCard(true);
    }
    setDeck(newDeck);
    setDealtCards(dCards);
  };
  const getCurrentlySelectedDealtCard = () => {
    let selectedCol: number;
    let selectedRow: number;
    dealtCards.forEach((column, columnIndex) => {
      column.forEach((card, cardIndex) => {
        if (card.selected === true) {
          selectedCol = columnIndex;
          selectedRow = cardIndex;
        }
      });
    });
    const card = dealtCards[selectedCol!][selectedRow!];
    return {
      card,
      selectedCol: selectedCol!,
      selectedRow: selectedRow!,
    };
  };
  const handleEmptyColumn = (colIndex: number) => {
    const dCards = [...dealtCards];
    const newDeck = [...deck];
    if (selectedDealtCard) {
      const { card, selectedCol, selectedRow } =
        getCurrentlySelectedDealtCard();
      if (card.number === 13) {
        let amountOfCardsRemoved = dCards[selectedCol!].length - selectedRow!;
        const kingCard = dCards[selectedCol!].splice(
          selectedRow!,
          amountOfCardsRemoved
        );
        const prevColumnLength = dCards[selectedCol!].length;
        if (prevColumnLength) {
          dCards[selectedCol!][prevColumnLength - 1].flipped = true;
        }
        dCards[colIndex].push(...kingCard);
        setDealtCards(dCards);
      }
    } else if (selectedDeckCard) {
      const card = newDeck[deckIndex];
      if (card.number === 13) {
        card.selected = false;
        let kingCard = newDeck.splice(deckIndex, 1);
        dCards[colIndex].push(...kingCard);
        if (newDeck.length === deckIndex) {
          setDeckIndex(deckIndex - 1);
        }
      }
      setDeck(newDeck);
      setDealtCards(dCards);
    } else {
    }
  };
  const handleAceClick = (aceColIndex: number) => {
    const dCards = [...dealtCards];
    const newDeck = [...deck];
    const newAces = [...aces];

    if (selectedDealtCard) {
      const { card, selectedCol, selectedRow } =
        getCurrentlySelectedDealtCard();
      if (dCards[selectedCol].length - 1 === selectedRow) {
        let moveDealtCard = () => {
          const removedCard = dCards[selectedCol!].splice(selectedRow!, 1);
          newAces[aceColIndex].push(...removedCard);
          card.selected = false;
          const prevColumnLength = dCards[selectedCol!].length;
          if (prevColumnLength) {
            dCards[selectedCol!][prevColumnLength - 1].flipped = true;
          }
          setAces(newAces);
          setDealtCards(dCards);
          setSelectedDealtCard(false);
        };
        if (newAces[aceColIndex].length === 0) {
          if (card.number === 1) {
            moveDealtCard();
          }
        } else {
          let latestAceIndex = aces[aceColIndex].length - 1;
          let topAceCard = aces[aceColIndex][latestAceIndex];
          if (
            card.suit === topAceCard.suit &&
            card.number === topAceCard.number + 1
          ) {
            moveDealtCard();
          }
        }
      }
    } else if (selectedDeckCard) {
      const card = newDeck[deckIndex];
      const moveDeckCard = () => {
        const removedCard = newDeck.splice(deckIndex, 1);
        newAces[aceColIndex].push(...removedCard);
        card.selected = false;
        if (newDeck.length === deckIndex) {
          setDeckIndex(deckIndex - 1);
        }
        setAces(newAces);
        setDeck(newDeck);
        setSelectedDeckCard(false);
      };
      if (newAces[aceColIndex].length === 0) {
        if (card.number === 1) {
          moveDeckCard();
        }
      } else {
        let latestAceIndex = aces[aceColIndex].length - 1;
        let topAceCard = aces[aceColIndex][latestAceIndex];
        if (
          card.suit === topAceCard.suit &&
          card.number === topAceCard.number + 1
        ) {
          moveDeckCard();
        }
      }
    }
  };
  const checkGameOver = () => {
    let isGameOver = true;
    for (let i = 0; i < aces.length; i++) {
      isGameOver = isGameOver && aces[i].length === 13;
    }

    return isGameOver;
  };

  if (checkGameOver()) {
    return <h1>Game Complete!!!!!</h1>;
  }
  return (
    <div className="solitaire-app">
      <div className="top-box">
        {aces.map((aceCol, aceColIndex) => {
          return (
            <div
              className="ace-column"
              onClick={() => {
                handleAceClick(aceColIndex);
              }}
            >
              {aceCol.length > 0 && (
                <CardComponent card={aceCol[aceCol.length - 1]} />
              )}
            </div>
          );
        })}
        <div className="deck-box">
          <CardComponent card={deck[deckIndex]} handleClick={handleDeckClick} />
          <div className="cards-placeholder" onClick={nextCard}></div>
        </div>
      </div>
      <div className="dealt-cards">
        {dealtCards.map((column, colIndex) => {
          if (column.length === 0) {
            return (
              <div
                className="column"
                onClick={() => {
                  handleEmptyColumn(colIndex);
                }}
              ></div>
            );
          }
          return (
            <div className="column">
              {column.map((card, rowIndex) => {
                return (
                  <CardComponent
                    card={card}
                    handleClick={handleDealtCardClick}
                    colIndex={colIndex}
                    rowIndex={rowIndex}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default App;
