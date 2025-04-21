<template>
  <view>
    <view class="header">
      <text class="greeting">Hello, {{ data.username }}</text>
      <view class="notifications">
        <image src="/static/logout.png" class="icon" @click="data.handleLogout" />
      </view>
    </view>

    <view class="stats">
      <view class="stat-item">
        <text class="stat-title">Commission</text>
        <text class="stat-value">RM {{ data.overallCommission }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-title">Total Sales</text>
        <text class="stat-value">RM {{ data.totalSales }}</text>
      </view>
    </view>

    <view class="stats">
      <view class="stat-item">
        <text class="stat-title">Number of Orders</text>
        <text class="stat-value">{{ data.totalOrders }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-title">Verified Orders</text>
        <text class="stat-value">{{ data.verifiedOrders }}</text>
      </view>
    </view>

    <view class="wallet">
      <text class="wallet-title">Wallet Balance</text>
      <view class="wallet-details">
        <text class="wallet-value">RM {{ data.walletAmount }}</text>
      </view>
    </view>

    <view class="recent-orders">
      <text class="recent-orders-title">Recent 5 Orders</text>
      <view class="order-item" v-for="order in data.recentOrders" :key="order.id">
        <text class="order-id">{{ order.id }}</text>
        <text class="order-date">{{ order.date }}</text>
        <text class="order-total">RM {{ order.total }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['data']
};
</script>
