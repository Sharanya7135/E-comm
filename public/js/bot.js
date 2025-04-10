const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Predefined responses with keywords
const responses = {
    "hi": "Hello there! How can I assist you today?",
    "hello": "Hi! How can I help you with your laptop-related queries?",
    "how are you": "I am just a simple bot, but I'm here to help!",
    "help": "Sure! What do you need help with?",
    "name": "I'm your chatbot assistant!",
    "thanks": "You're welcome! 😊 Let me know if you need anything else!",
    "thank you": "You're welcome! I'm always here to help.",
    "ok": "Alright! Let me know if you need anything else.",
    "okay": "Got it! If you have more questions, feel free to ask.",
    "great": "Glad to hear that! 😊",
    "cool": "Awesome! Let me know if I can help with anything else.",
    "sure": "Of course! What do you need assistance with?",
    "yes": "Great! Let's look into that",
    "bye": "Goodbye! Take care! Have a nice day!",

    //Contact-related queries
    "contact": "You can reach us at 📧 csi@csimumbai.com or 📞 +91-8080707051.",
    "contact info": "Sure! Our support email is 📧 csi@csimumbai.com and phone is 📞 +91-8080707051.",
    "how to contact": "You can email us at 📧 csi@csimumbai.com or call us at 📞 +91-8080707051.",
    "support": "Need help? Contact us at 📧 csi@csimumbai.com or 📞 +91-8080707051.",
    "customer care": "Our customer care team is here for you! Reach out at 📧 csi@csimumbai.com or 📞 +91-8080707051.",
    "help desk": "For assistance, email 📧 csi@csimumbai.com or call 📞 +91-8080707051.",
    "email": "Our official email is 📧 csi@csimumbai.com.",
    "phone": "You can call us at 📞 +91-8080707051.",
    "call": "Sure! Reach out to us at 📞 +91-8080707051 anytime between 10 AM – 6 PM.",
    "whatsapp": "You can reach us on WhatsApp at 📞 +91-8080707051.",

    // Laptop-related queries
    "best laptop": "It depends on your needs! Are you looking for a gaming laptop, business laptop, or one for general use?",
    "gaming laptop": "For gaming, consider ASUS ROG, Lenovo Legion, or MSI GF65.",
    "general use laptop": "For general use, Dell XPS 13, MacBook Air, and HP Spectre are great choices.",
    "business laptop": "For business, check Lenovo ThinkPad, Dell Latitude, or MacBook Pro.",
    "laptop": "Are you looking for a gaming, business, or general-use laptop?",
    "budget laptop": "Some good budget laptops are Acer Aspire 5, Lenovo IdeaPad 3, and HP 15. What's your budget?",
    "best gaming laptop": "For gaming, you can consider the ASUS ROG Strix, MSI Gaming series, or Dell G5 15.",
    "best laptop for students": "Some great laptops for students are Dell XPS 13, MacBook Air, and Lenovo ThinkPad.",
    "best laptop for work": "For work, you may consider the Dell XPS series, MacBook Pro, or Lenovo ThinkPad X1 Carbon.",
    "best laptop for programming": "For programming, I recommend MacBook Pro, Dell XPS 15, or Lenovo ThinkPad X1 Carbon.",
    "best laptop for video editing": "For video editing, consider MacBook Pro M3, Dell XPS 17, or Razer Blade 15 Studio Edition.",
    "best laptop for gaming": "For gaming, I recommend ASUS ROG Zephyrus G14, Razer Blade 15, or Alienware m15 R7.",

    // Pricing-related queries
    "laptop under 30000": "Some good laptops under ₹30,000 are Acer Aspire 3, Lenovo Ideapad S145, and HP 15s.",
    "laptop under 50000": "For under ₹50,000, you can consider HP Pavilion x360, Dell Inspiron 14, or Lenovo IdeaPad Flex 5.",
    "laptop under 60000": "Some great options under ₹60,000 include Asus VivoBook S15, Dell Inspiron 5406, and HP Pavilion x360.",
    "laptop under 1 lakh": "For high-end laptops under ₹1,00,000, check out MacBook Air M1, Dell XPS 13, and ASUS ROG Zephyrus G14.",

    // Feature-related queries
    "best battery laptop": "Laptops with the best battery life are MacBook Air M2, LG Gram 17, and Asus ExpertBook B9450.",
    "best gaming laptop": "Top gaming laptops include ASUS ROG Zephyrus G14, Razer Blade 15, and Acer Predator Helios 300.",
    "best laptop for coding": "For coding, some great options are MacBook Pro, Dell XPS 15, and Lenovo ThinkPad X1 Carbon.",
    "best budget gaming laptop": "Some affordable gaming laptops are Acer Nitro 5, ASUS TUF Gaming F15, and HP Victus 16.",
    "best ultrabook": "Consider Dell XPS 13, MacBook Air M2, or ASUS ZenBook 14 for a premium ultrabook experience.",
    "best graphics card laptop": "For high-end graphics performance, check out ASUS ROG Strix Scar 16, Razer Blade 16, or MSI Raider GE78.",

    // Storage and RAM queries
    "best laptop 512gb ssd": "Some great laptops with 512GB SSD are Dell XPS 13, HP Pavilion x360, and Asus ZenBook 14.",
    "1tb storage laptop": "For a 1TB storage laptop, check out Dell Inspiron 15 5518, HP Omen 16, or Lenovo Legion 5.",
    "best laptop 8gb ram": "If you need an 8GB RAM laptop, check out Acer Aspire 5, HP Pavilion 14, or Lenovo ThinkPad E14.",
    "best 16gb ram laptop": "For 16GB RAM, I recommend MacBook Pro 14-inch M2, Lenovo Legion 5, or Dell XPS 15.",

    // General laptop questions
    "what is the best laptop brand": "Some of the best laptop brands are Apple, Dell, HP, ASUS, Lenovo, and Razer.",
    "difference between ssd and hdd": "SSDs are faster, more durable, and use less power. HDDs are cheaper and offer more storage but are slower.",
    "what is the best processor for a laptop": "It depends on your use! Intel i5 and i7 are good for most users, while Ryzen 5 and Ryzen 7 are great alternatives.",
    "best graphics card for laptop": "For gaming and editing, NVIDIA RTX 40-series and AMD Radeon RX 7000-series are great choices.",
    "what is ram": "RAM (Random Access Memory) is temporary memory that helps your laptop run multiple tasks smoothly.",
    "what is ssd": "SSD (Solid State Drive) is a faster and more reliable storage option compared to traditional HDDs.",

    //Earphone related questions
    "good earphones": "Looking for good earphones? Check out Sony WF- 1000XM5, JBL C100TWS, and OnePlus Buds Z2.",
    "good wireless earphones": "Some good wireless earphones are Realme Buds Air 3, OnePlus Nord Buds 2, and boAt Airdopes 441.",
    "good earphones for calls": "For clear calling, try Sony LinkBuds, JBL Wave 200 TWS, or Samsung Galaxy Buds Live.",
    "good earphones under 1000": "Some budget-friendly earphones are boAt BassHeads 100, Realme Buds Classic, and Zebronics Zeb-Rush.",
    "good earphones under 2000": "Try OnePlus Bullets Wireless Z, boAt Rockerz 255 Pro+, or Realme Buds Wireless 2 Neo.",
    "good noise cancelling earphones": "Top picks for noise cancelling are Sony WF-1000XM5, Bose QC Earbuds II, and Apple AirPods Pro.",
    "good gaming earphones": "For gaming, try JBL Quantum 50, Razer Hammerhead Duo, or HyperX Cloud Earbuds.",
    "good sports earphones": "Great for workouts: Skullcandy Push Active, JBL Endurance Run, and boAt Rockerz 255 Pro.",
    "best earphones": "Looking for wired or wireless? Some great options are Sony WF-1000XM5, JBL Tune 230NC, and Realme Buds Air 5.",
    "best budget earphones": "For budget earphones, try Realme Buds 2, boAt BassHeads 100, or JBL C100SI.",
    "best wireless earphones": "Some great wireless options include Sony WF-1000XM4, OnePlus Buds Pro 2, and Apple AirPods Pro.",
    "best earphones under 1000": "Under ₹1000, check out boAt BassHeads 100, Realme Buds Classic, or Boult Audio BassBuds.",
    "best gaming earphones": "For gaming, consider Razer Hammerhead Duo, HyperX Cloud Earbuds, or Logitech G333.",
    "earphones with mic": "Looking for earphones with a mic? Try JBL C200SI, Realme Buds Wireless 2, or boAt Rockerz 255 Pro+.",
    "which earphones are best for calls": "Sony WF-1000XM4, Apple AirPods Pro, and Samsung Galaxy Buds 2 are excellent for clear calling.",

    //SSD related questions
    "best ssd": "Top SSDs include Samsung 980 Pro, WD Black SN850X, and Crucial MX500.",
    "ssd for laptop": "For laptops, go for NVMe SSDs like Samsung 970 EVO Plus, WD Blue SN570, or Kingston NV2.",
    "external ssd": "Some great external SSDs are Samsung T7, SanDisk Extreme Portable SSD, and Crucial X6.",
    "best 1tb ssd": "1TB SSDs worth checking out: Samsung 980, WD Blue SN570, and Crucial P5 Plus.",
    "ssd vs hdd": "SSDs are faster, quieter, and more durable. HDDs are cheaper and offer more storage but are slower.",
    "best budget ssd": "Budget SSDs include Kingston A400, Crucial BX500, and WD Green SN350.",

    //Graphics Card related questions
    "best graphics card": "Top choices are NVIDIA RTX 4090, AMD RX 7900 XTX, and NVIDIA RTX 4080 Super.",
    "best graphics card for gaming": "For gaming, try NVIDIA RTX 4070 Ti, AMD RX 7800 XT, or RTX 4060 Ti for budget gaming.",
    "graphics card under 20000": "Under ₹20,000, consider NVIDIA GTX 1650, AMD RX 6500 XT, or GTX 1050 Ti.",
    "graphics card for laptop": "Laptops with strong GPUs include those with NVIDIA RTX 3060, 4050, or AMD RX 6800M.",
    "integrated vs dedicated graphics": "Integrated is built-in and power efficient, while dedicated offers better performance for gaming and editing.",
    "best budget graphics card": "Budget GPUs include GTX 1650, RX 6400, and Intel Arc A380.",
    "nvidia vs amd graphics card": "NVIDIA offers better ray tracing and DLSS, while AMD often gives more VRAM and value per rupee.",
}
// Function to handle messages
function sendMsg() {
    let msg = userInput.value.trim().toLowerCase();
    if (msg === "") return;

    dispMsg("You: " + msg, "user");

    // Check for keywords in the input
    let resp = getDynamicResponse(msg);

    setTimeout(() => {
        dispMsg("Bot: " + resp, "bot");
        saveToFirebase(msg, resp);
    }, 1000);

    userInput.value = "";
}

function getDynamicResponse(msg) {
    msg = msg.toLowerCase();

    // Convert responses object keys into an array
    let keywords = Object.keys(responses);

    // Find the first keyword that exists in the user's message
    let foundKey = keywords.find(key => msg.includes(key));

    if (foundKey) {
        return responses[foundKey]; // Return response for the first matched keyword
    }

    return "I'm not sure about that, but I'm learning!";
}

// Function to show messages
function dispMsg(text, sender) {
    let div = document.createElement("div");
    div.className = sender;
    div.innerText = text;
    chatBox.appendChild(div);

    // Auto-scroll to the latest message
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to save chat to Firebase
function saveToFirebase(userMsg, botReply) {
    db.collection("chats").add({
        userMessage: userMsg,
        botResponse: botReply,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }).catch(error => console.error("Error saving chat: ", error));
}

// Allow sending message on Enter key
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMsg();
    }
});