// Setup map
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const attackFeed = document.getElementById("attack-feed");
const alertSound = document.getElementById("alert-sound");

// Fake attack data
const attacks = ["DDoS", "SQL Injection", "XSS", "Ransomware", "Brute Force"];
const tools = ["LOIC", "Hydra", "SQLMap", "Metasploit", "Mirai Botnet"];
const countries = ["USA", "China", "Russia", "India", "Brazil", "Germany", "UK"];
const coordinates = [
  [38.89511, -77.03637], // USA
  [39.9042, 116.4074],   // China
  [55.7558, 37.6173],    // Russia
  [28.6139, 77.2090],    // India
  [-15.7939, -47.8828],  // Brazil
  [52.52, 13.405],       // Germany
  [51.5074, -0.1278]     // UK
];

// Attack every 2 seconds
setInterval(() => {
    let index = Math.floor(Math.random() * countries.length);
    let country = countries[index];
    let attackType = attacks[Math.floor(Math.random() * attacks.length)];
    let tool = tools[Math.floor(Math.random() * tools.length)];
    let coords = coordinates[index];

    let log = {
        timestamp: new Date().toLocaleTimeString(),
        country,
        attackType,
        tool
    };

    let logText = `${log.timestamp} - ${log.country} hit by ${log.attackType} using ${log.tool}`;

    // Update feed
    let p = document.createElement("p");
    p.textContent = logText;
    attackFeed.prepend(p);

    // Play alert
    alertSound.play();

    // Add marker
    const marker = L.circleMarker(coords, {
      radius: 8,
      color: "#ff3c3c",
      fillColor: "#ff3c3c",
      fillOpacity: 0.8
    }).addTo(map);

    // Add pulse effect
    let pulse = 8;
    const pulseInterval = setInterval(() => {
      pulse += 2;
      if (pulse > 30) {
        clearInterval(pulseInterval);
        map.removeLayer(marker);
      } else {
        marker.setRadius(pulse);
        marker.setStyle({opacity: 1 - pulse / 30});
      }
    }, 200);

    // 🚀 Log to Firebase if available
    if (typeof db !== 'undefined') {
        db.ref('attacks').push(log);
    }

    // 🔗 API STUB: Replace with real API if needed
    /*
    fetch('https://api.your-attack-feed.com/latest')
      .then(res => res.json())
      .then(data => {
          // Process real attack data here
      });
    */
}, 2000);
