"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../icons/Icons";

export function ChatDrawer() {
  const { isChatOpen, openChat, closeChat, chatMessages, sendChat, askChat } =
    useApp();
  const [inputText, setInputText] = useState("");
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendChat(inputText);
    setInputText("");
  };

  return (
    <>
      <button type="button" className="chat-fab" onClick={openChat}>
        <span className="dot"></span> Ask INTERN
      </button>

      <div
        className={`drawer-veil ${isChatOpen ? "on" : ""}`}
        id="chatVeil"
        onClick={closeChat}
      ></div>

      <aside className={`chat ${isChatOpen ? "on" : ""}`} id="chat">
        <div className="chat-h">
          <div>
            <b>INTERN assistant</b>
            <div className="st">
              <i></i> knows placements, requirements and your record
            </div>
          </div>
          <button type="button" onClick={closeChat} aria-label="Close">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="chat-b" id="chatLog" ref={chatLogRef}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`msg ${msg.who === "INTERN" ? "bot" : "me"}`}
            >
              {msg.who === "INTERN" && <div className="who">INTERN</div>}
              {msg.isTyping ? (
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: "10px",
                    letterSpacing: ".25em",
                  }}
                >
                  ···
                </span>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              )}
            </div>
          ))}
        </div>

        <div className="chat-q">
          <button
            type="button"
            onClick={() => askChat("Am I eligible for the Data Analyst Intern?")}
          >
            Am I eligible?
          </button>
          <button
            type="button"
            onClick={() => askChat("What documents do I still need?")}
          >
            What do I need to upload?
          </button>
          <button
            type="button"
            onClick={() => askChat("Which government placements are open?")}
          >
            Government placements
          </button>
          <button
            type="button"
            onClick={() => askChat("How does verification work?")}
          >
            How verification works
          </button>
        </div>

        <div className="chat-in">
          <input
            id="chatText"
            placeholder="Ask about a placement, a requirement or your file"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button type="button" onClick={handleSend} aria-label="Send">
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </aside>
    </>
  );
}
