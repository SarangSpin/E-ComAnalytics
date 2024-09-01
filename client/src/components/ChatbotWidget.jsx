import React, { useState } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import Groq from 'groq-sdk';
import '../css/global.css'


const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);

    const client = new Groq({
        apiKey: import.meta.env.VITE_GROQ_API, // Ensure your API key is set in your environment variables
        dangerouslyAllowBrowser: true
    });

    const handleNewUserMessage = async (newMessage) => {
        try {
            const params = {
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a helpful shopping assistant specializing in electronic products. Your goal is to recommend the best electronic products based on the features and descriptions provided by the user. Always provide relevant product suggestions tailored to the user\'s needs.' 
                    },
                    { 
                        role: 'user', 
                        content: newMessage 
                    }
                ],
                model: 'llama3-8b-8192' // Use the appropriate model ID from Groq's options
            };

            const chatCompletion = await client.chat.completions.create(params);

            const productSuggestion = chatCompletion.choices[0].message.content;

            // Send the product suggestion as a chatbot response
            addResponseMessage(`Based on your query, I suggest: ${productSuggestion}`);
        } catch (error) {
            console.error("Error fetching product suggestion:", error);
            addResponseMessage("Sorry, I couldn't find any suggestions for your query. Please try again.");
        }
    };

    return (
        <>
            <Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Product Assistant"
                subtitle="Ask me anything about electronic products!"
                profileAvatar="/path/to/avatar.png"  // Add an avatar if desired
                showCloseButton={true}
                launcherOpenLabel="Chat with us"
                launcherCloseLabel="Close"
                handleToggle={() => setIsOpen(!isOpen)}
            />
        </>
    );
};

export default ChatbotWidget;
