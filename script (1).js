const urlToNameMap = {};
const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Isabel", "Jack", "Katherine", "Leo", "Mia", "Noah", "Olivia", "Peter", "Quinn", "Ryan", "Sophia", "Thomas", "Ursula", "Vincent", "Willow", "Xander", "Yasmine", "Zane", "Amelia", "Benjamin", "Catherine", "Daniel", "Eva", "Finn", "Gabriella", "Harrison", "Isabella", "Jackson", "Kylie", "Liam", "Mila", "Nathan", "Oscar"];
const lastNames = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones", "Davis", "Miller", "Wilson", "Moore", "Anderson", "Baker", "Carter", "Clark", "Cooper", "Davis", "Edwards", "Evans", "Garcia", "Green", "Hall", "Harris", "Hill", "Hughes", "Jackson", "Johnson", "Jones", "King", "Lee", "Lewis", "Martin", "Martinez", "Miller", "Mitchell", "Moore", "Nelson", "Perez", "Perry", "Reed", "Roberts", "Smith", "Taylor", "Thomas", "Thompson", "Walker", "White", "Williams", "Wilson"];

// Preload audio files
const lowPitchAudio = new Audio();
lowPitchAudio.src = "https://drive.google.com/uc?id=17rx6oP6Sdm1NdS6mn1SsiPdG9B4MPwCO";

const midPitchAudio = new Audio();
midPitchAudio.src = "https://drive.google.com/uc?id=18An-48GCowVTEY939r-ahVC1YLAO5JGK";

const highPitchAudio = new Audio();
highPitchAudio.src = "https://drive.google.com/uc?id=18BiKKeM22FIjGSFVNQ5t3e42H0FkeVnG";

function addImage() {
    const imageInput = document.getElementById("imageInput");
    const imageUrl = imageInput.value.trim();

    if (imageUrl) {
        const imageContainer = document.getElementById("imageContainer");
        const summonMessage = document.getElementById("summonMessage");

        const newImage = document.createElement("div");
        newImage.className = "dvdSquare";
        newImage.style.backgroundImage = `url('${imageUrl}')`;

        // Set initial position randomly
        newImage.style.left = Math.random() * (window.innerWidth - 100) + "px";
        newImage.style.top = Math.random() * (window.innerHeight - 50) + "px";

        // Set initial direction
        const directionX = Math.random() > 0.5 ? 1 : -1;
        const directionY = Math.random() > 0.5 ? 1 : -1;

        let speedX = 3 * directionX; // Adjust speed as needed
        let speedY = 3 * directionY; // Adjust speed as needed

        imageContainer.appendChild(newImage);

        // Generate or retrieve the name based on the URL
        const imageName = getNameForUrl(imageUrl);

        // Display points above the image
        const pointsLabel = document.createElement("div");
        pointsLabel.className = "points";
        pointsLabel.textContent = "0 points";
        newImage.appendChild(pointsLabel);

        // Display summon message with name
        summonMessage.textContent = `${imageName} has been summoned!`;
        summonMessage.style.opacity = 1;

        // Hide summon message after 2 seconds
        setTimeout(() => {
            summonMessage.style.opacity = 0;
        }, 2000);

        // Move and bounce logic
        function move() {
            const rect = newImage.getBoundingClientRect();

            if (rect.left <= 0 || rect.right >= window.innerWidth) {
                speedX = -speedX;
                playBounceSound(rect);
                updatePoints(imageName, rect);
            }

            if (rect.top <= 0 || rect.bottom >= window.innerHeight) {
                speedY = -speedY;
                playBounceSound(rect);
                updatePoints(imageName, rect);
            }

            newImage.style.left = rect.left + speedX + "px";
            newImage.style.top = rect.top + speedY + "px";

            requestAnimationFrame(move);
        }

        // Start the movement
        move();
    }
}

function getNameForUrl(url) {
    if (urlToNameMap.hasOwnProperty(url)) {
        return urlToNameMap[url];
    } else {
        // Generate a hash based on the URL
        const hash = generateHash(url);

        // Use the hash to get an index for the first names and last names arrays
        const firstNameIndex = hash % firstNames.length;
        const lastNameIndex = (hash + 1) % lastNames.length;

        // Assign the name to the URL
        const newName = `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`;
        urlToNameMap[url] = newName;
        return newName;
    }
}

function generateHash(input) {
    let hash = 0;
    if (input.length === 0) return hash;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

function updatePoints(name, rect) {
    // Calculate points based on the distance to the nearest corner
    const distanceToLeft = rect.left;
    const distanceToRight = window.innerWidth - rect.right;
    const distanceToTop = rect.top;
    const distanceToBottom = window.innerHeight - rect.bottom;

    const minDistance = Math.min(distanceToLeft, distanceToRight, distanceToTop, distanceToBottom);

    // Adjust the factor as needed
    const factor = 0.01;

    const points = Math.floor(1 / (minDistance * factor));

    // Update points for the given name
    // Note: No leaderboard, so no need to update points display
}

// Play bounce sound with different pitches based on the bounce position
function playBounceSound(rect) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const horizontalDistance = Math.abs(rect.left + rect.width / 2 - centerX);
    const verticalDistance = Math.abs(rect.top + rect.height / 2 - centerY);

    const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);

    // Generate a random pitch for each bounce
    const pitch = Math.random();

    if (pitch < 0.33) {
        const audio = new Audio(lowPitchAudio.src);
        audio.currentTime = 0;
        audio.play();
    } else if (pitch < 0.66) {
        const audio = new Audio(midPitchAudio.src);
        audio.currentTime = 0;
        audio.play();
    } else {
        const audio = new Audio(highPitchAudio.src);
        audio.currentTime = 0;
        audio.play();
    }
}
