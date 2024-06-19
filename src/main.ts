async function sendInput() {
    const userInput = document.getElementById('user-input') as HTMLTextAreaElement | null;
    const systemInput = document.getElementById('system-input') as HTMLInputElement | null;
    const responseOutput = document.getElementById('response') as HTMLElement | null;

    if (!userInput || !systemInput || !responseOutput) {
        console.error('Required DOM elements are missing.');
        return;
    }

    const inputText = userInput.value.trim();
    const systemText = systemInput.value.trim();

    if (!inputText) {
        responseOutput.textContent = 'Input cannot be empty.';
        return;
    }

    let webData;

    try {
        // Attempt to fetch web content from a local server
        const webResponse = await fetch('http://localhost:3000/api/fetch-web-content');
        if (!webResponse.ok) {
            throw new Error(`Error: ${webResponse.status} - ${await webResponse.text()}`);
        }
        webData = await webResponse.json();
    } catch (error) {
        console.error('Failed to fetch web content:', error);
        // Provide a fallback value in case of an error
        webData = { content: "Bounty Killer was a rude boy and his music is not appropriate for practicing Theravadins." };
    }

    try {
        // Send a request to the OpenAI API
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
                    { role: "user", content: inputText },
                    { role: "assistant", content: webData.content }
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

const button = document.getElementById('submission-button');
if (button) {
    button.addEventListener('click', sendInput);
} else {
    console.error('Button element not found.');
}