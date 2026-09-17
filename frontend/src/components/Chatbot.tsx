import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";

import { sendChatMessage } from "../services/api";


type Message = {
  role: "user" | "assistant";
  content: string;
};


export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm FinAI Assistant. Ask me about your portfolio, profit and loss, or financial news sentiment.",
    },
  ]);


  async function handleSend() {
    const trimmedMessage = input.trim();

    if (!trimmedMessage || loading) {
      return;
    }


    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
    };


    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");

    setLoading(true);


    try {
      const data = await sendChatMessage(
        trimmedMessage
      );


      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.response ||
          "I couldn't generate a response.",
      };


      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

    } catch (error) {
      console.error(
        "Chatbot request failed:",
        error
      );


      const errorMessage: Message = {
        role: "assistant",
        content:
          "I couldn't connect to the FinAI assistant. Please try again.",
      };


      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);

    } finally {
      setLoading(false);
    }
  }


  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      void handleSend();
    }
  }


  return (
    <>
      {/* Floating AI button */}

      {!isOpen && (
        <button
          className="finai-chat-button"
          onClick={() => setIsOpen(true)}
          aria-label="Open FinAI Assistant"
        >
          <Sparkles size={22} />
        </button>
      )}


      {/* Chat window */}

      {isOpen && (
        <div className="finai-chat-window">

          {/* Header */}

          <div className="finai-chat-header">
            <div className="finai-chat-header-info">

              <div className="finai-chat-logo">
                <Bot size={20} />
              </div>

              <div>
                <h3>FinAI Assistant</h3>
                <span>
                  <span className="finai-online-dot" />
                  AI Financial Assistant
                </span>
              </div>

            </div>


            <button
              className="finai-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>


          {/* Messages */}

          <div className="finai-chat-messages">

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "finai-message-row user"
                    : "finai-message-row assistant"
                }
              >

                {message.role === "assistant" && (
                  <div className="finai-message-avatar">
                    <Bot size={16} />
                  </div>
                )}


                <div
                  className={
                    message.role === "user"
                      ? "finai-message user-message"
                      : "finai-message assistant-message"
                  }
                >
                  {message.content}
                </div>

              </div>
            ))}


            {loading && (
              <div className="finai-message-row assistant">

                <div className="finai-message-avatar">
                  <Bot size={16} />
                </div>

                <div className="finai-message assistant-message">
                  <div className="finai-typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

              </div>
            )}

          </div>


          {/* Input */}

          <div className="finai-chat-input-area">

            <input
              type="text"
              value={input}
              placeholder="Ask FinAI anything..."
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              disabled={loading}
            />


            <button
              onClick={() => void handleSend()}
              disabled={
                loading ||
                !input.trim()
              }
              aria-label="Send message"
            >
              <Send size={18} />
            </button>

          </div>


          <div className="finai-chat-disclaimer">
            AI insights are informational, not financial advice.
          </div>

        </div>
      )}
    </>
  );
}