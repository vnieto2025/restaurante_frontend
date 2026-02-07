<template>
  <div class="login-page">
    <div class="left-section">
      <div class="brand">
        <i class="fas fa-utensils"></i>
        <span class="text ms-2">Restaurante</span>
      </div>
      <div class="illustration-container">
        <img :src="loginImage" alt="Restaurant Illustration" />
      </div>
    </div>
    
    <div class="right-section">
      <div class="login-card">
        <h2 class="mb-4">Sign In</h2>
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Username" 
              v-model="username" 
              required
            />
          </div>
          <div class="mb-3">
            <input 
              type="password" 
              class="form-control" 
              placeholder="Password" 
              v-model="password" 
              required
            />
          </div>
          
          <div class="d-flex justify-content-between align-items-center mb-4 small-text">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="rememberMe" v-model="rememberMe">
              <label class="form-check-label" for="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>
          
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary flex-grow-1" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
            <button type="button" class="btn btn-outline-secondary flex-grow-1">Register</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import loginImage from '../assets/login-illustration.png'
import { useRouter } from 'vue-router'
import apiUrl from "../../config.js";

const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await axios.post(
      `${apiUrl}/auth/login`, 
    {
      username: username.value,
      password: password.value
    },
    {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (response.status === 200) {
      localStorage.setItem('token', response.data.data.access_token)
      localStorage.setItem('username', response.data.data.username)
      localStorage.setItem('role', response.data.data.role)

      router.push('/dashboard')
    }
    
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = error?.response?.data?.message || 'Invalid username or password.'
    } else {
      errorMessage.value = 'An error occurred. Please try again later.'
    }
    console.error("Login error:", error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
}

.left-section {
  width: 45%;
  background-color: #2b2d6e; /* Deep Blue/Purple */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  /* Create the curved edge effect */
  border-top-right-radius: 20% 50%;
  border-bottom-right-radius: 20% 50%;
  /* Fix for background to fully cover left if we use border radius like this it pulls the corner in.
     Better to use a pseudo element or clip path for the outward curve.
  */
  border-radius: 0; 
  z-index: 1;
}

/* Using a pseudo-element for the convex curve */
.left-section::after {
  content: '';
  position: absolute;
  top: 0;
  right: -10vw; /* Extend out */
  width: 20vw;
  height: 100%;
  background-color: #2b2d6e;
  border-radius: 50%;
  z-index: -1; /* Behind the content but connected to left section visually */
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); /* Cut off the left part if needed, handled by z-index mostly */
  /* Actually simply transforming it */
  transform: scaleX(0.5);
  transform-origin: left;
} 
/* The pseudo element approach is tricky with z-index contexts. 
   Let's try a simpler Clip Path on a wrapper or just a huge rounded corner on a container.
   Actually, the image shows the WHITE part curving IN. (Concave for white, Convex for blue).
   So the Blue section is a rectangle + a circle segment.
*/

.left-section {
    width: 50%;
    background-color: #2b2d6e;
    clip-path: ellipse(100% 150% at 0% 50%);
}
/* This clip path makes the Right edge curved. 
   ellipse(radiusX radiusY at centerX centerY)
   100% width radius at 0% (left) -> extends to 100% (right). 
   This works well.
*/

.brand {
  position: absolute;
  top: 40px;
  left: 40px;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}

.illustration-container {
  max-width: 80%;
  z-index: 2;
}

.illustration-container img {
  width: 100%;
  height: auto;
  display: block;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

h2 {
  font-weight: 700;
  color: #334;
}

.form-control {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #fff;
}

.form-control:focus {
  box-shadow: 0 0 0 3px rgba(43, 45, 110, 0.1);
  border-color: #2b2d6e;
}

.btn {
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
}

.btn-primary {
  background-color: #2b2d6e;
  border-color: #2b2d6e;
}

.btn-primary:hover {
  background-color: #202255;
  border-color: #202255;
}

.btn-outline-secondary {
  color: #666;
  border-color: #e2e8f0;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
  color: #333;
  border-color: #ccc;
}

.small-text {
  font-size: 0.9rem;
}

.forgot-password {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .left-section {
    display: none;
  }
}
</style>