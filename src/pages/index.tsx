import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/custom.module.css";
import { useState } from "react";
import { FaList } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [chats, setChats] = useState([{ id: 0, word: "", status: "sender" }]);
  const [question, setQuestion] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleSubmit = async () => {
    if (question === "") {
      return;
    }
    setChats([
      ...chats,
      { id: chats.length + 1, word: question, status: "sender" },
    ]);
    setFetching(true);
    setQuestion("");
    let contextArr = [{ role: "system", content: `You are a helpful guy` }];

    if (chats[chats.length - 2]) {
      contextArr.push({
        role: "user",
        content: chats[chats.length - 2].word.slice(0, 70),
      });
    }
    if (chats[chats.length - 1] && chats[chats.length - 1].word) {
      contextArr.push({
        role: "assistant",
        content: chats[chats.length - 1].word.slice(0, 70),
      });
    }

    contextArr.push({ role: "user", content: question });
    const jsonStr = JSON.stringify(contextArr);
    fetch("https://chatchuck-380416.uc.r.appspot.com", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      // mode: "no-cors",
      body: jsonStr,
    })
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        setFetching(false);
        setChats((prev) => {
          return [
            ...prev,
            { id: chats.length + 2, word: data, status: "reply" },
          ];
        });
      })
      .catch((err) => {
        console.log(err);
        setFetching(false);
      });
  };
  return (
    <>
      <Head>
        <title>ChatChuck</title>
        <meta name="description" content="Your AI Companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={styles.nav}>
        <div>
          <h1>ChatChuckAI</h1>
        </div>
        <FaList />
        <ul>
          <li>Background</li>
          <li>Language</li>
          <li>Choose Robot</li>
        </ul>
      </nav>
      <main className={styles.main}>
        <div className={styles.logoDiv}>
          <h1>Ask me anything</h1>
          <h5>I am a robot at your service</h5>
        </div>
        <div className={styles.chatDiv}>
          <div className={styles.chatBox}>
            <div className={styles.chat}>
              {chats.map((chat, i) => {
                if (chats.length === 1) {
                  return (
                    <div key={chat.id} className={styles.nullChat}>
                      <h3>From your personal projects</h3>
                      <h4>to your deepest fears.</h4>
                      <h4>Ask me anything</h4>
                    </div>
                  );
                }
                if (i === 0) {
                  return;
                }
                return (
                  <div
                    className={
                      chat.status === "sender"
                        ? styles.chatRight
                        : styles.chatLeft
                    }
                    key={chat.id}
                  >
                    {chat.word}
                  </div>
                );
              })}
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={"Type your query here"}
            />
            <button onClick={handleSubmit} disabled={fetching}>
              Send
            </button>
          </div>
          <div className={styles.decorator}></div>
        </div>
      </main>
      <div className={styles.footnote}>
        <h4>Built by Ezeani Chucks</h4>
        <h6>email: concord_chucks2@yahoo.com</h6>
        <h6>phone: +2348067268692</h6>
      </div>
    </>
  );
}
