<template>
  <view class="bottom-nav safe-area-inset-bottom">
    <button
      class="nav-btn"
      :class="{ active: activeTab === 'home' }"
      @click="handleClick('home')">
      <view class="icon-container">
        <text class="icon">🏠</text>
        <view class="indicator" :class="{ 'indicator-active': activeTab === 'home' }"></view>
      </view>
      <text class="label">Home</text>
    </button>
    <button
      class="nav-btn"
      :class="{ active: activeTab === 'wallet' }"
      @click="handleClick('wallet')">
      <view class="icon-container">
        <text class="icon">💳</text>
        <view class="indicator" :class="{ 'indicator-active': activeTab === 'wallet' }"></view>
      </view>
      <text class="label">Wallet</text>
    </button>
    <button
      class="nav-btn"
      :class="{ active: activeTab === 'orders' }"
      @click="handleClick('orders')">
      <view class="icon-container">
        <text class="icon">📊</text>
        <view class="indicator" :class="{ 'indicator-active': activeTab === 'orders' }"></view>
      </view>
      <text class="label">Orders</text>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    activeTab: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick(tab) {
      const routes = {
        home: "/pages/tabbar/Home/home",
        wallet: "/pages/tabbar/Wallet/wallet",
        orders: "/pages/tabbar/Order/order",
      };
      
      // Always emit the change event first
      this.$emit("changeTab", tab);
      
      // Then navigate if needed
      if (this.activeTab !== tab && routes[tab]) {
        uni.switchTab({ url: routes[tab] });
      }
    },
  },
};
</script>
<style scoped>
.bottom-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px 0;
  background: linear-gradient(to bottom, #FFFFFF, #FFF8F2);
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 100;
}

.nav-btn {
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  width: 33.333%;
  transition: all 0.3s ease;
  position: relative;
}

.nav-btn:active {
  transform: scale(0.95);
}

.icon-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
}

.icon {
  font-size: 24px;
  margin-bottom: 3px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav-btn.active .icon {
  transform: translateY(-4px) scale(1.2);
  opacity: 1;
}

.nav-btn:not(.active) .icon {
  opacity: 0.7;
}

.indicator {
  position: absolute;
  bottom: -5px;
  width: 0;
  height: 3px;
  background-color: #EA9243;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.indicator-active {
  width: 20px;
}

.label {
  font-size: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  opacity: 0.8;
}

.nav-btn.active .label {
  color: #EA9243;
  opacity: 1;
  font-weight: 600;
}

/* Add a subtle pulse animation for the active tab */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(234, 146, 67, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(234, 146, 67, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(234, 146, 67, 0);
  }
}

.nav-btn.active .icon {
  animation: pulse 2s infinite;
}

/* Add a ripple effect on click */
.nav-btn::after {
  content: '';
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(234, 146, 67, 0.4) 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 0.8s;
}

.nav-btn:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

/* Safe area support for notched devices */
.safe-area-inset-bottom {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}
</style>