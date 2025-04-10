document.addEventListener("DOMContentLoaded", () => {
    // Set default image on page load
    profilePic.src = "img/pfp.jpg";
    profilePicture.src = "img/pfp.jpg";
});

function redirectTo(page) {
    window.location.href = page + ".html";
}

// Firebase Configuration

const authFirebaseConfig = {
    apiKey: "AIzaSyALS-1EI3vC3_e3BfdfbfQR2rT_H-RQUVg",
    authDomain: "ecommerce-website-ff296.firebaseapp.com",
    projectId: "ecommerce-website-ff296",
    storageBucket: "ecommerce-website-ff296.firebasestorage.app",
    messagingSenderId: "215343343164",
    appId: "1:215343343164:web:cb3ca6d36c4336e8280539",
    measurementId: "G-9PH1X13P98"
};

const app = firebase.initializeApp(authFirebaseConfig);
const auth = firebase.auth();
const db = app.firestore();

// Check if user is logged in
auth.onAuthStateChanged(async (user) => {
    const imageLoading = document.getElementById("image-loading");
    const profilePic = document.getElementById("profile-pic");
    const profilePicture = document.getElementById("profilePicture");

    // Set default image and show loading
    profilePic.src = "img/pfp.jpg";
    profilePicture.src = "img/pfp.jpg";
    imageLoading.style.display = "block";

    if (user) {
        emailField.value = user.email;

        const userRef = db.collection("users").doc(user.uid);

        try {
            const docSnap = await userRef.get();
            imageLoading.style.display = "none"; // Hides loading data when fetched
            if (docSnap.exists) {
                const userData = docSnap.data();
                const customWelcome = userData.customWelcome || user.email.split("@")[0];
                welcomeMessage.innerText = customWelcome;
                userEmail.innerText = user.email;
                profilePicture.src = userData.profilePic || "img/pfp.jpg";
                profilePic.src = userData.profilePic || "img/pfp.jpg";
                usernameField.value = userData.username || user.email.split("@")[0];
                themeSelect.value = userData.theme || "light";
                notificationsCheckbox.checked = userData.notifications || false;
                applyTheme(userData.theme || "light");
            } else {
                welcomeMessage.innerText = user.email.split("@")[0] || "User";
                userEmail.innerText = user.email || "";
                profilePicture.src = "img/pfp.jpg";
                profilePic.src = "img/pfp.jpg";
                applyTheme("light");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            imageLoading.style.display = "none"; // Hide loading on error
            welcomeMessage.innerText = user.email.split("@")[0] || "User";
            userEmail.innerText = user.email || "";
            profilePicture.src = "img/pfp.jpg";
            profilePic.src = "img/pfp.jpg";
            applyTheme("light");
        }
    } else {
        imageLoading.style.display = "none"; // Hide loading if no user
        welcomeMessage.innerText = "Welcome, Guest";
        userEmail.innerText = "";
        profilePicture.src = "img/pfp.jpg";
        profilePic.src = "img/pfp.jpg";
        window.location.href = "login.html";
    }
});

//new
// document.addEventListener("DOMContentLoaded", () => {
//     auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
//         .then(() => {
//             console.log("✅ Auth persistence set to LOCAL");
//         })
//         .catch((error) => {
//             console.error("❌ Persistence error:", error.message);
//         });

//     auth.onAuthStateChanged((user) => {
//         if (user) {
//             console.log("✅ User is authenticated:", user.email);

//             db.collection("users").doc(user.uid).get()
//                 .then((doc) => {
//                     if (doc.exists) {
//                         const userData = doc.data();
//                         sessionStorage.setItem("userSession", JSON.stringify({
//                             userId: user.uid,
//                             email: userData.email,
//                         }));
//                         console.log("✅ Session rehydrated");

//                         // Show the cart and hide loading
//                         document.getElementById("loading").style.display = "none";
//                         document.querySelector(".cart-container").style.display = "block";

//                         displayCart();
//                     } else {
//                         console.log("⚠️ User document not found");
//                         redirectToLogin();
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("🔥 Error fetching user:", error);
//                     redirectToLogin();
//                 });
//         } else {
//             console.log("❌ No user found. Redirecting to login...");
//             redirectToLogin();
//         }
//     });
// });
// Elements
const profilePic = document.getElementById("profile-pic");
const profileImageInput = document.getElementById("profileImage");
const usernameField = document.getElementById("username");
const emailField = document.getElementById("email");
const themeSelect = document.getElementById("theme");
const notificationsCheckbox = document.getElementById("notifications");
const passwordField = document.getElementById("newPassword");
const logoutBtn = document.getElementById("logoutBtn");
const welcomeMessage = document.getElementById("welcomeMessage");
const userEmail = document.getElementById("userEmail");
const profilePicture = document.getElementById("profilePicture");



// Convert Image to Base64
function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Compress Image Before Converting to Base64
async function compressImage(file, maxWidth = 300, maxHeight = 300, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            // Resize while maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                "image/jpeg",
                quality
            );
        };
        img.onerror = (error) => reject(error);
    });
}

// Upload Profile Picture
// Upload Profile Picture (Single Image Version)
profileImageInput.addEventListener("change", async (event) => {
    const user = auth.currentUser;
    if (!user) return alert("⚠ Please log in to upload an image!");

    const file = event.target.files[0];
    if (!file) return alert("⚠ Please select an image!");

    try {
        // Create a temporary URL for the image
        const tempUrl = URL.createObjectURL(file);

        // Update the profile-pic directly
        profilePic.src = tempUrl;

        // Store the file name or URL in Firestore (simplified)
        const fileName = `${user.uid}_${Date.now()}_${file.name}`;
        await db.collection("users").doc(user.uid).update({
            profilePic: fileName // Store filename (you can upload to Storage later if needed)
        });

        // Update the sidebar profile picture
        profilePicture.src = tempUrl;
        alert("✅ Image uploaded successfully!");
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("❌ Failed to upload image: " + error.message);
        // Revert to default if error occurs
        profilePic.src = "img/pfp.jpg";
        profilePicture.src = "img/pfp.jpg";
    }
});
async function deleteProfilePicture() {
    const user = auth.currentUser;
    if (!user) return alert("⚠ Please log in to delete the picture!");

    try {
        await db.collection("users").doc(user.uid).update({
            profilePic: "img/pfp.jpg" // Default image
        });
        profilePic.src = "img/pfp.jpg";
        profilePicture.src = "img/pfp.jpg";
        alert("✅ Profile picture deleted!");
    } catch (error) {
        console.error("Error deleting picture:", error);
        alert("❌ Failed to delete picture: " + error.message);
    }
}
function toggleWelcomeEdit() {
    const customWelcome = document.getElementById("customWelcome");
    if (customWelcome.style.display === "none") {
        customWelcome.style.display = "block";
    } else {
        const newWelcome = customWelcome.value.trim();
        if (newWelcome) {
            welcomeMessage.innerText = `${newWelcome},`;
            customWelcome.style.display = "none";
            // Optionally save to Firestore
            const user = auth.currentUser;
            if (user) {
                db.collection("users").doc(user.uid).update({
                    customWelcome: newWelcome
                });
            }
        }
    }
}
// Update Profile Information
async function updateProfile() {
    const user = auth.currentUser;
    if (!user) return;

    const newUsername = usernameField.value.trim();
    if (!newUsername) {
        alert("⚠ Username cannot be empty!");
        return;
    }
    try {
        await db.collection("users").doc(user.uid).update({
            username: newUsername
        });
        welcomeMessage.innerText = `Welcome, ${newUsername}`;
        const settingsStatus = document.getElementById("settingsStatus");
        settingsStatus.textContent = "✅ Profile updated!";
        settingsStatus.style.color = "green";
        settingsStatus.style.display = "block";
        setTimeout(() => {
            settingsStatus.style.display = "none";
        }, 2000);
        alert("✅ Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("❌ Failed to update profile: " + error.message);
    }
}

// Update Settings
async function updateSettings() {
    const user = auth.currentUser;
    if (!user) return;

    const saveButton = document.getElementById("saveSettingsBtn");
    const settingsStatus = document.getElementById("settingsStatus");
    const newTheme = themeSelect.value;
    const newNotifications = notificationsCheckbox.checked;

    // Show loading state
    saveButton.disabled = true;
    settingsStatus.style.display = "block";
    settingsStatus.textContent = "Saving...";
    settingsStatus.style.color = "green";

    try {
        // Update Firestore
        await db.collection("users").doc(user.uid).update({
            theme: newTheme,
            notifications: newNotifications
        });

        // Apply theme immediately (though onSnapshot will handle this too)
        applyTheme(newTheme);
        settingsStatus.textContent = "✅ Settings saved!";
        settingsStatus.style.color = "green";
    } catch (error) {
        console.error("Error saving settings:", error);
        settingsStatus.textContent = "❌ Failed to save settings: " + error.message;
        settingsStatus.style.color = "red";
    } finally {
        // Reset loading state
        setTimeout(() => {
            settingsStatus.style.display = "none";
            saveButton.disabled = false;
        }, 2000);
    }
}
async function resetSettings() {
    const user = auth.currentUser;
    if (!user) return alert("⚠ Please log in to reset settings!");

    try {
        await db.collection("users").doc(user.uid).update({
            theme: "light",
            notifications: false
        });
        themeSelect.value = "light";
        notificationsCheckbox.checked = false;
        applyTheme("light");
        alert("✅ Settings reset to default!");
    } catch (error) {
        console.error("Error resetting settings:", error);
        alert("❌ Failed to reset settings: " + error.message);
    }
}

// Apply Theme
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.style.backgroundColor = "#222";
        document.body.style.color = "white";
    } else {
        document.body.style.backgroundColor = "#f4f4f4";
        document.body.style.color = "black";
    }
}

// Update Password
async function updatePassword() {
    const user = auth.currentUser;
    const newPassword = passwordField.value.trim();

    if (!newPassword) {
        alert("⚠ Please enter a new password!");
        return;
    }
    if (newPassword.length < 6) {
        alert("⚠ Password must be at least 8 characters!");
        return;
    }

    try {
        await user.updatePassword(newPassword);
        alert("✅ Password updated successfully!");
    } catch (error) {
        console.error("Error updating password:", error);
        alert("❌ Error: " + error.message);
    }
}

// Logout Function
async function logout() {
    try {
        await auth.signOut();
        alert("🚪 Logged out successfully!");
        window.location.href = "login.html";
        localStorage.removeItem("userSession");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Logout Error: ", error);
        alert("❌ Failed to log out: " + error.message);
    }
}
document.addEventListener("DOMContentLoaded", async function () {
    const themeSelector = document.getElementById("theme");

    const user = auth.currentUser;

    if (user) {
        const userRef = db.collection("users").doc(user.uid);
        const docSnap = await userRef.get();

        if (docSnap.exists) {
            const userData = docSnap.data();
            const theme = userData.theme || "light";

            applyTheme(theme);
            themeSelector.value = theme;
        }
    }

    // Handle theme change
    themeSelector.addEventListener("change", async function () {
        const newTheme = this.value;
        applyTheme(newTheme);

        const user = auth.currentUser;
        if (user) {
            await db.collection("users").doc(user.uid).update({
                theme: newTheme
            });
        }
    });
});

