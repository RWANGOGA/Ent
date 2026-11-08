"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Icon } from "../icons/Icons";
import { AdvisorAction } from "../../types";

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

  const handleAction = (action: AdvisorAction) => {
    // Handle different action types
    switch (action.type) {
      case "navigate":
        if (action.payload.dashboard) {
          // The dashboard navigation is handled via hash routing
          window.location.hash = String(action.payload.dashboard);
        }
        break;
      case "apply":
        // Could trigger apply modal
        sendChat(`Apply to ${String(action.payload.placementTitle || "this placement")}`);
        break;
      case "check_eligibility":
        sendChat(`Am I eligible for ${String(action.payload.placementTitle || "this placement")}?`);
        break;
      case "open_placement":
        sendChat(`Tell me about ${String(action.payload.placementTitle || "this placement")}`);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <button type="button" className="chat-fab" onClick={openChat}>
        <span className="dot"></span> Ask BrighterWorks
      </button>

      <div
        className={`drawer-veil ${isChatOpen ? "on" : ""}`}
        id="chatVeil"
        onClick={closeChat}
      ></div>

      <aside className={`chat ${isChatOpen ? "on" : ""}`} id="chat">
        <div className="chat-h">
          <div>
            <b>BrighterWorks assistant</b>
            <div className="st">
              <i></i> knows your skills, placements and your record
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
              {msg.who === "INTERN" && <div className="who">BrighterWorks</div>}
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
                <>
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  {msg.actions && msg.actions.length > 0 && (
                    <div
                      className="msg-actions"
                      style={{ marginTop: "8px", display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      {msg.actions.map((action: AdvisorAction, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          className="btn btn-sm"
                          style={{ fontSize: "11px" }}
                          onClick={() => handleAction(action)}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </>
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
            onClick={() => askChat("Which placement fits me best?")}
          >
            Which placement fits me best?
          </button>
          <button
            type="button"
            onClick={() => askChat("What should I learn to get more matches?")}
          >
            What should I learn?
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
