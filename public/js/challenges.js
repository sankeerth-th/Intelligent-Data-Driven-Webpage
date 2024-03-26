document.addEventListener('DOMContentLoaded', function() {
  // Assuming the habit ID is stored in a data attribute of the challengeContainer div
  const habitId = document.getElementById('challengeContainer').getAttribute('data-habit-id');

  fetch(`/api/habit/${habitId}/challenges`)
    .then(response => {
      if (!response.ok) {
        console.error('Network response was not ok');
        throw new Error(`Failed to fetch challenges: ${response.statusText}`);
      }
      return response.json();
    })
    .then(challenges => {
      console.log('Challenges fetched successfully:', challenges);
      const container = document.getElementById('challengeContainer');
      if (!challenges || challenges.length === 0) {
        console.log('No challenges available for this habit.');
        container.innerHTML = '<p>No challenges available for this habit.</p>';
      } else {
        container.innerHTML = challenges.map(challenge => `
          <div class="challenge">
            <h2>${challenge.name}</h2>
            <p>${challenge.description}</p>
            <p>Difficulty: ${challenge.difficulty}</p>
          </div>
        `).join('');
      }
    })
    .catch(error => {
      console.error('Error fetching challenges:', error.message, error.stack);
      document.getElementById('challengeContainer').innerHTML = 'Failed to load challenges. Please try again later.';
    });
});