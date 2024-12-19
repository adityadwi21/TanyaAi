"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { marked } from "marked";
import { FaCircle, FaExclamationTriangle, FaExclamationCircle } from "react-icons/fa";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");
  const [token, setToken] = useState(10);
  const [showModal, setShowModal] = useState(false);

  const chatContainerRef = useRef(null);

  const loadChatFromLocalStorage = useCallback(() => {
    const savedChat = localStorage.getItem("chat");
    const savedToken = localStorage.getItem("token");
    const savedWarnings = localStorage.getItem("warnings");

    if (savedChat) {
      setResponse(JSON.parse(savedChat));
    }
    if (savedToken) {
      setToken(parseInt(savedToken, 10));
    }
    if (savedWarnings) {
      setWarning(JSON.parse(savedWarnings));
    }
  }, []);

  useEffect(() => {
    loadChatFromLocalStorage();
  }, [loadChatFromLocalStorage]);

  const saveChatToLocalStorage = (chat) => {
    localStorage.setItem("chat", JSON.stringify(chat));
  };

  const saveTokenToLocalStorage = (token) => {
    localStorage.setItem("token", token.toString());
  };

  const saveWarningToLocalStorage = (warnings) => {
    localStorage.setItem("warnings", JSON.stringify(warnings));
  };

  const clearChat = () => {
    localStorage.removeItem("chat");
    localStorage.removeItem("token");
    localStorage.removeItem("warnings");
    setResponse([]);
    setToken(10);
    setWarning([]);
    setShowModal(false);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleResponse = (text) => {
    return marked(text);
  };

  const detectInappropriateWords = useCallback((text) => {
    const inappropriateWords = ["anjing", "babi", "bangsat", "asu", "jancok"];
    return inappropriateWords.some((word) => text.toLowerCase().includes(word));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    if (token <= 0) {
      setShowModal(true);
      return;
    }

    setLoading(true);

    let newWarning = "";
    if (detectInappropriateWords(prompt)) {
      newWarning = "Peringatan: Pesan ini mengandung kata-kata yang tidak pantas.";
    }

    setWarning(newWarning);

    const warnings = JSON.parse(localStorage.getItem("warnings")) || [];
    if (newWarning) {
      warnings.push({ id: Date.now() });
      saveWarningToLocalStorage(warnings);
    }

    const newChat = [...response, { id: Date.now(), role: "user", text: prompt }];
    setResponse(newChat);
    saveChatToLocalStorage(newChat);
    setPrompt("");
    setToken((prevToken) => {
      const newToken = prevToken - 1;
      saveTokenToLocalStorage(newToken);
      return newToken;
    });

    try {
      const modifiedPrompt = `Jawab pertanyaan ini dalam bahasa Indonesia: ${prompt}`;

      const res = await fetch("/api/generateResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: modifiedPrompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      const updatedChat = [...newChat, { id: Date.now(), role: "bot", text: data.response }];
      setResponse(updatedChat);
      saveChatToLocalStorage(updatedChat);
    } catch (error) {
      console.error("Error:", error);
      const errorChat = [...newChat, { id: Date.now(), role: "bot", text: "Maaf, ada yang salah." }];
      setResponse(errorChat);
      saveChatToLocalStorage(errorChat);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [response]);

  const tokenDisplay = useMemo(
    () => (
      <div className="flex items-center">
        <FaExclamationCircle className="text-blue-400 w-5 h-5 cursor-pointer mr-2" title="Token anda, melakukan chat" />
        <div className="text-sm text-gray-600">
          Token anda: <strong>{token}</strong>
        </div>
      </div>
    ),
    [token]
  );

  const loadingIndicator = useMemo(
    () =>
      loading && (
        <div className="flex justify-start mb-3">
          <div className="max-w-xs p-3 rounded-lg bg-gray-300">
            <div className="flex items-center space-x-1">
              <FaCircle className="w-3 h-3 text-gray-500 animate-pulse delay-150" />
              <FaCircle className="w-3 h-3 text-gray-500 animate-pulse delay-300" />
              <FaCircle className="w-3 h-3 text-gray-500 animate-pulse delay-450" />
            </div>
          </div>
        </div>
      ),
    [loading]
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl sm:max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-xl font-semibold text-center text-black">Tanya AI</h1>
          {tokenDisplay}
        </div>

        {/* Chat Display */}
        <div ref={chatContainerRef} className="h-96 overflow-y-auto mb-4 border p-4 rounded-lg bg-gray-50">
          {response.map((message) => {
            const warnings = JSON.parse(localStorage.getItem("warnings")) || [];
            const isWarning = warnings.some((warning) => warning.id === message.id);

            return (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-3`}>
                {message.role === "user" && isWarning && (
                  <div className="flex items-center pr-2">
                    <FaExclamationTriangle className="text-yellow-500 w-6 h-6 cursor-pointer" title="Pesan ini mengandung kata-kata yang tidak pantas." />
                  </div>
                )}
                <div className={`max-w-xs sm:max-w-md p-3 rounded-lg ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`} dangerouslySetInnerHTML={{ __html: handleResponse(message.text) }} />
              </div>
            );
          })}

          {loadingIndicator}
        </div>

        {/* Input and Submit Form */}
        <form onSubmit={handleSubmit} className="flex items-center mb-4">
          <input type="text" className="w-full p-3 text-black border rounded-l-lg border-gray-300" placeholder="Ask something..." value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-r-lg">
            Send
          </button>
        </form>

        {/* Clear Chat Button */}
        <button onClick={clearChat} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg mt-4">
          Clear Chat
        </button>

        {/* Powered by Gemini */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Powered by <strong>Gemini AI</strong>
          </p>
        </div>
      </div>

      {/* Modal Popup for Token Expiry Warning */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl text-red-600 font-semibold">Peringatan!</h2>
            <p className="mt-2 text-black">Token habis! Silakan hapus percakapan sebelumnya untuk melanjutkan.</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
