<template>
  <view class="container">
    <!-- Top Nav Bar for Web (Logo + Horizontal Menu) -->
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

    <!-- Mobile Logo -->
<view class="mobile-logo-container" v-else>
      <!-- Use image component for mobile -->
      <image :src="logoSrc" class="mobile-logo" mode="widthFix" @error="handleError" />
    </view>

    <!-- Main Content -->
    <view class="main-content" :class="{ 'web-padding': isWideScreen }">
      <!-- Search and Filter -->
	  <!-- Search and Filter (Separate for Web & Mobile) -->
<view class="search-filter-container" v-if="isWideScreen">
  <view class="search-input-wrapper web-search">
    <text class="search-icon">🔍</text>
    <input
      v-model="search"
      placeholder="Search Order ID"
      @input="applyFilters"
      class="search-input"
    />
  </view>
</view>

<!-- 📱 Mobile Search Bar -->
<view class="search-filter-container" v-else>
  <view class="search-input-wrapper mobile-search">
    <text class="search-icon">🔍</text>
    <input
      v-model="search"
      placeholder="Search Order ID"
      @input="applyFilters"
      class="search-input"
    />
  </view>
</view>


      <!-- Orders Card -->
      <view class="card">
        <view class="card-header">
          <text class="card-title">Order List</text>
          <text class="order-count">{{ searchedOrders.length }} orders</text>
        </view>

        <!-- Table for Desktop / Cards for Mobile -->
        <view class="table-container">
          <!-- Table Header (Desktop Only) -->
          <view v-if="isWideScreen" class="table-header">
            <text class="table-header-cell">Order ID</text>
            <text class="table-header-cell">Date</text>
            <text class="table-header-cell">Customer</text>
            <text class="table-header-cell">Status</text>
          </view>
		  <view class="table-body">
		    <view
		      v-for="order in pagedOrders"
		      :key="order.order_id"
		      @click="openModal(order)"
		      class="table-row"
		      :class="{ 'highlight': order.status === 'Complete', 'mobile-card': !isWideScreen }"
		    >
		      <view v-if="isWideScreen" class="table-row-desktop">
		        <text class="table-cell order-id">{{ order.order_id }}</text>
		        <text class="table-cell">{{ formatDate(order.order_date) }}</text>
		        <text class="table-cell">{{ order.customer || '-' }}</text>
		        <text class="table-cell status-cell">
		          <view class="status-badge" :class="getStatusClass(order.status)">
		            {{ order.status || 'Unknown' }}
		          </view>
		        </text>
		      </view>
		  
		      <view v-else class="mobile-card-content">
		        <view class="mobile-card-row mobile-card-header">
		          <text class="order-id">#{{ order.order_id }}</text>
		          <view class="status-badge" :class="getStatusClass(order.status)">
		            {{ order.status || 'Unknown' }}
		          </view>
		        </view>
		        <view class="mobile-card-row">
		          <text class="mobile-card-label">Date:</text>
		          <text class="mobile-card-value">{{ formatDate(order.order_date) }}</text>
		        </view>
		        <view class="mobile-card-row">
		          <text class="mobile-card-label">Customer:</text>
		          <text class="mobile-card-value">{{ order.customer || '-' }}</text>
		        </view>
		        <view class="mobile-card-row">
		          <text class="mobile-card-label">Total:</text>
		          <text class="mobile-card-value">RM{{ order.total_amount ? order.total_amount.toFixed(2) : '0.00' }}</text>
		        </view>
		      </view>
		    </view>
		  </view>

        </view>

        <!-- Empty State -->
        <view class="empty-state" v-if="pagedOrders.length === 0">
          <text class="empty-text">No orders found matching your search</text>
        </view>
      </view>

      <!-- Pagination -->
      <view class="pagination">
        <button class="pagination-btn" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          <text class="pagination-icon">◀</text>
        </button>
        <text class="page-info">Page {{ currentPage }} of {{ totalPages }}</text>
        <button class="pagination-btn" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
          <text class="pagination-icon">▶</text>
        </button>
      </view>

      <!-- Modal -->
      <view v-if="showModal" class="modal-backdrop" @click="closeModal">
        <view class="modal-content" @click.stop>
          <view class="modal-header">
            <text class="modal-title">Order Details</text>
            <button class="close-btn" @click="closeModal">×</button>
          </view>

          <view class="modal-body">
            <view class="detail-row">
              <text class="detail-label">Order ID:</text>
              <text class="detail-value">#{{ selectedOrder.order_id }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">Order Date:</text>
              <text class="detail-value">{{ formatDate(selectedOrder.order_date) }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">Customer:</text>
              <text class="detail-value">{{ selectedOrder.customer || '-' }}</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">Status:</text>
              <view class="status-badge modal-status" :class="getStatusClass(selectedOrder.status)">
                {{ selectedOrder.status || 'Unknown' }}
              </view>
            </view>
            
            <view class="items-section">
              <text class="section-title">Order Items:</text>
              <view class="item-list">
                <view v-for="(item, index) in selectedOrder.items" :key="index" class="item-row">
                  <text class="item-name">{{ item.order_item_name }}</text>
                  <text class="item-price">RM{{ parseFloat(item.item_price).toFixed(2) }}</text>
                </view>
              </view>
            </view>
            
            <view class="financial-details">
              <view class="detail-row total-row">
                <text class="detail-label">Total:</text>
                <text class="detail-value total-amount">RM{{ parseFloat(selectedOrder.total_amount).toFixed(2) }}</text>
              </view>
              <view class="detail-row commission-row">
                <text class="detail-label">Commission:</text>
                <text class="detail-value">RM{{ parseFloat(selectedOrder.commission || 0).toFixed(2) }}</text>
              </view>
            </view>
          </view>

          <view class="modal-footer">
            <button class="action-btn cancel-btn" @click="closeModal">Close</button>
            <!-- <button class="action-btn primary-btn" @click="processOrder">Process Order</button> -->
          </view>
        </view>
      </view>
    </view>

    <!-- Mobile Bottom Nav -->
    <view class="mobile-nav" v-if="!isWideScreen">
      <NavBar :activeTab="activeTab" @changeTab="changeTab" />
    </view>
  </view>
</template>

<script>
import NavBar from "@/pages/Nav/NavBar.vue";

export default {
  components: { NavBar },
  data() {
    return {
      isWideScreen: true,
      logoSrc: '/static/zero_logo.png',  // Correct path to logo image
      activeTab: "orders",
      items: [],
      search: "",
      searchedOrders: [],
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      pagedOrders: [],
      showModal: false,
      selectedOrder: null,
    };
  },
mounted() {
  this.checkScreen();
  uni.onWindowResize(this.checkScreen); // ✅ for responsive behavior
  this.loadMockData(); // ✅ applyFilters is already called inside
},
checkScreen() {
  uni.getSystemInfo({
    success: (res) => {
      this.isWideScreen = res.windowWidth >= 768; // ✅ works on all platforms
    }
  });
},

  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreen);
  },
  onShow() {
    // Update activeTab whenever the page is shown
    this.activeTab = "orders"; // This should match the current page
  	},
  methods: {
    home() {
      uni.switchTab({
        url: "/pages/tabbar/Home/home",
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
    handleError() {
      console.error("Failed to load logo image");
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
    fetchOrders() {
      uni.request({
        url: "http://localhost:8000/orders.php",
        method: "GET",
        success: (res) => {
          console.log("API Success:", res.data);
          if (res.statusCode === 200 && Array.isArray(res.data)) {
            this.items = res.data;
            this.searchedOrders = [...this.items];
            this.totalPages = Math.ceil(this.searchedOrders.length / this.pageSize);
            this.updatePagedOrders();
          } else {
            console.error("Invalid response structure");
            this.loadMockData();
          }
        },
        fail: (err) => {
          console.error("API Error:", err);
          this.loadMockData();
        },
      });
    },
    loadMockData() {
      console.log("Loading mock data...");
      this.items = [
        {
          order_id: "ORD001",
          order_date: "2025-04-15",
          customer: "John Doe",
          status: "Complete",
          total_amount: 159.99,
          commission: 15.99,
          items: [
            { order_item_name: "Product A", item_price: 79.99 },
            { order_item_name: "Product B", item_price: 80.00 }
          ]
        },
        {
          order_id: "ORD002",
          order_date: "2025-04-12",
          customer: "Jane Smith",
          status: "Pending",
          total_amount: 299.50,
          commission: 29.95,
          items: [
            { order_item_name: "Product C", item_price: 299.50 }
          ]
        },
        {
          order_id: "ORD003",
          order_date: "2025-04-10",
          customer: "Robert Johnson",
          status: "Processing",
          total_amount: 89.75,
          commission: 8.97,
          items: [
            { order_item_name: "Product D", item_price: 45.50 },
            { order_item_name: "Product E", item_price: 44.25 }
          ]
        },
        {
          order_id: "ORD004",
          order_date: "2025-04-08",
          customer: "Sarah Williams",
          status: "Cancelled",
          total_amount: 199.00,
          commission: 0.00,
          items: [
            { order_item_name: "Product F", item_price: 199.00 }
          ]
        },
		{
		  order_id: "ORD004",
		  order_date: "2025-04-08",
		  customer: "Sarah Williams",
		  status: "Cancelled",
		  total_amount: 199.00,
		  commission: 0.00,
		  items: [
		    { order_item_name: "Product F", item_price: 199.00 }
		  ]
		},
		{
		  order_id: "ORD004",
		  order_date: "2025-04-08",
		  customer: "Sarah Williams",
		  status: "Cancelled",
		  total_amount: 199.00,
		  commission: 0.00,
		  items: [
		    { order_item_name: "Product F", item_price: 199.00 }
		  ]
		},
		{
		  order_id: "ORD004",
		  order_date: "2025-04-08",
		  customer: "Sarah Williams",
		  status: "Cancelled",
		  total_amount: 199.00,
		  commission: 0.00,
		  items: [
		    { order_item_name: "Product F", item_price: 199.00 }
		  ]
		}
      ];
  this.applyFilters(); // ✅ ensure filtered list gets updated

    },
applyFilters() {
  const term = this.search.trim().toLowerCase();

  // ✅ Skip if items not loaded yet
  if (!this.items || this.items.length === 0) {
    this.searchedOrders = [];
    this.pagedOrders = [];
    this.totalPages = 1;
    this.currentPage = 1;
    return;
  }

  this.searchedOrders = term
    ? this.items.filter(order => order.order_id.toLowerCase().includes(term))
    : [...this.items];

  this.totalPages = Math.ceil(this.searchedOrders.length / this.pageSize);
  this.currentPage = 1;
  this.updatePagedOrders();
},


    updatePagedOrders() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.pagedOrders = this.searchedOrders.slice(startIndex, startIndex + this.pageSize);
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.updatePagedOrders();
    },
    openModal(order) {
      this.selectedOrder = order;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedOrder = null;
    },
    processOrder() {
      uni.showToast({
        title: `Processing order ${this.selectedOrder.order_id}`,
        icon: "success",
      });
      setTimeout(() => {
        this.closeModal();
      }, 1500);
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    getStatusClass(status) {
      if (!status) return 'status-unknown';
      switch (status.toLowerCase()) {
        case 'complete': return 'status-complete';
        case 'pending': return 'status-pending';
        case 'cancelled': return 'status-cancelled';
        case 'processing': return 'status-processing';
        default: return 'status-unknown';
      }
    }
  },
};
</script>


<style scoped>
/* Core Layout */
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #FFF5EB;
  overflow-x: hidden;
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
  padding: 10px 30px;
}
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px; /* ✅ logo ↔ nav-buttons spacing */
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

.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.notifications .icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

/* Main Content Styles - Enhanced */
.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 28px;
  padding-bottom: 100px;
}

.web-padding {
  padding-top: 90px;
}

/* Search Input - Enhanced */
/* Shared container */
.search-filter-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

/* Wrapper for both */
.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #94A3B8;
}

.search-input {
  padding-left: 36px;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
  outline: none;
}

/* Web version: Larger */
.web-search {
  max-width: 400px;
  width: 100%;
}

.web-search .search-input {
  padding: 12px 16px 12px 40px;
  font-size: 16px;
}

/* Mobile version: Smaller */
.mobile-search {
  max-width: 260px;
  width: 100%;
}

.mobile-search .search-input {
  padding: 10px 14px 10px 36px;
  font-size: 14px;
}


/* Card Styles - Enhanced */
.card {
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-bottom: 28px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #F1F5F9;
  background-color: #FAFAFA;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
}

.order-count {
  font-size: 14px;
  color: #64748B;
  background-color: #F1F5F9;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Table Styles - Enhanced */
.table-container {
  overflow-x: auto;
  width: 100%;
}

.table-header {
  display: flex;
  background-color: #F8FAFC;
  color: #334155;
  font-weight: 600;
  text-align: left;
  padding: 14px 24px;
  border-bottom: 1px solid #E2E8F0;
}

.table-header-cell {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-body {
  width: 100%;
}

.table-row {
  display: flex;
  padding: 16px 24px;
  border-bottom: 1px solid #F1F5F9;
  transition: all 0.2s ease;
  cursor: pointer;
}

.table-row:hover {
  background-color: #F8FAFC;
  transform: translateX(4px);
}

.table-row.highlight {
  background-color: #F0F9FF;
  border-left: 3px solid #3B82F6;
}

.table-row-desktop {
  display: flex;
  width: 100%;
}

.table-cell {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  color: #475569;
}

.order-id {
  color: #2563EB;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: rgba(37, 99, 235, 0.3);
  text-underline-offset: 2px;
}

.status-cell {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.status-badge:hover {
  transform: scale(1.05);
}

.status-complete {
  background-color: #DCFCE7;
  color: #16A34A;
}

.status-pending {
  background-color: #FEF3C7;
  color: #D97706;
}

.status-cancelled {
  background-color: #FEE2E2;
  color: #DC2626;
}

.status-processing {
  background-color: #E0F2FE;
  color: #0284C7;
}

.status-unknown {
  background-color: #E5E7EB;
  color: #6B7280;
}

/* Mobile Card View - Enhanced */
.mobile-card {
  display: block !important;
  padding: 18px !important;
  margin: 16px;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.mobile-card:active {
  transform: scale(0.98);
  background-color: #FAFAFA;
}

.mobile-card-content {
  width: 100%;
}

.mobile-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.mobile-card-header {
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F1F5F9;
}

.mobile-card-label {
  color: #64748B;
  font-size: 13px;
  font-weight: 500;
}

.mobile-card-value {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  text-align: right;
}

/* Empty State - Enhanced */
.empty-state {
  padding: 50px 0;
  text-align: center;
  background-color: #F8FAFC;
  border-radius: 10px;
  margin: 20px 0;
}

.empty-text {
  color: #64748B;
  font-size: 16px;
  font-weight: 500;
}

/* Pagination - Enhanced */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 30px;
}

.pagination-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: white;
  color: #334155;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pagination-btn:hover:not(:disabled) {
  background-color: #F1F5F9;
  border-color: #CBD5E1;
  transform: translateY(-2px);
}

.pagination-btn:active:not(:disabled) {
  transform: translateY(0);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  font-size: 16px;
}

.page-info {
  font-size: 14px;
  color: #64748B;
  font-weight: 500;
}

/* Modal Styles - Enhanced */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  backdrop-filter: blur(2px);
  transition: all 0.3s ease;
}

.modal-content {
  background-color: white;
  width: 90%;
  max-width: 600px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: modalEntrance 0.4s ease-out;
}

@keyframes modalEntrance {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #F1F5F9;
  background-color: #F8FAFC;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #0F172A;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #64748B;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #F1F5F9;
  color: #334155;
  transform: rotate(90deg);
}

.modal-body {
  padding: 28px;
  overflow-y: auto;
}

.detail-row {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
}

.detail-label {
  width: 120px;
  color: #64748B;
  font-size: 14px;
  font-weight: 500;
}

.detail-value {
  flex: 1;
  font-size: 15px;
  color: #0F172A;
  font-weight: 500;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 14px;
  display: block;
  margin-top: 24px;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background-color: #3B82F6;
  border-radius: 4px;
}

.items-section {
  margin-top: 16px;
  margin-bottom: 20px;
}

.item-list {
  background-color: #F8FAFC;
  border-radius: 10px;
  padding: 12px 18px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #E2E8F0;
}

.item-row:last-child {
  border-bottom: none;
}

.item-name {
  font-size: 14px;
  color: #475569;
}

.item-price {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}

.financial-details {
  margin-top: 28px;
  border-top: 1px solid #E2E8F0;
  padding-top: 20px;
}

.total-row {
  margin-top: 12px;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
}

.commission-row {
  font-size: 13px;
  color: #64748B;
}

.modal-status {
  margin-left: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 18px 24px;
  border-top: 1px solid #F1F5F9;
  gap: 14px;
  background-color: #F8FAFC;
}

.action-btn {
  padding: 10px 22px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background-color: #F8FAFC;
  color: #475569;
  border: 1px solid #E2E8F0;
}

.cancel-btn:hover {
  background-color: #F1F5F9;
  transform: translateY(-2px);
}

.cancel-btn:active {
  transform: translateY(0);
}

.primary-btn {
  background-color: #2563EB;
  color: white;
  border: none;
  box-shadow: 0 2px 5px rgba(37, 99, 235, 0.3);
}

.primary-btn:hover {
  background-color: #1D4ED8;
  transform: translateY(-2px);
}

.primary-btn:active {
  transform: translateY(0);
}

/* Responsive Adjustments - Enhanced */
@media (max-width: 768px) {
  .main-content {
    padding: 16px;
    padding-bottom: 80px;
  }
  
  .card-header {
    padding: 16px;
  }
  
  .table-body {
    padding: 0;
  }
  
  .mobile-card {
    margin: 12px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  }
  
  /* Override default table row styling for mobile */
  .mobile-card.table-row {
    display: block;
    border: 1px solid #E2E8F0;
  }
  
  .pagination {
    margin-top: 16px;
    gap: 12px;
  }
  
  /* Modal adjustments for mobile */
  .modal-content {
    width: 95%;
    max-height: 85vh;
    border-radius: 14px;
  }
  
  .modal-header, .modal-footer {
    padding: 16px;
  }
  
  .modal-body {
    padding: 20px 16px;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 18px;
  }
  
  .detail-label {
    width: 100%;
    margin-bottom: 6px;
    font-size: 13px;
  }
  
  .section-title {
    margin-top: 20px;
    margin-bottom: 12px;
  }
  
  .action-btn {
    padding: 10px 18px;
  }
  
  .empty-state {
    padding: 36px 0;
  }
}

/* Fix for iOS bottom safe area */
@supports (-webkit-touch-callout: none) {
  .mobile-nav {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
  
  .main-content {
    padding-bottom: calc(80px + env(safe-area-inset-bottom, 0));
  }
}

/* Animations & Transitions */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Status transition animations */
.status-badge {
  position: relative;
  overflow: hidden;
}

.status-badge::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Table row entrance animation */
.table-row {
  animation: fadeIn 0.3s ease-in;
}

/* Improved mobile navigation */
.mobile-nav {
  transition: transform 0.3s ease;
}

.mobile-nav.hidden {
  transform: translateY(100%);
}

/* Order count badge pulse */
.order-count {
  position: relative;
}

.order-count::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(59, 130, 246, 0.3);
  border-radius: 20px;
  z-index: -1;
  animation: pulse 2s infinite;
  opacity: 0;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
.mobile-logo-container {
  padding: 16px 0;
  text-align: center;
}

.mobile-logo {
  height: 36px;
  object-fit: contain;
  cursor: pointer;
}
</style>