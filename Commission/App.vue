<script>
export default {
  onLaunch() {
    const token = uni.getStorageSync("authToken"); // Check if the user is logged in
    if (!token) {
      // Redirect to login page if no token is found
      uni.redirectTo({
        url: "/pages/login/login",
      });
    }
  },
};
</script>

<style>
/*每个页面公共css */
</style>
