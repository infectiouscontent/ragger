async function sendInput() {
    const userInput = document.getElementById('user-input') as HTMLInputElement | null;
    const systemInput = document.getElementById('system-input') as HTMLInputElement | null;
    const assistantUrlInput = document.getElementById('assistant-url-input') as HTMLInputElement | null;
    const assistantFallbackInput = document.getElementById('assistant-fallback-input') as HTMLInputElement | null;
    const responseOutput = document.getElementById('response') as HTMLElement | null;

    if (!userInput || !systemInput || !assistantUrlInput || !assistantFallbackInput || !responseOutput) {
        console.error('Required DOM elements are missing.');
        return;
    }

    const inputText = userInput.value.trim();
    const systemText = systemInput.value.trim();
    const assistantUrlText = assistantUrlInput.value.trim();
    const assistantFallbackText = assistantFallbackInput.value.trim();

    if (!inputText) {
        responseOutput.textContent = 'Input cannot be empty.';
        return;
    }

    let webData = { content: assistantFallbackText }; // Default value from input

    try {
        // Attempt to fetch web content from the provided URL
        const webResponse = await fetch(assistantUrlText);
        if (webResponse.ok) {
            webData = await webResponse.json(); // Update with actual data if fetch succeeds
        } else {
            console.error(`Error fetching web content: ${webResponse.status} - ${await webResponse.text()}`);
        }
    } catch (error) {
        console.error('Failed to fetch web content:', error);
        // Default webData is already set, so no further action needed
    }

    try {
        // Prepare the messages array for the OpenAI API request
        const messages = [
            { role: "system", content: systemText },
            { role: "user", content: inputText },
            { role: "assistant", content: webData.content }
        ];

        // Send a request to the OpenAI API
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages
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