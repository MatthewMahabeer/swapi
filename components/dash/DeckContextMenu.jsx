import React, {useImperativeHandle, useState, forwardRef, useEffect} from 'react';
import { get, isEmpty } from 'lodash';
import { deckList } from './Cards';
import { atom, useAtom } from 'jotai';
import _ from 'deepdash';

export const deckOperatorAtom = atom(null);

const updateDeckAtom = atom(
   null,
    (get, set, _update) => {
        const deckArray = get(deckList);
            const index = deckArray.findIndex(d => d.name == get(deckOperatorAtom).name);
            const newDeckArray = [...deckArray];
            newDeckArray[index] = { ...newDeckArray[index], cards: [...newDeckArray[index].cards, get(cardAtom)] };
            set(deckList, newDeckArray);
            set(deckOperatorAtom, null);
            set(cardAtom, null);
    }
);

const cardAtom = atom(null);

const DeckContextMenu = (props, ref) => {

    const [menuState, setMenuState] = useState(false);
    const [decks] = useAtom(deckList);
    const [card, setCard] = useAtom(cardAtom);
    const [, setUpdateDeck] = useAtom(updateDeckAtom);
    const [, setDeckOperator] = useAtom(deckOperatorAtom);


    useImperativeHandle(ref, () => ({
        toggleMenu: () => {
            setMenuState(!menuState);
        },
        close: () => {
            setMenuState(false);
        },
    }));

    if(!menuState) {
        return null;
    }

    const addCardToDeck = (card, deck) => {
        setCard(card);
        setDeckOperator(deck);
        setUpdateDeck();
        ref.current.close();
    }

      const customFilter = (object, key, value) => {
        if (Array.isArray(object)) {
          for (const obj of object) {
            const result = customFilter(obj, key, value);
            if (result) {
              return obj;
            }
          }
        } else {
          if (object.hasOwnProperty(key) && object[key] === value) {
            return object;
          }
      
          for (const k of Object.keys(object)) {
            if (typeof object[k] === "object") {
              const o = customFilter(object[k], key, value);
              if (o !== null && typeof o !== 'undefined')
                return o;
            }
          }
          return null;
        }
      }

      customFilter(decks, 'name', props.card.name);

    return (
        <div className='deck-menu' ref={ref}>
            <div className='deck-menu__container'>
            <div className='deck-menu__title'>
                Select a deck
            </div>
            <hr className='deck-menu__hr' />
            <div className='deck-menu__item-container'>
                {isEmpty(decks) ? 
                <div style={{margin: 'auto'}}>
                    No decks found
                </div>
                :  customFilter(decks, 'name', props.card.name) !== undefined ? 
                <div style={{margin: 'auto'}}>
                   This card is already in a deck
            </div> :
                 decks.map(deck => {
                    return ( 
                        <div className='deck-menu__item' onClick={() => addCardToDeck(props.card, deck)}>
                            {deck.name}
                        </div>
                    )
                }) 
                }
            </div>
            </div>
        </div>
    )
}

export default forwardRef(DeckContextMenu);