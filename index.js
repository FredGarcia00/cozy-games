const RAWG_API_KEY = 'a4d5522929d746d39be96b5bd82dbcf2';

        const moodDescriptions = {
            happy: "uplifting and cheerful games that will keep your good mood going",
            sad: "comforting and heartwarming games that might cheer you up",
            excited: "thrilling and fast-paced games to match your energy",
            relaxed: "calm and soothing games to help you unwind",
            stressed: "casual and easy-going games to help you de-stress"
        };

        const moodToGenres = {
            happy: ["family", "party", "casual", "sports"],
            sad: ["adventure", "indie", "puzzle", "rpg"],
            excited: ["action", "shooter", "fighting", "racing"],
            relaxed: ["simulation", "strategy", "board-games", "educational"],
            stressed: ["puzzle", "casual", "arcade", "platformer"]
        };

        const moodToTags = {
            happy: ["colorful", "funny", "cute"],
            sad: ["atmospheric", "story-rich", "emotional"],
            excited: ["fast-paced", "competitive", "action-packed"],
            relaxed: ["peaceful", "exploration", "open-world"],
            stressed: ["short", "easy", "relaxing"]
        };

        document.addEventListener('DOMContentLoaded', function() {
            const findGameButton = document.getElementById('findGameButton');
            findGameButton.addEventListener('click', suggestGame);
        });

        async function suggestGame() {
            const mood = document.getElementById('mood').value;
            const console = document.getElementById('console').value;
            const resultDiv = document.getElementById('result');
            const gameImageContainer = document.getElementById('game-image-container');

            if (mood === "" || console === "") {
                resultDiv.textContent = "Please select both a mood and a gaming platform!";
                gameImageContainer.innerHTML = '';
                return;
            }

            resultDiv.innerHTML = '<p class="loading">Finding the perfect game for you...</p>';
            gameImageContainer.innerHTML = '';

            try {
                const genres = moodToGenres[mood].join(',');
                const tags = moodToTags[mood].join(',');

                const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&genres=${genres}&tags=${tags}&platforms=${console}&page_size=20`);
                const data = await response.json();

                if (data.results.length === 0) {
                    resultDiv.textContent = "Sorry, we couldn't find a game for your mood and platform. Please try again with different options.";
                    return;
                }

                const randomGame = data.results[Math.floor(Math.random() * data.results.length)];

                const gameDescription = `Based on your ${mood} mood and selected platform, we suggest: <strong>${randomGame.name}</strong>. 
                    This game is perfect for ${moodDescriptions[mood]}. 
                    ${randomGame.name} has a rating of ${randomGame.rating}/5 and was released in ${randomGame.released}.`;

                resultDiv.innerHTML = gameDescription;
                
                if (randomGame.background_image) {
                    const gameImage = document.createElement('img');
                    gameImage.src = randomGame.background_image;
                    gameImage.alt = randomGame.name;
                    gameImage.style.maxWidth = '100%';
                    gameImage.style.borderRadius = '10px';
                    gameImage.style.marginTop = '20px';
                    gameImageContainer.appendChild(gameImage);
                }
            } catch (error) {
                console.error('Error:', error);
                resultDiv.textContent = "Oops! Something went wrong. Please try again later.";
            }
        }