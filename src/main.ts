import './style.css';

const button = document.getElementById('submission-button') as HTMLButtonElement | null;
const userInput = document.getElementById('user-input') as HTMLTextAreaElement | null;
const systemInput = document.getElementById('system-input') as HTMLInputElement | null;
const responseOutput = document.getElementById('response') as HTMLElement | null;

async function sendInput() {
    if (!userInput || !systemInput || !responseOutput) {
        console.error('Required DOM elements are missing.');
        return;
    }

    const inputText = userInput.value.trim();
    const systemPrompt = systemInput.value.trim();
    if (!inputText || !systemPrompt) {
        responseOutput.textContent = 'Inputs cannot be empty.';
        return;
    }

    try {
        // Fetch web content from the backend server
        const webContentResponse = await fetch('http://localhost:3000/fetch-web-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: 'https://www.mitzvah.capital/' })
        });

        if (!webContentResponse.ok) {
            throw new Error(`Error fetching web content: ${webContentResponse.status}`);
        }

        const webContentData = await webContentResponse.json();
        const webContent = webContentData.content;

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "assistant", content: webContent },
                    { role: "user", content: inputText }
                ]
            })
        });

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            throw new Error(`Error: ${openaiResponse.status} - ${errorText}`);
        }

        const data = await openaiResponse.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            responseOutput.textContent = data.choices[0].message.content.trim();
        } else {
            throw new Error('Unexpected response structure');
        }
    } catch (error) {
        if (error instanceof Error) {
            responseOutput.textContent = `Error: ${error.message}`;
        } else {
            responseOutput.textContent = 'An unknown error occurred';
        }
    }
}

if (button) {
    button.addEventListener('click', sendInput);
} else {
    console.error('Button element not found.');
}
