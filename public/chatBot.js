(function () {

    const API_URL = "http://localhost:3000/api/chat";

    const scriptTag = document.currentScript;
    const ownerId = scriptTag?.getAttribute("data-owner-id");

    if (!ownerId) {
        console.error("Chatbot Error: owner id not found");
        return;
    }

    const button = document.createElement("div");
    button.innerHTML = "💬";

    Object.assign(button.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        background: "#000",
        color: "#fff",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "26px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
        zIndex: "9999"
    })
    document.body.appendChild(button)

    const box = document.createElement("div")

    Object.assign(box.style, {
        position: "fixed",
        bottom: "90px",
        right: "24px",
        width: "320px",
        height: "420px",
        background: "#fff",
        borderRadius: "14px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        display: "none",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: "999999",
        fontFamily: "Inter, system-ui, sans-serif",
    })

    box.innerHTML = `
      <div style=" 
        display:flex;
        padding:12px 14px;
        background:#000;
        color: #fff ;
        font-size:14px;
        justify-content:space-between;
        align-items:center;
      ">

      <span> CHATBOT-AI Services </span>
      <span id="chatClose" style="cursor:pointer
;font-size:16px"> X </span>
      </div>
      <div id="chat-msg" style="flex:1;
      padding:12px;
      overflow-y:auto;
      background:#f9fafb;
      display:flex;
      flex-direction:column"></div>

    <div style="
    display:flex;
    border-top:1px solid #e5e7eb;
    padding:8px;
    gap:6px;
    ">
        <input id="chat-input" type="text"style="flex:1;
        padding:8px 10px;
        border:1px solid #d1d5db;
        border-radius:8px;
font-size:13px;
outline:none;
        " placeholder="Type text here..."/>
        <button id="chat-submit" style="
            padding:8px 12px;
            border:none;
            background:#000;
            color:#fff;
            border-radius:8px;
            font-size:13px;
            cursor:pointer; 
        " > Send </button>
    </div>

    `
    document.body.appendChild(box)

    button.onclick = () => {
        box.style.display = box.style.display === "none" ? "flex" : "none "
    }

    document.querySelector("#chatClose").onclick = () => {
        box.style.display = "none"
    }

    const input = document.querySelector("#chat-input")
    const subBtn = document.querySelector("#chat-submit")
    const messagePoint = document.querySelector("#chat-msg")

    function addMessage(text, from) {
        const bubble = document.createElement("div")
        bubble.innerHTML = text
        Object.assign(bubble.style, {
            maxWidth: "78%",
            padding: "8px 12px",
            borderRadius: "14px",
            fontSize: "13px",
            lineHeight: "1.4",
            marginBottom: "8px",
            alignSelf: from === "user" ? "flex-end" : "flex-start",
            background: from === "user" ? "#000" : "#e5e7eb",
            color: from === "user" ? "#fff" : "#111",

            /* bubble direction polish */
            borderTopRightRadius: from === "user" ? "4px" : "14px",
            borderTopLeftRadius: from === "user" ? "14px" : "4px",
        })

        messagePoint.appendChild(bubble)
        messagePoint.scrollTop = messagePoint.scrollHeight
    }
    subBtn.onclick = async () => {

        const text = input.value.trim();
        if (!text) return;
 
        // Disable input + button
        input.disabled = true;
        subBtn.disabled = true;
        subBtn.style.opacity = "0.6";
        subBtn.style.cursor = "not-allowed";

        addMessage(text, "user");
        input.value = "";

        // Typing indicator
        const typing = document.createElement("div");
        typing.innerHTML = "Typing...";
        Object.assign(typing.style, {
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "8px",
            alignSelf: "flex-start",
        });

        messagePoint.appendChild(typing);
        messagePoint.scrollTop = messagePoint.scrollHeight;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ownerId,
                    message: text
                })
            });

            const data = await response.json();

            messagePoint.removeChild(typing);

            addMessage(data.reply || "Something went wrong", "ai");

        } catch (error) {
            messagePoint.removeChild(typing);
            addMessage("Server error. Please try again.", "ai");
        }

        // Re-enable input + button
        input.disabled = false;
        subBtn.disabled = false;
        subBtn.style.opacity = "1";
        subBtn.style.cursor = "pointer";
        input.focus();
    };

})();