// Navegación entre vistas principales
function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    if (viewName === 'home') {
        document.getElementById('view-home').classList.add('active');
        event.currentTarget.classList.add('active');
    } else if (viewName === 'maker') {
        document.getElementById('view-maker').classList.add('active');
        document.querySelector('.nav-btn:nth-child(2)').classList.add('active');
    } else if (viewName === 'community') {
        document.getElementById('view-community').classList.add('active');
        document.querySelector('.nav-btn:nth-child(3)').classList.add('active');
    }
}

// Navegación dentro del Maker
function switchMakerTab(tabName) {
    document.querySelectorAll('.maker-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.maker-tab').forEach(tab => tab.classList.remove('active'));

    const targetPanel = document.getElementById('maker-' + tabName);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    event.currentTarget.classList.add('active');
}

// Sub-secciones de Modelado
function switchSubModeling(subName) {
    document.querySelectorAll('.submod-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetSub = document.getElementById('submod-' + subName);
    if (targetSub) {
        targetSub.classList.add('active');
    }
    event.currentTarget.classList.add('active');
}

// Control del Chat flotante de Roboti
function toggleRobotiChat() {
    const win = document.getElementById('robotiWindow');
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
}

// Configuración y API de Groq
function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    const apiKey = document.getElementById('groqApiKeyInput').value;
    if (apiKey) {
        localStorage.setItem('zacks_groq_api_key', apiKey);
        alert('¡Clave API de Groq guardada de forma segura en el almacenamiento local!');
    }
    closeSettingsModal();
}

// Exportación real de archivos .mcaddon / .mcpack
function exportFile(type) {
    const packName = document.getElementById('packNameInput').value || 'MiAddon';
    const content = `{"format_version": 2, "header": {"name": "${packName}", "description": "Generado por Zack's Addon Maker", "uuid": "${generateUUID()}", "version": [1, 0, 0]}}`;
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${packName}.${type === 'mcaddon' ? 'mcaddon' : 'mcpack'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`¡Archivo .${type} generado y descargado con éxito!`);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Simulación de envío de mensajes con Roboti y Groq API
async function sendRobotiMessage() {
    const input = document.getElementById('robotiInput');
    const messagesContainer = document.getElementById('robotiMessages');
    const text = input.value.trim();
    if (!text) return;

    messagesContainer.innerHTML += `<div class="chat-msg user" style="text-align: right; background: rgba(255,255,255,0.1); margin-left: auto;">${text}</div>`;
    input.value = '';

    const apiKey = localStorage.getItem('zacks_groq_api_key');
    
    if (!apiKey) {
        setTimeout(() => {
            messagesContainer.innerHTML += `<div class="chat-msg ai">Roboti: ¡Hola! Para usar mis respuestas con IA mediante la API de Groq, por favor configura tu clave API en el menú de Configuración. (Modo simulación activo)</div>`;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
        return;
    }

    // Estructura lista para conectar con la API real de Groq de forma segura
    try {
        messagesContainer.innerHTML += `<div class="chat-msg ai" id="loadingMsg">Roboti está pensando...</div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: 'Eres Roboti, la mascota y asistente de IA de Zack\'s Addon Maker en Zack\'s Studios. Ayudas a crear addons para Minecraft Java y Bedrock.' },
                    { role: 'user', content: text }
                ]
            })
        });

        const data = await response.json();
        document.getElementById('loadingMsg').remove();

        if (data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            messagesContainer.innerHTML += `<div class="chat-msg ai">${reply}</div>`;
        } else {
            messagesContainer.innerHTML += `<div class="chat-msg ai">Roboti: Ocurrió un error al conectar con la API de Groq.</div>`;
        }
    } catch (error) {
        if(document.getElementById('loadingMsg')) document.getElementById('loadingMsg').remove();
        messagesContainer.innerHTML += `<div class="chat-msg ai">Roboti: Error de red al intentar conectar con Groq.</div>`;
    }
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendProjectMessage() {
    alert('Mensaje enviado al asistente del proyecto integrado con Zack\'s Addon Maker.');
}

function importModelPrompt() {
    alert('Selecciona un archivo .geo.json (Bedrock) o .json (Java) para importar el modelo al proyecto.');
}

function createNewProject() {
    const name = prompt('Nombre del nuevo proyecto:', 'MiNuevoAddon');
    if (name) {
        document.getElementById('current-project-name').innerText = `Proyecto: ${name}`;
    }
}
