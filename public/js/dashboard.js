document.addEventListener('DOMContentLoaded', function() {
  fetch('/api/progress')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Progress data loaded:', data); // Logging progress data
      if (data.length === 0) {
        console.log('No progress data available for the user.');
        document.getElementById('progressChart').innerHTML = '<p>No progress data available. Start tracking your habits to see your progress here.</p>';
        return;
      }
      const ctx = document.getElementById('progressChart').getContext('2d');
      const labels = data.map(item => `${item.habitId.name} (ID: ${item.habitId._id})`); // Modified to include habit ID
      const streaks = data.map(item => item.streaks);
      const chart = new Chart(ctx, {
        type: 'bar', // This can be changed to 'line', 'pie', etc.
        data: {
          labels: labels,
          datasets: [{
            label: 'Streaks',
            data: streaks,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'rgb(255, 99, 132)'
              }
            }
          },
          onClick: function(e, elements) {
            if (elements.length > 0) {
              const index = elements[0].index;
              const habitId = data[index].habitId._id;
              window.location.href = `/habits/${habitId}/challenges`; // Redirecting to challenges page for the habit
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error loading progress data:', error.message, error.stack); // Error handling with detailed logging
      document.getElementById('progressChart').innerHTML = '<p>Error loading progress data. Please try again later.</p>';
    });
});