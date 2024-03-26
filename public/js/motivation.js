const socket = io();

socket.on('motivationMessage', (message) => {
  if (message) {
    // Display the message in a non-intrusive, cheerful manner on the dashboard
    console.log(`Motivation Boost! 🚀\n${message.message}`); // Logging the motivational message
    alert(`Motivation Boost! 🚀\n${message.message}`);
  }
});

// Example function to request a motivational message based on a milestone
function requestMotivationMessage(milestone) {
  console.log(`Requesting motivation message for milestone: ${milestone}`); // Logging the request for a motivational message
  socket.emit('requestMotivationMessage', milestone);
}