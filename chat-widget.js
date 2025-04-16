
(function() {
  const style = document.createElement("style");
  style.textContent = `
    #chat-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #25dffe;
      color: white;
      border: none;
      border-radius: 30px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 16px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 99999;
      transition: all 0.3s ease;
    }

    #chat-button:hover {
      animation: pulse 1.3s infinite;
      background-color: #20c9e4;
    }

    #chat-button img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: contain;
      background: white;
      padding: 2px;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    #chat-box {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 320px;
      height: 400px;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 10px;
      display: none;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      font-family: sans-serif;
      z-index: 99999;
      overflow: hidden;
    }

    #chat-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-size: 14px;
      background-color: #f9f9f9;
      color: #000;
    }

    .msg {
      margin: 6px 0;
      padding: 6px 10px;
      border-radius: 10px;
      max-width: 80%;
      word-wrap: break-word;
    }

    .user {
      text-align: right;
      background-color: #25dffe;
      color: white;
      margin-left: auto;
    }

    .bot {
      text-align: left;
      background-color: #eee;
      color: #333;
      margin-right: auto;
    }

    #chat-input {
      display: flex;
      border-top: 1px solid #ddd;
      background-color: #ffffff;
      flex-shrink: 0;
    }

    #chat-input input {
      flex: 1;
      padding: 10px;
      border: none;
      font-size: 14px;
      color: #000;
      background: #ffffff;
      outline: none;
    }

    #chat-input button {
      padding: 10px 14px;
      background-color: #25dffe;
      color: white;
      border: none;
      font-size: 16px;
      cursor: pointer;
    }

    #chat-input button:hover {
      background-color: #20c9e4;
    }
  `;
  document.head.appendChild(style);

  const html = `
    <div id="chat-button">
      <img src="https://i.postimg.cc/HW985pCg/Nova.png" alt="Nova" />
      <span>Nova</span>
    </div>
    <div id="chat-box">
      <div id="chat-messages"></div>
      <div id="chat-input">
        <input type="text" id="user-input" placeholder="Escribí tu mensaje..." />
        <button onclick="sendMessage()">➤</button>
      </div>
    </div>
  `;
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);

  const chatButton = document.getElementById("chat-button");
  const chatBox = document.getElementById("chat-box");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");

  const WEBHOOK_URL = "https://toby13.app.n8n.cloud/webhook-test/chat-web";

  chatButton.onclick = () => {
    const isVisible = chatBox.style.display === "flex";
    chatBox.style.display = isVisible ? "none" : "flex";

    if (!isVisible && chatMessages.innerHTML.trim() === "") {
      chatMessages.innerHTML += \`
        <div class="msg bot">
          👋 ¡Hola! Soy <b>Nova</b>, el asistente virtual de <b>BIOGrowth AI</b>.<br>
          ¿En qué puedo ayudarte hoy?
        </div>\`;
    }
  };

  window.sendMessage = () => {
    const message = userInput.value.trim();
    if (!message) return;

    chatMessages.innerHTML += \`<div class="msg user">\${message}</div>\`;
    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      chatMessages.innerHTML += \`<div class="msg bot">\${data.respuesta || "Sin respuesta"}</div>\`;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(err => {
      chatMessages.innerHTML += \`<div class="msg bot">Error al conectar con Nova.</div>\`;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  };

  userInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });

  chatButton.addEventListener("click", () => {
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
  });
})();
