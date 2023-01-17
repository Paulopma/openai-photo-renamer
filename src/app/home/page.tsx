'use client'

import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from './page.module.css'
import { ChangeEvent, useState } from 'react'
import { Button } from '@mui/material'
import { motion } from 'framer-motion'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [images, setImages] = useState<string[] | never>([])
  const [name, setName] = useState('')
  const [isLeftContainerActive, setIsLeftContainerActive] = useState(false)

  const handleCopyClick = async (name: string) => {
    console.log(name)
    try {
      await navigator.clipboard.writeText(name)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const submit = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ textInput })
      })

      const suggestion: { result: string } = await res.json()
      const { result } = suggestion
      console.log('result', result)

      setResult(result)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    if (e.target.files) {
      const imagesLocal = Array.from(e.target.files)
      const imagesString: string[] = []

      imagesLocal.forEach((item) => {
        imagesString.push(URL.createObjectURL(item))
      })
      setName(name)
      setImages(imagesString)
      setIsLeftContainerActive(true)
    }
  }

  return (
    <main className={styles.main}>
      <motion.section className={styles.leftSection}>
        <textarea
          className={styles.textArea}
          placeholder="Coloque o texto da conversa aqui"
          aria-label="Use aria labels when no actual label is in use"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
        <Button onClick={submit} className={styles.button} variant="contained">
          Enviar
        </Button>
        <div className={styles.response}>
          <div className={styles.insideSquare} />
          {!loading ? (
            result
              ?.split(/\r?\n/)
              .splice(2)
              .map((item, idx) => {
                return (
                  <div className={styles.namesContainer} key={idx}>
                    <button onClick={() => handleCopyClick(item)}>
                      {item}
                    </button>
                    <input
                      onChange={(e) => {
                        onChangeImage(e, item)
                      }}
                      type="file"
                      accept="image/*"
                      multiple
                    />
                  </div>
                )
              })
          ) : (
            <div className={styles.loadingContainer}>
              <div className={styles.ldsFacebook}>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          )}
        </div>
      </motion.section>
      {isLeftContainerActive && (
        <motion.section
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          className={styles.rightSection}
        >
          <p>{name}</p>
          <div className={styles.imagesContainer}>
            {images &&
              images.map((item, idx) => {
                return (
                  <a
                    href={item}
                    download={`${name}.jpeg`}
                    type="image/jpeg"
                    key={idx}
                    className={styles.image}
                  >
                    <Image
                      style={{ objectFit: 'contain', objectPosition: 'top' }}
                      fill
                      src={item}
                      alt="person"
                    />
                  </a>
                )
              })}
          </div>
        </motion.section>
      )}
    </main>
  )
}
