const button = document.getElementById('submission-button') as HTMLButtonElement | null;
const systemInput = document.getElementById('system-input') as HTMLInputElement | null;
const userInput = document.getElementById('user-input') as HTMLTextAreaElement | null;
const responseOutput = document.getElementById('response') as HTMLElement | null;

async function sendInput() {
    if (!systemInput || !userInput || !responseOutput) {
        console.error('Required DOM elements are missing.');
        return;
    }

    const systemText = systemInput.value.trim();
    const userText = userInput.value.trim();

    if (!userText) {
        responseOutput.textContent = 'User input cannot be empty.';
        return;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemText },
                    { role: "user", content: userText }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
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