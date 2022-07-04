import React, { } from 'react';
import styles from "../../styles/Home.module.css";
import Cards, {personAtom} from './Cards';
import { useAtom } from 'jotai';
import { cardPageState, deckPageState } from './header';

function AllCards() {

    const [person, setPerson] = useAtom(personAtom);
    const [cardPage, setCardPage] = useAtom(cardPageState);
    const [deckPage, setDeckPage] = useAtom(deckPageState);

    return (
        <div>
        {cardPage ? 
        <div className={styles.cardnav}>
            <div onClick={() => setPerson(null)} className={styles.cardtitle1}>
                All Cards
            </div>
            <svg className={styles.svg} width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.5 0.5L6.5 6L0.5 11.5" stroke="#444444" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {person == null ?
            <div className={styles.cardselector}>
                Select a card
            </div>
            : <div className={styles.cardselector2}>
                {person.name}
            </div>
            }
        </div>
        : deckPage ?     <div className={styles.cardnav}>
        <div className={styles.cardtitle1}>
            All Decks
        </div>
        <svg className={styles.svg} width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.5 0.5L6.5 6L0.5 11.5" stroke="#444444" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className={styles.cardselector}>
            Select a deck
        </div>
    </div> : ''
}
       <Cards /> 
        </div>
    );
}
export default AllCards;