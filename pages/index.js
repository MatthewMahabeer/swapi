import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Header, { cardPageState, deckPageState} from '../components/dash/header'
import AllCards from '../components/dash/AllCards'
import { useAtom } from 'jotai'

export default function Home() {
  const [cardsActive] = useAtom(cardPageState)
  const [decksActive] = useAtom(deckPageState)

  return (
    <div className={styles.container}>
     <Header />
      <hr className={styles.pagedivider} />
      <AllCards />
    </div>
  )
}
