/**
 * Asynchronously sends user and system input to the OpenAI API and displays the response.
 */
async function sendInput() {
    // Get DOM elements for user input, system input, and response output
    const userInput = document.getElementById('user-input') as HTMLTextAreaElement | null;
    const systemInput = document.getElementById('system-input') as HTMLInputElement | null;
    const responseOutput = document.getElementById('response') as HTMLElement | null;

    // Check if required DOM elements are present
    if (!userInput || !systemInput || !responseOutput) {
        console.error('Required DOM elements are missing.');
        return;
    }

    // Get and trim input values
    const inputText = userInput.value.trim();
    const systemText = systemInput.value.trim();

    // Validate user input
    if (!inputText) {
        responseOutput.textContent = 'Input cannot be empty.';
        return;
    }

    try {
        // Fetch web content from a local server
        const webResponse = await fetch('http://localhost:3000/api/fetch-web-content');
        if (!webResponse.ok) {
            throw new Error(`Error: ${webResponse.status} - ${await webResponse.text()}`);
        }
        const webData = await webResponse.json();

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

        // Handle potential errors in the response
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        // Parse the response and display it
        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            responseOutput.textContent = data.choices[0].message.content.trim();
        } else {
            throw new Error('Unexpected response structure');
        }
    } catch (error) {
        // Handle and display errors
        if (error instanceof Error) {
            responseOutput.textContent = `Error: ${error.message}`;
        } else {
            responseOutput.textContent = 'An unknown error occurred';
        }
    }
}

// Add event listener to the button to trigger the sendInput function on click
const button = document.getElementById('submission-button');
if (button) {
    button.addEventListener('click', sendInput);
} else {
    console.error('Button element not found.');
}
