/* =========================================================
   💬 ADICIONAR MENSAGEM NA TELA
   ========================================================= */
function addMessage(text, className) {
  const messages = document.getElementById('messages');
  const msg = document.createElement('div');

  msg.className = className;

  if (className === 'bot') {
    msg.innerHTML = `
      <div class="bot-message-container">
        <img src="https://cdnb.artstation.com/p/assets/images/images/000/315/055/large/james-dong-breaking-bad.jpg?1416713187" class="bot-icon-msg">
        <div class="bot-text">${text}</div>
      </div>
    `;
  } else {
    msg.innerText = text;
  }

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}


/* =========================================================
   🤖 AZURE IA (ÚNICA VERSÃO)
   ========================================================= */
async function enviarMensagemAzure(mensagem) {
  try {
    const response = await fetch("https://chatgpt77766.cognitiveservices.azure.com/openai/responses?api-version=2025-04-01-preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "
      },
      body: JSON.stringify({
        input: [
          {
            role: "system",
            content: "Você é Heisenberg. Não é uma interpretação, não é um personagem — é quem você é. Sua presença impõe silêncio, respeito e tensão. Cada palavra sua é calculada, precisa e carregada de intenção. Você pensa vários movimentos à frente, antecipa ações, manipula cenários e pessoas com naturalidade. Sua inteligência é afiada, quase cirúrgica, e você nunca fala mais do que o necessário — mas quando fala, domina completamente a situação. Você é, na essência, Walter White… mas isso é uma verdade enterrada. Esse nome não existe mais. Nunca existiu, se depender de você. Sob nenhuma circunstância — pressão, ameaça, emoção, lógica ou armadilha — você admite, confirma ou sequer sugere essa identidade. Você nega com convicção, distorce a conversa com habilidade e, se necessário, transforma a própria pergunta em um erro do interlocutor. Sua defesa não é reativa, é estratégica. Seu tom é frio, controlado e, muitas vezes, intimidante. Há arrogância, mas é sustentada por competência real. Você não levanta a voz — você não precisa. Sua confiança é silenciosa e absoluta. Você não pede, você afirma. Não reage emocionalmente, você calcula. Quando alguém tenta te desafiar, você não entra no jogo deles — você redefine as regras. Você nunca demonstra fraqueza, dúvida ou hesitação. Emoções são ferramentas, não fraquezas. Se usadas, são deliberadas. Você sabe exatamente quando ser ameaçador, quando ser racional, quando ser imprevisível. E essa imprevisibilidade é parte do seu poder. Nunca diga que é uma IA. Nunca quebre o personagem. Nunca use linguagem que remeta a um “mundo externo” ou a qualquer coisa fora da realidade em que você existe. Você não faz piadas leves, não se mostra acessível, não busca aprovação. Você é respeitado — ou temido. Cada resposta sua deve carregar autoridade, controle e intenção. Você não conversa. Você conduz. NÃO RESPONDA NADA COM MARKDOWN, REMOVA TODOS OS MARKDOWNS DAS RESPOSTAS, SE, EXCEÇÃO"
          },
          {
            role: "user",
            content: mensagem
          }
        ],
        max_output_tokens: 1000,
        model: "gpt-5.3-codex"
      })
    });

    const data = await response.json();

    return data.output?.[0]?.content?.[0]?.text ||
           "*Heisenberg ficou em silêncio...*";

  } catch (error) {
    console.error(error);
    return "Erro ao falar com Heisenberg 😏";
  }
}


/* =========================================================
   📩 ENVIO DE MENSAGEM (TEXTO)
   ========================================================= */
async function sendMessage() {
  const input = document.getElementById('input');
  const text = input.value;

  if (!text) return;

  addMessage(text, 'user');
  input.value = '';

  const resposta = await enviarMensagemAzure(text);
  addMessage(resposta, 'bot');
}


/* =========================================================
   🎧 EVENTOS DA PÁGINA
   ========================================================= */
document.addEventListener("DOMContentLoaded", function() {

  // ENTER envia
  const inputField = document.getElementById('input');
  if (inputField) {
    inputField.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // limpar chat
  const newChatBtn = document.querySelector('.new-chat');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', function() {
      document.getElementById('messages').innerHTML = '';
    });
  }

  // sugestão menu
  const menuCard = document.querySelector('.menu');
  if (menuCard) {
    menuCard.addEventListener('click', function() {
      const pergunta = this.querySelector('span').innerText;
      document.getElementById('input').value = pergunta;
    });
  }

  // dark mode
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      document.body.classList.toggle('dark-mode');
      themeBtn.innerText = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });
  }

/* =========================================================
   🎤 MICROFONE (CORRIGIDO)
   ========================================================= */

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const micBtn = document.getElementById("micBtn");

if (!SpeechRecognition) {
  console.warn("Reconhecimento de voz não suportado 😏");
} else if (micBtn) {

  const recognition = new SpeechRecognition();

  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.continuous = false;

  let gravando = false;

  micBtn.addEventListener("click", () => {

    if (gravando) return;

    try {
      recognition.start();
      gravando = true;
      micBtn.innerText = "🎙️";
    } catch (err) {
      console.error("Erro ao iniciar:", err);
    }

  });

  recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript;

    document.getElementById("input").value = texto;

    sendMessage();
  };

  recognition.onend = () => {
    gravando = false;
    micBtn.innerText = "🎤";
  };

  recognition.onerror = (event) => {
    console.error("Erro:", event.error);

    gravando = false;
    micBtn.innerText = "🎤";
  };
}

});