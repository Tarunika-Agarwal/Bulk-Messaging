import axios from 'axios';
import React, { useState } from "react";
import MessageInput from "./components/MessageInput";
import MessageSettings from "./components/MessageSettings";
import UploadExcel from "./components/UploadExcel";

function App() {
  const [numbers, setNumbers] = useState([]); // Store phone numbers (renamed to 'numbers')
  const [timeGap, setTimeGap] = useState(1000); // Default time gap: 1 second
  const [messageSentCount, setMessageSentCount] = useState(0);  // To track sent messages count
  const [error, setError] = useState("");  // To display any error messages

  // This function is triggered when numbers are loaded from the Excel file
  const handleNumbersLoaded = (loadedNumbers) => {
    setNumbers(loadedNumbers);  // Update state with loaded phone numbers
    setMessageSentCount(loadedNumbers.length); // Set the number of loaded phone numbers
    console.log("Loaded numbers:", loadedNumbers);  // Debugging log
  };

  // This function is triggered when the time gap setting is changed
  const handleTimeGapChange = (newTimeGap) => {
    setTimeGap(newTimeGap);  // Update time gap setting
  };

  // Function to send messages to the numbers
  const sendMessages = async () => {
    const message = "Your bulk message here!";  // Example message

    if (numbers.length === 0) {
      setError("No phone numbers loaded.");
      return;
    }

    // Loop through the numbers and send messages
    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i];
      console.log(`Sending message to: ${number}`);  // Log number being sent

      try {
        // Send a POST request to the backend to send the message
        const response = await axios.post('http://localhost:3001/sendMessages', {
          phoneNumbers: [number],  // Send one number at a time
          message: message,
        });

        // Check if the backend response is successful
        if (response.status === 200) {
          console.log(`Message sent to: ${number}`);
        } else {
          console.error(`Error sending message to ${number}: ${response.status}`);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        setError(`Error sending message: ${err.message}`);  // Set error message
      }

      // Wait for the time gap before sending the next message (if it's not the last one)
      if (i < numbers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, timeGap));  // Wait before sending the next message
      }
    }

    // Reset error after sending messages
    setError("");
  };

  return (
    <div className="app-container">
      <h1>Bulk Messaging Application</h1>
      
      {/* Upload Excel Component */}
      <UploadExcel onPhoneNumbersLoaded={handleNumbersLoaded} />
      
      {/* Message Settings Component */}
      <MessageSettings onTimeGapChange={handleTimeGapChange} />
      
      {/* Message Input Component */}
      <MessageInput timeGap={timeGap} phoneNumbers={numbers} />
      
      {/* Display the number of phone numbers loaded */}
      <p>Loaded {messageSentCount} numbers.</p>
     
      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Button to send messages */}
      <button onClick={sendMessages}>Send Messages</button>
    </div>
  );
}

export default App;
