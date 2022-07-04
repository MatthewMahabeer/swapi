import React, {useImperativeHandle, useState, forwardRef, useEffect} from 'react';
import { isEmpty } from 'lodash';
import { deckList } from './Cards';
import { useAtom } from 'jotai';

const DeckContextMenu = (props, ref) => {

    const [menuState, setMenuState] = useState(false);
    const [decks] = useAtom(deckList);

    useImperativeHandle(ref, () => ({
        toggleMenu: () => {
            setMenuState(!menuState);
        },
        close: () => {
            setMenuState(false);
        },
        addCard: (card) => {
            
        }
    }));

    if(!menuState) {
        return null;
    }

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
                : decks.map(deck => {
                    return ( 
                        <div className='deck-menu__item'>
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