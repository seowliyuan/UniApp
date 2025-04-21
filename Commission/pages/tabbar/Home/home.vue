<template>
  <view class="container">
    <!-- 🖥️ Top Nav Bar for Web (Logo + Horizontal Menu) -->
    <view v-if="isWideScreen" class="web-nav">
      <view class="nav-bar">
        <img @click="home()" src="/static/zero_logo.png" alt="Logo" class="mobile-logo" />
        <view class="nav-buttons">
          <button class="nav-btn" :class="{ active: activeTab === 'home' }" @click="changeTab('home')">Home
            <text class="icon">🏠</text>
          </button>
          <button class="nav-btn" :class="{ active: activeTab === 'wallet' }" @click="changeTab('wallet')">Wallet
            <text class="icon">💳</text>
          </button>
          <button class="nav-btn" :class="{ active: activeTab === 'orders' }" @click="changeTab('orders')">Orders
            <text class="icon">📊</text>
          </button>
        </view>
      </view>
    </view>

    <!-- 📱 Mobile Logo -->
    <view class="mobile-logo-container" v-else>
      <!-- Use image component for mobile -->
      <image :src="logoSrc" class="mobile-logo" mode="widthFix" @error="handleError" />
    </view>

    <!-- 📱 Bottom NavBar -->
    <view v-if="!isWideScreen" class="mobile-nav">
      <NavBar :activeTab="activeTab" @changeTab="changeTab" />
    </view>

    <!-- Main Content -->
    <view class="main-content" :class="{ 'web-padding': isWideScreen }">
      <!-- Header -->
      <view class="header">
        <text class="greeting">Hello, {{ username }}</text>
        <view class="notifications">
          <image src="/static/logout.png" class="icon" @click="handleLogout" />
        </view>
      </view>

      <!-- Stats -->
      <view class="stats">
        <view class="stat-item">
          <text class="stat-title">Commission: </text>
          <text class="stat-value">RM {{ overallCommission }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-title">Total Sales: </text>
          <text class="stat-value">RM {{ totalSales }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-title">Number of Orders: </text>
          <text class="stat-value">{{ totalOrders }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-title">Verified Orders: </text>
          <text class="stat-value">{{ verifiedOrders }}</text>
        </view>
      </view>

      <!-- Wallet Section -->
      <view class="wallet" @click="goToWallet()">
        <text class="wallet-title">Wallet Balance</text>
        <view class="wallet-details">
          <text class="wallet-value">RM {{ walletAmount }}</text>
        </view>
      </view>

      <!-- Recent Orders (Styled as a Table) -->
      <view class="recent-orders">
        <text class="recent-orders-title">Recent 5 Orders</text>

        <!-- Table Rows -->
        <view class="order-table">
          <view class="order-header">
            <text class="order-column">Order ID</text>
            <text class="order-column">Amount</text>
            <text class="order-column">Date</text>
          </view>
          <view class="order-item" v-for="order in recentOrders" :key="order.id" @click="showOrderDetails(order)">
            <text class="order-column">{{ order.id }}</text>
            <text class="order-column">RM {{ order.total }}</text>
            <text class="order-column">{{ order.date }}</text>
          </view>
        </view>
      </view>

      <!-- Order Details Popup -->
      <view v-if="showPopup" class="order-popup">
        <view class="popup-content">
          <text class="popup-title">Order Details</text>
          <view class="popup-info">
            <text><strong>Order ID:</strong> {{ selectedOrder.id }}</text> <br />
            <text><strong>Details:</strong> {{ selectedOrder.details }}</text><br />
            <text><strong>Amount:</strong> RM {{ selectedOrder.total }}</text><br />
            <text><strong>Date:</strong> {{ selectedOrder.date }}</text><br />
          </view>
          <button class="popup-close-btn" @click="closePopup">Close</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import NavBar from "@/pages/Nav/NavBar.vue";

export default {
  components: { NavBar },
  data() {
    return {
      logoSrc: '/static/zero_logo.png', // Correct path to logo image
      isWideScreen: true,
      activeTab: "home", // Set the default tab to match the current page
      username: "",
      overallCommission: 100.00,
      totalSales: 10.00,
      walletAmount: 1000.00,
      totalOrders: 100,
      verifiedOrders: 20,
      recentOrders: [
        { id: '532', details: 'Withdrawal', total: 200.0, date: '28/4/24 13:11' },
        { id: '513', details: 'Commission Deposit', total: 118.73, date: '28/4/24 15:00' },
        { id: '508', details: 'Commission Deposit', total: 154.22, date: '28/4/24 10:00' },
        { id: '506', details: 'Commission Deposit', total: 232.77, date: '29/4/24 11:30' },
        { id: '499', details: 'Withdrawal', total: 500.0, date: '16/2/24 23:30' },
      ],
      showPopup: false,
      selectedOrder: {},
    };
  },
  mounted() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreen);
  },
  onShow() {
    // Update activeTab whenever the page is shown
    this.activeTab = "home"; // This should match the current page
	},
  methods: {
    showOrderDetails(order) {
      this.selectedOrder = order;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
    home() {
      uni.switchTab({
        url: "/pages/tabbar/Home/home", // Tabbar page
      });
    },
    checkScreen() {
      if (typeof window !== "undefined") {
        this.isWideScreen = window.innerWidth >= 768;
      } else {
        uni.getSystemInfo({
          success: (res) => {
            const isMobile = res.platform === 'ios' || res.platform === 'android';
            this.isWideScreen = !isMobile;
          }
        });
      }
    },
	handleLogout() {
	  uni.removeStorageSync("token");
	  uni.removeStorageSync("username");
	  uni.redirectTo({ url: "/pages/login/login" });
	},
    goToWallet() {
      uni.switchTab({ url: "/pages/tabbar/Wallet/wallet" });
    },
    changeTab(tab) {
      this.activeTab = tab;
      const routes = {
        home: "/pages/tabbar/Home/home",
        wallet: "/pages/tabbar/Wallet/wallet",
        orders: "/pages/tabbar/Order/order",
      };
      uni.switchTab({ url: routes[tab] || "/" });
    },
  },
};
</script>


<style scoped>
/* Container */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw;
  background-color: #FFF5EB;
  background-image: linear-gradient(135deg, #FFF5EB 0%, #FFECD9 100%);
  overflow-x: hidden;
}

/* Main Content Wrapper */
.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 100px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Add padding top only for web layout */
.web-padding {
  padding-top: 80px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(to right, #fff, #f9f9f9);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.header:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.greeting {
  font-size: 22px;
  font-weight: bold;
  background: linear-gradient(45deg, #333, #666);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.notifications .icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.notifications .icon:hover {
  transform: scale(1.15);
}

/* Stats Section */
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  margin-top: 20px;
}

.stat-item {
  flex: 1 1 calc(50% - 8px);
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease-out;
  animation-fill-mode: both;
}

.stat-item:nth-child(1) { animation-delay: 0.1s; }
.stat-item:nth-child(2) { animation-delay: 0.2s; }
.stat-item:nth-child(3) { animation-delay: 0.3s; }
.stat-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.stat-title {
  font-size: 16px;
  color: #555;
  font-weight: 500;
}

.stat-value {
  font-size: 22px;
  color: #4caf50;
  margin-top: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.stat-item:hover .stat-value {
  transform: scale(1.05);
}

/* Wallet Section */
.wallet {
  margin-top: 20px;
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: scaleIn 0.6s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.wallet:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.wallet-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.wallet-details {
  margin-top: 15px;
  position: relative;
  display: inline-block;
}

.wallet-value {
  color: #4caf50;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.wallet:hover .wallet-value {
  transform: scale(1.08);
}

/* Recent Orders */
.recent-orders {
  margin-top: 20px;
  padding: 25px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  animation: fadeInUp 0.7s ease-out;
  animation-fill-mode: both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recent-orders-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.order-table {
  width: 100%;
}

.order-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 5px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;
}

.order-column {
  font-size: 16px;
  color: #333;
  width: 33%;
}

.order-header .order-column {
  color: #555;
}

.order-item:hover {
  background-color: #f9f9f9;
  cursor: pointer;
  transform: translateX(5px);
}

.order-item:last-child {
  border-bottom: none;
}

/* Order Popup */
.order-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.popup-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  animation: popIn 0.4s ease-out forwards;
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.popup-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.popup-info {
  margin-bottom: 20px;
  line-height: 1.6;
}

.popup-info text {
  display: block;
  margin-bottom: 10px;
}

.popup-close-btn {
  background-color: #EA9243;
  color: white;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
  cursor: pointer;
  border: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.popup-close-btn:hover {
  background-color: #D87A2D;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(234, 146, 67, 0.3);
}

/* Navigation bars */
.web-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 10px 30px;
}

.nav-buttons {
  display: flex;
  gap: 40px;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: #EA9243;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-btn:hover::after {
  width: 70%;
}

.nav-btn:hover {
  color: #EA9243;
}

.nav-btn.active {
  color: #EA9243;
}

.nav-btn.active::after {
  width: 70%;
}

.icon {
  margin-left: 6px;
  transition: transform 0.3s ease;
}

.nav-btn:hover .icon {
  transform: scale(1.2);
}

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.1);
}

/* Logo */
.mobile-logo-container {
  padding: 16px 0 10px;
  text-align: center;
  animation: logoFadeIn 0.8s ease-out;
}

@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-logo {
  height: 40px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.mobile-logo:hover {
  transform: scale(1.05);
}

/* Responsive Adjustments */
@media (max-width: 500px) {
  .main-content {
    padding: 16px;
    padding-bottom: 100px;
  }
  
  .stat-item {
    flex-basis: 100%;
    animation-name: slideInMobile;
  }
  
  @keyframes slideInMobile {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .wallet, .recent-orders {
    padding: 20px;
  }
  
  .greeting {
    font-size: 18px;
  }
  
  .stat-title {
    font-size: 14px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .wallet-title {
    font-size: 16px;
  }
  
  .wallet-details {
    font-size: 18px;
  }
  
  .wallet-value {
    font-size: 24px;
  }
  
  .recent-orders-title {
    font-size: 16px;
  }
  
  .order-column {
    font-size: 14px;
    width: 33%;
  }
  
  .popup-content {
    width: 90%;
    padding: 20px;
  }
  
  .popup-title {
    font-size: 18px;
  }
  
  .popup-info {
    font-size: 14px;
  }
}
</style>


