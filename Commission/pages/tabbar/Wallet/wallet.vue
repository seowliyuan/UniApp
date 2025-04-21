<template>
  <view class="container">
    <!-- Web Top Nav -->
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
    <view v-if="!isWideScreen" class="mobile-nav">
      <NavBar :activeTab="activeTab" @changeTab="changeTab" />
    </view>

    <!-- Main Content -->
    <view class="main-content" :class="{ 'web-padding': isWideScreen }">
      <!-- Wallet Header -->
      <view class="wallet-header">
        <text class="wallet-title">Wallet: RM {{ currentBalance }}</text>
		<br />
        <!-- <text class="wallet-subtitle">Withdrawable: RM {{ withdrawableBalance }}</text> -->
      </view>

      <!-- Action Buttons -->
      <view class="action-buttons">
        <button class="action-btn" @click="handleClick('Withdraw Money')">💸 Withdraw Money</button>
        <button class="action-btn" @click="handleClick('Export CSV')">📊 Export CSV</button>
        <button class="action-btn" @click="handleClick('Transaction History')">🗒️ Transaction History</button>
        <button class="action-btn" @click="handleClick('Wallet Settings')">⚙️ Wallet Settings</button>
      </view>

      <!-- ✅ Mobile View (MAE-style) -->
      <view class="recent-transactions" v-if="!isWideScreen">
        <text class="transactions-title">Recent Transactions</text>
        <view class="transaction-table">
          <view class="transaction-row header">
            <text class="order-column">ID</text>
            <text class="order-column">Amount (RM)</text>
            <text class="order-column">Date</text>
          </view>
          <view
            class="transaction-row"
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            @click="openDetails(transaction)"
          >
            <text class="order-column">{{ transaction.id }}</text>
            <text class="order-column">{{ transaction.amount.toFixed(2) }}</text>
            <text class="order-column">{{ transaction.date}}</text>
          </view>
        </view>
      </view>

      <!-- ✅ Web View (Full Table) -->
      <view class="recent-transactions" v-else>
        <text class="transactions-title">Recent Transactions</text>
        <view class="transaction-table">
          <view class="transaction-row header">
            <text class="cell id">ID</text>
            <text class="cell">Reference</text>
            <text class="cell amount">Amount (RM)</text>
            <text class="cell date">Date</text>
          </view>
          <view
            class="transaction-row"
            v-for="transaction in recentTransactions"
            :key="transaction.id"
          >
            <text class="cell id">{{ transaction.id }}</text>
            <text class="cell">{{ transaction.reference }}</text>
            <text class="cell amount">{{ transaction.amount.toFixed(2) }}</text>
            <text class="cell date">{{ transaction.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Modal: Transaction Details -->
    <view class="modal-overlay" v-if="showModal" @click.self="closeDetails">
      <view class="modal-content">
        <text class="modal-title">Transaction Details</text>
        <view class="modal-body">
          <text><strong>ID:</strong> {{ selectedTransaction.id }}</text>
          <text><strong>Reference:</strong> {{ selectedTransaction.reference }}</text>
          <text><strong>Amount:</strong> RM {{ selectedTransaction.amount }}</text>
          <text><strong>Date:</strong> {{ selectedTransaction.date }}</text>
        </view>
        <button class="close-btn" @click="closeDetails">Close</button>
      </view>
    </view>

    <!-- Mobile Bottom Nav -->
    <view class="mobile-nav" v-if="!isWideScreen">
      <NavBar :activeTab="activeTab" @changeTab="changeTab" />
    </view>

    <!-- Withdraw Modal -->
    <view class="modal-overlay" v-if="showWithdrawModal" @click.self="showWithdrawModal = false">
      <view class="modal-content">
        <text class="modal-title">Withdraw Money</text>
        <text class="modal-subtext">Balance available: RM {{ withdrawableBalance }}</text>
        <view class="quick-amount-buttons">
          <button class="amount-button" @click="withdrawalAmount = '10.00'">RM10</button>
          <button class="amount-button" @click="withdrawalAmount = '50.00'">RM50</button>
          <button class="amount-button" @click="withdrawalAmount = '100.00'">RM100</button>
        </view>
        <input type="number" v-model="withdrawalAmount" placeholder="Enter amount" class="input" />
        <view class="bank-info">
          <text class="modal-subtext">Bank: {{ bankName }}</text>
          <text class="modal-subtext">Account No: {{ bankAccNo }}</text>
        </view>
        <button class="close-btn" @click="validateWithdraw">Proceed to Withdraw</button>
      </view>
    </view>

    <!-- Password Prompt -->
    <view class="modal-overlay" v-if="passwordPrompt" @click.self="passwordPrompt = false">
      <view class="modal-content">
        <text class="modal-title">Enter Password</text>
        <input type="password" v-model="passwordInput" class="input" />
        <button class="close-btn" @click="confirmWithdraw">Confirm</button>
      </view>
    </view>

    <!-- Status Message -->
    <view class="modal-overlay" v-if="withdrawMessage" @click.self="withdrawMessage = ''">
      <view class="modal-content">
        <text class="modal-title">{{ withdrawStatus }}</text>
        <text>{{ withdrawMessage }}</text>
        <button class="close-btn" @click="withdrawMessage = ''">Close</button>
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
      isWideScreen: true,
      logoSrc: '/static/zero_logo.png',  // Correct path to logo image
      activeTab: "wallet",
      currentBalance: 2550.15,
      showModal: false,
      selectedTransaction: {},
      recentTransactions: [
        { id: '532', reference: 'Withdrawal', amount: 200.0, date: '28/4/24 13:11' },
        { id: '513', reference: 'Commission Deposit', amount: 118.73, date: '28/4/24 15:00' },
        { id: '508', reference: 'Commission Deposit', amount: 154.22, date: '28/4/24 10:00' },
        { id: '506', reference: 'Commission Deposit', amount: 232.77, date: '29/4/24 11:30' },
        { id: '499', reference: 'Withdrawal', amount: 500.0, date: '16/2/24 23:30' },
      ],
	  showWithdrawModal: false,
    withdrawalAmount: '',
    withdrawStatus: '',
    withdrawMessage: '',
	withdrawableBalance: '2000',

    // CSV Export
    showCSVModal: false,
    startDate: '',
    endDate: '',
    csvRecord: [],
    
    // Wallet Settings
    showSettingsModal: false,
    bankName: '',
    bankAccNo: '',

    // Password Prompt (optional)
    passwordPrompt: false,
    passwordInput: '',
    };
  },
  onShow() {
    // Update activeTab whenever the page is shown
    this.activeTab = "wallet"; // This should match the current page
  	},
  mounted() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreen);
  },
  methods: {
	  handleClick(action) {
	      switch (action) {
	        case 'Withdraw Money':
	          this.showWithdrawModal = true;
	          break;
	        case 'Export CSV':
	          this.showCSVModal = true;
	          break;
	        case 'Transaction History':
	          uni.navigateTo({ url: '/pages/wallet/transaction-history' });
	          break;
	        case 'Wallet Settings':
	          this.showSettingsModal = true;
	          break;
	        default:
	          uni.showToast({ title: `Unknown action: ${action}`, icon: 'none' });
	      }
	    },
	  
	    async printCSV() {
	      try {
	        const username = uni.getStorageSync('username');
	        const res = await uni.request({
	          url: 'http://localhost/commission/backend/database/wallet.php',
	          method: 'POST',
	          data: {
	            username,
	            action: 'downloadCSV',
	            startDate: this.startDate,
	            endDate: this.endDate,
	          },
	        });
	        if (res.data?.csvRecord) {
	          this.csvRecord = res.data.csvRecord;
	          this.exportCSVToDevice();
	        }
	      } catch (err) {
	        console.error(err);
	        uni.showToast({ title: 'CSV export failed', icon: 'none' });
	      }
	    },
	  
	    exportCSVToDevice() {
	      const headers = ['id', 'type', 'amount', 'description', 'date'];
	      let csvContent = headers.join(',') + '\n';
	      this.csvRecord.forEach(row => {
	        csvContent += Object.values(row).join(',') + '\n';
	      });
	      const blob = new Blob([csvContent], { type: 'text/csv' });
	      const url = URL.createObjectURL(blob);
	      const anchor = document.createElement('a');
	      anchor.href = url;
	      anchor.download = 'Transaction_History.csv';
	      anchor.click();
	      URL.revokeObjectURL(url);
	      this.showCSVModal = false;
	    },
	  
	    async updateWalletSettings() {
	      try {
	        const username = uni.getStorageSync('username');
	        await uni.request({
	          url: 'http://localhost/commission/backend/database/wallet.php',
	          method: 'POST',
	          data: {
	            username,
	            action: 'update',
	            bankName: this.bankName,
	            bankNo: this.bankAccNo,
	          },
	        });
	        uni.showToast({ title: 'Updated!', icon: 'success' });
	        this.showSettingsModal = false;
	      } catch (err) {
	        console.error(err);
	        uni.showToast({ title: 'Update failed', icon: 'none' });
	      }
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
    // handleClick(page) {
    //   uni.showToast({
    //     title: `Clicked on ${page}`,
    //     icon: "none",
    //   });
    // },
    changeTab(tab) {
      this.activeTab = tab;
      const tabRoutes = {
		home: "/pages/tabbar/Home/home",
        wallet: "/pages/tabbar/Wallet/wallet",
        orders: "/pages/tabbar/Order/order",
      };
      uni.switchTab({ url: tabRoutes[tab] || "/" });
    },
    openDetails(transaction) {
      this.selectedTransaction = transaction;
      this.showModal = true;
    },
    closeDetails() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
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

/* Main Content */
.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 120px;
  box-sizing: border-box;
}

.web-padding { 
  padding-top: 80px;
}

/* Wallet Header */
.wallet-header {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  text-align: center;
  border-left: 4px solid #F5791F;
}

.wallet-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.wallet-subtitle {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.action-btn {
  background-color: #ffffff;
  color: #333;
  padding: 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  width: 48%;
  text-align: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: #FFF0E0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Recent Transactions */
.recent-transactions {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.transactions-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.transaction-table {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
}

.transaction-row {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.transaction-row.header {
  background-color: #f5f5f5;
  font-weight: bold;
  font-size: 14px;
  color: #555;
}

.transaction-row:last-child {
  border-bottom: none;
}

.transaction-row:hover {
  background-color: #f9f9f9;
}

.cell, .order-column {
  font-size: 14px;
  color: #333;
}

.cell {
  width: 25%;
}

.cell.id {
  width: 15%;
}

.cell.amount {
  width: 20%;
  font-weight: 500;
}

.cell.date {
  width: 25%;
  color: #666;
}

.order-column {
  width: 33%;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 80%;
  max-width: 500px;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.modal-subtext {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.modal-body text {
  display: block;
  margin-bottom: 12px;
  font-size: 15px;
}

.close-btn {
  margin-top: 20px;
  padding: 12px 16px;
  width: 100%;
  background-color: #F5791F;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background-color: #E16A10;
}

/* Form Elements */
.input {
  width: 100%;
  padding: 12px;
  margin: 8px 0 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.quick-amount-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.amount-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.amount-button:hover {
  background-color: #FFF0E0;
  border-color: #F5791F;
}

.bank-info {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  margin: 16px 0;
}

/* Logo Styling */
.mobile-logo-container {
  padding: 16px 0;
  text-align: center;
}

.mobile-logo {
  height: 36px;
  object-fit: contain;
  cursor: pointer;
}

/* Responsive Design */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
  
  .main-content {
    padding: 16px;
    padding-top: 70px;
    padding-bottom: 80px;
  }
  
  .transaction-row {
    padding: 12px;
  }
  
  .cell, .order-column {
    font-size: 13px;
  }
}

@media (max-width: 500px) {
  .transaction-row {
    flex-direction: row; /* make sure this stays horizontal */
    padding: 12px;
    gap: 0;
  }

  .order-column {
    width: 33.3%;
    font-size: 13px;
  }

  .transaction-row.header {
    display: flex; /* keep headers in mobile */
  }

  .order-column:last-child {
    position: static; /* no absolute positioning */
    font-size: 13px;
    color: #666;
  }
}


</style>
