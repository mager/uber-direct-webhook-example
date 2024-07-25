import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.data.pickup != null) {
        setPickupAddress(message.data.pickup.address);
      }
      if (message.data.dropoff != null) {
        setDropoffAddress(message.data.dropoff.address);
      }
      setMessages((prev) => [...prev, message]);
    };

    return () => socket.close();
  }, []);
  console.log({ messages });
  return (
    <div className="App">
      <header className="App-header">
        <h1>Received Webhook Data</h1>
        {pickupAddress && (
          <p>
            <strong>Pickup Address:</strong> {pickupAddress}
          </p>
        )}
        {dropoffAddress && (
          <p>
            <strong>Dropoff Address:</strong> {dropoffAddress}
          </p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              margin: "20px",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <p>{msg.data.updated} -{" "}
              <strong>Status:</strong> {msg.data.status}
            </p>

            {/* <h3>Manifest Items</h3>
            <ul>
              {msg.data.manifest_items.map((item, idx) => (
                <li key={idx}>
                  {item.quantity} x {item.name} - {item.price / 100} - {item.size}{" "}
                  {msg.data.currency.toUpperCase()}
                </li>
              ))}
            </ul> */}
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
