<template>
  <view class="logoContainer">
    <!-- Error Container -->
      <image :src="logoSrc" class="mobile-logo" mode="widthFix" @error="handleError" />
    <view class="errorContainer" v-if="displayErrorText">
      <text>{{ errorText }}</text>
    </view>

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="form-card">
      <!-- Username -->
      <label>Username:</label>
      <input
        type="text"
        required
        v-model="username"
        name="username"
        class="uni-input" />
      <view class="error">{{ usernameError }}</view>

      <!-- Password -->
      <label>Password:</label>
      <view class="password-container">
        <input
          :type="passwordFieldType"
          required
          v-model="password"
          name="password"
          class="uni-input" />
        <text class="toggle-password" @click="togglePassword">
          {{ passwordIcon }}
        </text>
      </view>
      <view v-if="passwordError" class="error">{{ passwordError }}</view>

      <!-- Submit Button -->
        <button
          class="submit-btn"
          :disabled="loading"
          @click="handleSubmit">
          <text v-if="loading">Loading...</text>
          <text v-else>Login</text>
        </button>
	  
	  <!-- Forgot Password -->
	  <view class="link" @click="openForgotPassword">
	    Forgot Password?
	  </view>
    </form>

    <!-- Skip Buttons -->
	<button @click="goToNextPage2()">Home</button>
    <button @click="goToNextPage()">Wallet</button>
	<button @click="goToNextPage1()">Orders</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      logoSrc: '/static/zero_logo.png',  // Correct path to logo image
      username: "",
      password: "",
      passwordFieldType: "password",
      passwordIcon: "👁️",
      usernameError: "",
      passwordError: "",
      displayErrorText: false,
      errorText: "",
      loading: false,
    };
  },
  methods: {
    openForgotPassword() {
      if (typeof plus !== "undefined") {
        plus.runtime.openURL("https://shop.peakliving.today/my-account/lost-password/");
      } else {
        window.open("https://shop.peakliving.today/my-account/lost-password/", "_blank");
      }
    },
    goToNextPage() {
      uni.switchTab({ url: "/pages/tabbar/Wallet/wallet" });
    },
    goToNextPage1() {
      uni.switchTab({ url: "/pages/tabbar/Order/order" });
    },
    goToNextPage2() {
      uni.switchTab({ url: "/pages/tabbar/Home/home" });
    },
    async handleSubmit() {
      this.loading = true;
      console.log("🔵 Submit button clicked");

      const payload = {
        username: this.username,
        password: this.password,
      };

      console.log("🟡 Payload:", payload);

      try {
        const response = await uni.request({
          url: "http://localhost:8000/login.php",
          method: "POST",
          data: payload,
          header: { "Content-Type": "application/json" },
        });

        console.log("🟢 Response received:", response);

        if (response.statusCode === 200 && response.data.success) {
          console.log("✅ Login successful");
          uni.setStorageSync("token", response.data.token);
          uni.setStorageSync("username", response.data.username);
          uni.switchTab({ url: "/pages/tabbar/Home/home" });
        } else {
          console.warn("⚠️ Login failed:", response.data.message);
          this.errorText = response.data.message || "Invalid username or password.";
          this.displayErrorText = true;
        }
      } catch (error) {
        console.error("🔴 Error during login request:", error);
        this.errorText = "Failed to connect to the server. Please try again.";
        this.displayErrorText = true;
      } finally {
        this.loading = false;
      }
    },
    togglePassword() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
      this.passwordIcon =
        this.passwordFieldType === "password" ? "👁️" : "👁️‍🗨️";
    },
  },
};
</script>

<style scoped>
.errorContainer {
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
  width: 100%;
  max-width: 630rpx;
}
.errorText {
  color: white;
  margin-top: 10rpx;
}
form {
  width: 100%;
  max-width: 630rpx;
  background: white;
  padding: 30rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
label {
  color: #5f5f5f;
  font-size: 24rpx;
  margin: 40rpx 0 20rpx;
  display: block;
}
.uni-input {
  width: 100%;
  padding: 20rpx;
  border-bottom: 2rpx solid #959595;
}
.password-container {
  position: relative;
}
.toggle-password {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40rpx;
}
.submit-btn {
  background-color: #EA9243;
  color: white;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-top: 40rpx;
  font-size: 32rpx;
}
.submit-btn[disabled] {
  background-color: #cccccc;
}
.error {
  color: #ff0062;
  margin-top: 10rpx;
  font-size: 24rpx;
}
.link {
  margin-top: 30rpx;
  color: #1a73e8;
  text-decoration: underline;
  cursor: pointer;
  font-size: 28rpx;
}

.logoContainer {
  background-color: #FFF5EB;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Ensure it takes up full width */
}

.mobile-logo {
  width: 10%; /* Adjust this based on how large you want the logo */
  height: auto;
  object-fit: contain; /* Ensures the logo maintains its aspect ratio */
}

/* Mobile Specific Styles */
@media (max-width: 500px) {
  .mobile-logo {
    width: 80%; /* Logo should be bigger on smaller devices */
  }
}


/* Mobile Specific Styles */
@media (max-width: 500px) {
  .mobile-logo {
    width: 50%; /* Logo should be bigger on smaller devices */
  }
  .uni-input {
    font-size: 20rpx; /* Make input text size smaller on mobile */
  }
  .submit-btn {
    font-size: 28rpx; /* Make the submit button size smaller */
  }
  .link {
    font-size: 24rpx; /* Smaller link size on mobile */
  }
}
.form-card {
  width: 100%;
  max-width: 650rpx;
  background: #fff;
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>