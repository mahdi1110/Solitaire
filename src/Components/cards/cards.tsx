import { CSSProperties } from "react";
import { Card } from "../../types";
import "./cards.css";

interface cardComponentProps {
  card: Card;
  handleClick?: any;
  colIndex?: number;
  rowIndex?: number;
}
const CardComponent = (props: cardComponentProps) => {
  if (!props.card) {
    return null;
  }

  const getSuitIcon = () => {
    switch (props.card.suit) {
      case "hearts":
        if (props.card.color === "black") {
          return "/hearts-icon.png";
        } else {
          return "/red-hearts.png";
        }
      case "spades":
        if (props.card.color === "black") {
          return "/spades-icon.png";
        } else {
          return "/red-spades.png";
        }
      case "clubs":
        if (props.card.color === "black") {
          return "/clubs-icon.png";
        } else {
          return "/red-club.png";
        }
      case "diamonds":
        if (props.card.color === "black") {
          return "/diamonds-icon.png";
        } else {
          return "/red-diamond.png";
        }
    }
  };
  // if card is flipped

  const handleCardClick = () => {
    if (!props.handleClick) {
      return;
    }
    if (props.colIndex !== undefined && props.rowIndex !== undefined) {
      props.handleClick(props.colIndex, props.rowIndex);
    } else {
      props.handleClick();
    }
  };
  //if card is not flipped
  const getCardLabel = () => {
    if (props.card.number === 1) {
      return "A";
    }
    if (props.card.number === 11) {
      return "J";
    }
    if (props.card.number === 12) {
      return "Q";
    }
    if (props.card.number === 13) {
      return "K";
    }
    return props.card.number;
  };
  const getCardStyles = () => {
    if (props.rowIndex !== undefined) {
      return {
        backgroundColor: "white",
        position: "absolute",
        top: `${props.rowIndex * 50}px`,
      } as CSSProperties;
    }
  };

  if (!props.card.flipped) {
    return <div className="card back-card" style={getCardStyles()}></div>;
  }
  const getFaceCard = () => {
    const { color, number } = props.card;
    if (number === 11) {
      if (color === "black") {
        return "black-jack";
      } else {
        return "red-jack";
      }
    } else if (number === 12) {
      if (color === "black") {
        return "black-queen";
      } else {
        return "red-queen";
      }
    } else if (number === 13) {
      if (color === "black") {
        return "black-king";
      } else {
        return "red-king";
      }
    }
  };

  return (
    <div
      style={getCardStyles()}
      className={`card ${
        props.card.color === "red" ? "red-card" : "black-card"
      } ${props.card.selected ? "selected" : ""} ${getFaceCard()}`}
      onClick={handleCardClick}
    >
      <img className="suit suitBox" src={getSuitIcon()} alt={props.card.suit} />
      <img
        className="suit suitBox2"
        src={getSuitIcon()}
        alt={props.card.suit}
      />
      <div className="number">{getCardLabel()}</div>
    </div>
  );
};
export default CardComponent;
