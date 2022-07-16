import React, {useRef} from 'react';
import styles from "../../styles/Home.module.css";
import CardComponent, { singleDeck } from './CardComponent';
import Card from './Card';
import { useQuery } from 'react-query';
import { fetchPeople, filterPeople } from "../../pages/api/apiHandler";
import useDebounce from '../../hooks/use-debounce';
import { Grid } from 'react-loader-spinner';
import { atom, useAtom } from 'jotai';
import AddDeckPopover from "./AddDeckPopover";
import { cardPageState, deckPageState } from './header';
import { isEmpty } from 'lodash';

export const personAtom = atom(null);
export const deckList = atom([]);
export const factionSelected = atom(null);
export const deckMenuStatus = atom(false);


const Cards = () => {
    const [sorterVariable, setSorterVariable] = React.useState("alph");
    const [searchFilter, setSearchFilter] = React.useState('');
    const debouncedFilter = useDebounce(searchFilter, 228);
    const [person, setPerson] = useAtom(personAtom);
    const [decks] = useAtom(deckList);
    const [dMenuStatus, setDMenuStatus] = useAtom(deckMenuStatus);
    const addDeckRef = useRef();
    const [cardPage] = useAtom(cardPageState);
    const [deckPage] = useAtom(deckPageState);
    const [chosenDeck] = useAtom(singleDeck);

    const toggleMenu = () => {
        addDeckRef.current.toggleMenu();
        setDMenuStatus(!dMenuStatus);
    }

    const {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData,
    } = useQuery(['people', debouncedFilter], () => filterPeople(debouncedFilter), {
        enabled: cardPage
    });

    const sortBySorter = (array, sorter) => {
        if (!sorter) return array;
        if (sorter === 'alph') {
            return array.sort((a, b) => a.name.localeCompare(b.name));
        };
        if (sorter === 'youngest') {
            return array.sort((a, b) => {
                return parseInt(a.birth_year) - parseInt(b.birth_year);
            });
        }
        if (sorter === 'oldest') {
            return array.sort((a, b) => {
                return parseInt(b.birth_year) - parseInt(a.birth_year);
            }
            );
        }
    }

    return (
        <div>
            {cardPage ?
        <div>
        
        <div>
            {person == null &&
            <div className={styles.filterrow}>
                <input onChange={e => setSearchFilter(e.target.value)} className={styles.search} type="text" placeholder="Search" />
                <span className={styles.cardfilter}>
                    <div onClick={() => setSorterVariable('alph')} className={sorterVariable == 'alph' ? styles.filtercomponents : styles.filtercomponents2}>
                        <div className={styles.title}>A to Z</div>
                    </div>
                    <div onClick={() => setSorterVariable('youngest')} className={sorterVariable == 'youngest' ? styles.filtercomponents : styles.filtercomponents2}>
                        <div className={styles.title}>Youngest</div>
                    </div>
                    <div onClick={() => setSorterVariable('oldest')} className={sorterVariable == 'oldest' ? styles.filtercomponents : styles.filtercomponents2}>
                        <div className={styles.title}>Eldest</div>
                    </div>
                </span>
            </div>
}

            {person == null && 
                !isLoading && !isError ? (
                    <div className={styles.cardholder}>
                        {sortBySorter(data.results, sorterVariable).map((item, index) => {
                            return (
                                <div key={index} >
                                    <CardComponent key={index} person={item} />
                                </div>
                            )
                        }
                        )
                        }
                    </div>
                )
                    : person == null && isLoading && !isError ? (
                        <div className={styles.loader}>
                            <Grid ariaLabel='loading-indicator' type="TailSpin" color="#00BFFF" height={100} width={100} />
                        </div>
                    )
                        : person != null && !isError && !isLoading ? (
                            <div className={styles.cardholder}> 
                            <Card />
                            </div>
                        ) 
          : ''  }
        
        </div>
        </div> : deckPage ? <div>
            <div className={styles.filterrow}>
                <input className={styles.search} type="text" placeholder="Search" />
                <div onClick={toggleMenu} className={dMenuStatus ? styles.deckaddinvert : styles.deckadd}>
                    <svg className={styles.svgdeckselector} width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1.49998V11.5" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M1 6.49998H11" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <AddDeckPopover ref={addDeckRef} />
            </div>
            {decks?.length == 0 ?
            <div>
            <div className={styles.deckemptymessage}>
                <span>
                    No Decks Created. Please create a Deck by pressing the Add Deck
                    <div className={styles.deckadd2}>
                        <svg className={styles.svgdeckselector} width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 1.49998V11.5" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1 6.49998H11" stroke="#3B3B3B" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    button above.
                </span>
            </div> : 

            </div>
            : <div className={styles.cardholder}>
                {!isEmpty(decks) &&
                chosenDeck == null ? (
                decks.map((deck, index) => {
                    return (
                    <CardComponent key={index} deck={deck} />
                    )
                })
                ) : chosenDeck != null ? (
                    chosenDeck.cards.map((card, index) => {
                        return (
                            <CardComponent key={index} card={card} />
                        )
                    }
                    )) :
                    chosenDeck != null && chosenDeck.cards.length == 0 ? (
                        <div className={styles.deckemptymessage}>
                            <span>
                                No Cards in Deck. Please add cards to the deck.
                            </span>
                        </div>
                    ) : 
                    ''}
                </div>
}
        </div> : ''
}
        </div>
    );

}

export default Cards;