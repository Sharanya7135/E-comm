// admin.js - Module to handle user management from Firebase Authentication

// Firebase configuration and initialization
// Make sure to import the required Firebase modules in your HTML or at the top of this file
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  listUsers,
  createUser,
  updateUser,
  deleteUser
} from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Initialize Firebase (replace with your own config)
const firebaseConfig = {
  // Your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const userTableBody = document.getElementById('users-table-body');
const totalUsersElement = document.getElementById('total-users');
const newUsersElement = document.getElementById('new-users');
const activeUsersElement = document.getElementById('active-users');
const loadingElement = document.getElementById('loading');
const noUsersElement = document.getElementById('no-users');
const searchInput = document.getElementById('search-input');
const refreshBtn = document.getElementById('refresh-btn');
const addUserBtn = document.getElementById('add-user-btn');

// Modal elements
const userModal = document.getElementById('user-modal');
const modalTitle = document.getElementById('modal-title');
const userNameInput = document.getElementById('user-name');
const userEmailInput = document.getElementById('user-email');
const userPasswordInput = document.getElementById('user-password');
const userStatusInput = document.getElementById('user-status');
const saveUserBtn = document.getElementById('save-user-btn');
const cancelBtn = document.getElementById('cancel-btn');
const closeModalBtn = document.querySelector('.close');

// Delete modal elements
const deleteModal = document.getElementById('delete-modal');
const deleteUserInfo = document.getElementById('delete-user-info');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const closeDeleteModalBtn = document.querySelector('#delete-modal .close');

// Current user being edited or deleted
let currentUser = null;

// Load all users from Firebase Authentication
async function loadUsers() {
  try {
    showLoading(true);
    
    // For Firebase Admin SDK, you'd use auth.listUsers()
    // But in client-side code, we need to use a Cloud Function or Firebase Auth REST API
    // For this example, we'll use Firestore to store user data as well
    
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    displayUsers(users);
    updateStats(users);
    
    showLoading(false);
  } catch (error) {
    console.error('Error loading users:', error);
    showLoading(false);
    alert('Failed to load users. Please try again.');
  }
}

// Display users in the table
function displayUsers(users) {
  if (users.length === 0) {
    userTableBody.innerHTML = '';
    noUsersElement.style.display = 'block';
    return;
  }
  
  noUsersElement.style.display = 'none';
  userTableBody.innerHTML = '';
  
  users.forEach(user => {
    const row = document.createElement('tr');
    
    // Format date
    const regDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const formattedDate = regDate.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
    
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.displayName || '—'}</td>
      <td>${user.email || '—'}</td>
      <td>${formattedDate}</td>
      <td>
        <span class="status-badge ${user.status || 'active'}">${user.status || 'Active'}</span>
      </td>
      <td class="actions">
        <button class="action-btn edit-btn" data-id="${user.id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" data-id="${user.id}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </td>
    `;
    
    userTableBody.appendChild(row);
  });
  
  // Add event listeners to action buttons
  addActionButtonListeners();
}

// Update user statistics
function updateStats(users) {
  // Total users
  totalUsersElement.textContent = users.length;
  
  // New users in the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const newUsersCount = users.filter(user => {
    const createdAt = user.createdAt ? new Date(user.createdAt) : null;
    return createdAt && createdAt >= oneWeekAgo;
  }).length;
  
  newUsersElement.textContent = newUsersCount;
  
  // Active users
  const activeUsersCount = users.filter(user => 
    user.status === 'active' || user.status === undefined
  ).length;
  
  activeUsersElement.textContent = activeUsersCount;
}

// Show/hide loading spinner
function showLoading(show) {
  loadingElement.style.display = show ? 'flex' : 'none';
  if (show) {
    noUsersElement.style.display = 'none';
  }
}

// Filter users based on search input
function filterUsers() {
  const searchTerm = searchInput.value.toLowerCase();
  const rows = userTableBody.querySelectorAll('tr');
  
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchTerm) ? '' : 'none';
  });
  
  // Show no results message if all rows are hidden
  const anyVisible = Array.from(rows).some(row => row.style.display !== 'none');
  noUsersElement.style.display = anyVisible ? 'none' : 'block';
  noUsersElement.textContent = anyVisible ? 'No users found.' : 'No matching users found.';
}

// Add event listeners to edit and delete buttons
function addActionButtonListeners() {
  // Edit buttons
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.getAttribute('data-id');
      editUser(userId);
    });
  });
  
  // Delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const userId = btn.getAttribute('data-id');
      showDeleteModal(userId);
    });
  });
}

// Show user modal for adding a new user
function showAddUserModal() {
  modalTitle.textContent = 'Add New User';
  userNameInput.value = '';
  userEmailInput.value = '';
  userPasswordInput.value = '';
  userStatusInput.value = 'active';
  userPasswordInput.removeAttribute('disabled');
  currentUser = null;
  userModal.style.display = 'block';
}

// Show user modal for editing an existing user
async function editUser(userId) {
  try {
    modalTitle.textContent = 'Edit User';
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      alert('User not found');
      return;
    }
    
    const userData = userDoc.data();
    currentUser = { id: userId, ...userData };
    
    userNameInput.value = userData.displayName || '';
    userEmailInput.value = userData.email || '';
    userPasswordInput.value = '';
    userPasswordInput.setAttribute('disabled', 'true');
    userStatusInput.value = userData.status || 'active';
    
    userModal.style.display = 'block';
  } catch (error) {
    console.error('Error editing user:', error);
    alert('Failed to load user data. Please try again.');
  }
}

// Show delete confirmation modal
async function showDeleteModal(userId) {
  try {
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      alert('User not found');
      return;
    }
    
    const userData = userDoc.data();
    currentUser = { id: userId, ...userData };
    
    // Display user info in the delete modal
    deleteUserInfo.innerHTML = `
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>Name:</strong> ${userData.displayName || '—'}</p>
      <p><strong>Email:</strong> ${userData.email || '—'}</p>
    `;
    
    deleteModal.style.display = 'block';
  } catch (error) {
    console.error('Error showing delete modal:', error);
    alert('Failed to load user data. Please try again.');
  }
}

// Save user (add or update)
async function saveUser() {
  try {
    const name = userNameInput.value.trim();
    const email = userEmailInput.value.trim();
    const password = userPasswordInput.value;
    const status = userStatusInput.value;
    
    if (!name || !email) {
      alert('Name and email are required');
      return;
    }
    
    // Check if adding a new user
    if (!currentUser) {
      if (!password) {
        alert('Password is required for new users');
        return;
      }
      
      // Create user in Firebase Auth via a Cloud Function
      // This would require a server-side component
      // For this example, we'll just add to Firestore
      
      const newUser = {
        displayName: name,
        email: email,
        status: status,
        createdAt: new Date().toISOString()
      };
      
      await db.collection('users').add(newUser);
    } else {
      // Update existing user
      const updateData = {
        displayName: name,
        email: email,
        status: status,
        updatedAt: new Date().toISOString()
      };
      
      await db.collection('users').doc(currentUser.id).update(updateData);
    }
    
    userModal.style.display = 'none';
    loadUsers(); // Reload the user list
  } catch (error) {
    console.error('Error saving user:', error);
    alert('Failed to save user. Please try again.');
  }
}

// Delete user
async function deleteUser() {
  if (!currentUser) return;
  
  try {
    // Delete user from Firestore
    await db.collection('users').doc(currentUser.id).delete();
    
    // Note: Deleting from Firebase Auth would require a Cloud Function
    
    deleteModal.style.display = 'none';
    loadUsers(); // Reload the user list
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Failed to delete user. Please try again.');
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Load users when the page loads
  loadUsers();
  
  // Search functionality
  searchInput.addEventListener('keyup', filterUsers);
  
  // Refresh button
  refreshBtn.addEventListener('click', loadUsers);
  
  // Add user button
  addUserBtn.addEventListener('click', showAddUserModal);
  
  // Save user button
  saveUserBtn.addEventListener('click', saveUser);
  
  // Cancel button
  cancelBtn.addEventListener('click', () => {
    userModal.style.display = 'none';
  });
  
  // Close modal button
  closeModalBtn.addEventListener('click', () => {
    userModal.style.display = 'none';
  });
  
  // Delete confirmation
  confirmDeleteBtn.addEventListener('click', deleteUser);
  
  // Cancel delete
  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });
  
  // Close delete modal button
  closeDeleteModalBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === userModal) {
      userModal.style.display = 'none';
    }
    if (event.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  });
});