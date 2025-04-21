if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$5 = {
    data() {
      return {
        logoSrc: "/static/zero_logo.png",
        // Correct path to logo image
        username: "",
        password: "",
        passwordFieldType: "password",
        passwordIcon: "👁️",
        usernameError: "",
        passwordError: "",
        displayErrorText: false,
        errorText: "",
        loading: false
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
        formatAppLog("log", "at pages/login/login.vue:93", "🔵 Submit button clicked");
        const payload = {
          username: this.username,
          password: this.password
        };
        formatAppLog("log", "at pages/login/login.vue:100", "🟡 Payload:", payload);
        try {
          const response = await uni.request({
            url: "http://localhost:8000/login.php",
            method: "POST",
            data: payload,
            header: { "Content-Type": "application/json" }
          });
          formatAppLog("log", "at pages/login/login.vue:110", "🟢 Response received:", response);
          if (response.statusCode === 200 && response.data.success) {
            formatAppLog("log", "at pages/login/login.vue:113", "✅ Login successful");
            uni.setStorageSync("token", response.data.token);
            uni.setStorageSync("username", response.data.username);
            uni.switchTab({ url: "/pages/tabbar/Home/home" });
          } else {
            formatAppLog("warn", "at pages/login/login.vue:118", "⚠️ Login failed:", response.data.message);
            this.errorText = response.data.message || "Invalid username or password.";
            this.displayErrorText = true;
          }
        } catch (error) {
          formatAppLog("error", "at pages/login/login.vue:123", "🔴 Error during login request:", error);
          this.errorText = "Failed to connect to the server. Please try again.";
          this.displayErrorText = true;
        } finally {
          this.loading = false;
        }
      },
      togglePassword() {
        this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
        this.passwordIcon = this.passwordFieldType === "password" ? "👁️" : "👁️‍🗨️";
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "logoContainer" }, [
      vue.createCommentVNode(" Error Container "),
      vue.createElementVNode("image", {
        src: $data.logoSrc,
        class: "mobile-logo",
        mode: "widthFix",
        onError: _cache[0] || (_cache[0] = (...args) => _ctx.handleError && _ctx.handleError(...args))
      }, null, 40, ["src"]),
      $data.displayErrorText ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "errorContainer"
      }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($data.errorText),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Login Form "),
      vue.createElementVNode(
        "form",
        {
          onSubmit: _cache[6] || (_cache[6] = vue.withModifiers((...args) => $options.handleSubmit && $options.handleSubmit(...args), ["prevent"])),
          class: "form-card"
        },
        [
          vue.createCommentVNode(" Username "),
          vue.createElementVNode("label", null, "Username:"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              required: "",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.username = $event),
              name: "username",
              class: "uni-input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.username]
          ]),
          vue.createElementVNode(
            "view",
            { class: "error" },
            vue.toDisplayString($data.usernameError),
            1
            /* TEXT */
          ),
          vue.createCommentVNode(" Password "),
          vue.createElementVNode("label", null, "Password:"),
          vue.createElementVNode("view", { class: "password-container" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              type: $data.passwordFieldType,
              required: "",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.password = $event),
              name: "password",
              class: "uni-input"
            }, null, 8, ["type"]), [
              [vue.vModelDynamic, $data.password]
            ]),
            vue.createElementVNode(
              "text",
              {
                class: "toggle-password",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.togglePassword && $options.togglePassword(...args))
              },
              vue.toDisplayString($data.passwordIcon),
              1
              /* TEXT */
            )
          ]),
          $data.passwordError ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "error"
            },
            vue.toDisplayString($data.passwordError),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" Submit Button "),
          vue.createElementVNode("button", {
            class: "submit-btn",
            disabled: $data.loading,
            onClick: _cache[4] || (_cache[4] = (...args) => $options.handleSubmit && $options.handleSubmit(...args))
          }, [
            $data.loading ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, "Loading...")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, "Login"))
          ], 8, ["disabled"]),
          vue.createCommentVNode(" Forgot Password "),
          vue.createElementVNode("view", {
            class: "link",
            onClick: _cache[5] || (_cache[5] = (...args) => $options.openForgotPassword && $options.openForgotPassword(...args))
          }, " Forgot Password? ")
        ],
        32
        /* NEED_HYDRATION */
      ),
      vue.createCommentVNode(" Skip Buttons "),
      vue.createElementVNode("button", {
        onClick: _cache[7] || (_cache[7] = ($event) => $options.goToNextPage2())
      }, "Home"),
      vue.createElementVNode("button", {
        onClick: _cache[8] || (_cache[8] = ($event) => $options.goToNextPage())
      }, "Wallet"),
      vue.createElementVNode("button", {
        onClick: _cache[9] || (_cache[9] = ($event) => $options.goToNextPage1())
      }, "Orders")
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-e4e4508d"], ["__file", "/Users/appnicorn/Desktop/UniApp/Commission/pages/login/login.vue"]]);
  const _sfc_main$4 = {
    props: {
      activeTab: {
        type: String,
        required: true
      }
    },
    methods: {
      handleClick(tab) {
        const routes = {
          home: "/pages/tabbar/Home/home",
          wallet: "/pages/tabbar/Wallet/wallet",
          orders: "/pages/tabbar/Order/order"
        };
        this.$emit("changeTab", tab);
        if (this.activeTab !== tab && routes[tab]) {
          uni.switchTab({ url: routes[tab] });
        }
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "bottom-nav safe-area-inset-bottom" }, [
      vue.createElementVNode(
        "button",
        {
          class: vue.normalizeClass(["nav-btn", { active: $props.activeTab === "home" }]),
          onClick: _cache[0] || (_cache[0] = ($event) => $options.handleClick("home"))
        },
        [
          vue.createElementVNode("view", { class: "icon-container" }, [
            vue.createElementVNode("text", { class: "icon" }, "🏠"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["indicator", { "indicator-active": $props.activeTab === "home" }])
              },
              null,
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("text", { class: "label" }, "Home")
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "button",
        {
          class: vue.normalizeClass(["nav-btn", { active: $props.activeTab === "wallet" }]),
          onClick: _cache[1] || (_cache[1] = ($event) => $options.handleClick("wallet"))
        },
        [
          vue.createElementVNode("view", { class: "icon-container" }, [
            vue.createElementVNode("text", { class: "icon" }, "💳"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["indicator", { "indicator-active": $props.activeTab === "wallet" }])
              },
              null,
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("text", { class: "label" }, "Wallet")
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "button",
        {
          class: vue.normalizeClass(["nav-btn", { active: $props.activeTab === "orders" }]),
          onClick: _cache[2] || (_cache[2] = ($event) => $options.handleClick("orders"))
        },
        [
          vue.createElementVNode("view", { class: "icon-container" }, [
            vue.createElementVNode("text", { class: "icon" }, "📊"),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["indicator", { "indicator-active": $props.activeTab === "orders" }])
              },
              null,
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("text", { class: "label" }, "Orders")
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const NavBar = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-cba00c0f"], ["__file", "/Users/appnicorn/Desktop/UniApp/Commission/pages/Nav/NavBar.vue"]]);
  const _imports_0 = "/static/zero_logo.png";
  const _imports_1 = "/static/logout.png";
  const _sfc_main$3 = {
    components: { NavBar },
    data() {
      return {
        logoSrc: "/static/zero_logo.png",
        // Correct path to logo image
        isWideScreen: true,
        activeTab: "home",
        // Set the default tab to match the current page
        username: "",
        overallCommission: 100,
        totalSales: 10,
        walletAmount: 1e3,
        totalOrders: 100,
        verifiedOrders: 20,
        recentOrders: [
          { id: "532", details: "Withdrawal", total: 200, date: "28/4/24 13:11" },
          { id: "513", details: "Commission Deposit", total: 118.73, date: "28/4/24 15:00" },
          { id: "508", details: "Commission Deposit", total: 154.22, date: "28/4/24 10:00" },
          { id: "506", details: "Commission Deposit", total: 232.77, date: "29/4/24 11:30" },
          { id: "499", details: "Withdrawal", total: 500, date: "16/2/24 23:30" }
        ],
        showPopup: false,
        selectedOrder: {}
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
      this.activeTab = "home";
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
          url: "/pages/tabbar/Home/home"
          // Tabbar page
        });
      },
      checkScreen() {
        if (typeof window !== "undefined") {
          this.isWideScreen = window.innerWidth >= 768;
        } else {
          uni.getSystemInfo({
            success: (res) => {
              const isMobile = res.platform === "ios" || res.platform === "android";
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
          orders: "/pages/tabbar/Order/order"
        };
        uni.switchTab({ url: routes[tab] || "/" });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NavBar = vue.resolveComponent("NavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 🖥️ Top Nav Bar for Web (Logo + Horizontal Menu) "),
      $data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "web-nav"
      }, [
        vue.createElementVNode("view", { class: "nav-bar" }, [
          vue.createElementVNode("img", {
            onClick: _cache[0] || (_cache[0] = ($event) => $options.home()),
            src: _imports_0,
            alt: "Logo",
            class: "mobile-logo"
          }),
          vue.createElementVNode("view", { class: "nav-buttons" }, [
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "home" }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.changeTab("home"))
              },
              [
                vue.createTextVNode("Home "),
                vue.createElementVNode("text", { class: "icon" }, "🏠")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "wallet" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => $options.changeTab("wallet"))
              },
              [
                vue.createTextVNode("Wallet "),
                vue.createElementVNode("text", { class: "icon" }, "💳")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "orders" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $options.changeTab("orders"))
              },
              [
                vue.createTextVNode("Orders "),
                vue.createElementVNode("text", { class: "icon" }, "📊")
              ],
              2
              /* CLASS */
            )
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 📱 Mobile Logo "),
          vue.createElementVNode("view", { class: "mobile-logo-container" }, [
            vue.createCommentVNode(" Use image component for mobile "),
            vue.createElementVNode("image", {
              src: $data.logoSrc,
              class: "mobile-logo",
              mode: "widthFix",
              onError: _cache[4] || (_cache[4] = (...args) => _ctx.handleError && _ctx.handleError(...args))
            }, null, 40, ["src"])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" 📱 Bottom NavBar "),
      !$data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "mobile-nav"
      }, [
        vue.createVNode(_component_NavBar, {
          activeTab: $data.activeTab,
          onChangeTab: $options.changeTab
        }, null, 8, ["activeTab", "onChangeTab"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Main Content "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["main-content", { "web-padding": $data.isWideScreen }])
        },
        [
          vue.createCommentVNode(" Header "),
          vue.createElementVNode("view", { class: "header" }, [
            vue.createElementVNode(
              "text",
              { class: "greeting" },
              "Hello, " + vue.toDisplayString($data.username),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "notifications" }, [
              vue.createElementVNode("image", {
                src: _imports_1,
                class: "icon",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.handleLogout && $options.handleLogout(...args))
              })
            ])
          ]),
          vue.createCommentVNode(" Stats "),
          vue.createElementVNode("view", { class: "stats" }, [
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode("text", { class: "stat-title" }, "Commission: "),
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                "RM " + vue.toDisplayString($data.overallCommission),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode("text", { class: "stat-title" }, "Total Sales: "),
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                "RM " + vue.toDisplayString($data.totalSales),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode("text", { class: "stat-title" }, "Number of Orders: "),
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.totalOrders),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode("text", { class: "stat-title" }, "Verified Orders: "),
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.verifiedOrders),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" Wallet Section "),
          vue.createElementVNode("view", {
            class: "wallet",
            onClick: _cache[6] || (_cache[6] = ($event) => $options.goToWallet())
          }, [
            vue.createElementVNode("text", { class: "wallet-title" }, "Wallet Balance"),
            vue.createElementVNode("view", { class: "wallet-details" }, [
              vue.createElementVNode(
                "text",
                { class: "wallet-value" },
                "RM " + vue.toDisplayString($data.walletAmount),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createCommentVNode(" Recent Orders (Styled as a Table) "),
          vue.createElementVNode("view", { class: "recent-orders" }, [
            vue.createElementVNode("text", { class: "recent-orders-title" }, "Recent 5 Orders"),
            vue.createCommentVNode(" Table Rows "),
            vue.createElementVNode("view", { class: "order-table" }, [
              vue.createElementVNode("view", { class: "order-header" }, [
                vue.createElementVNode("text", { class: "order-column" }, "Order ID"),
                vue.createElementVNode("text", { class: "order-column" }, "Amount"),
                vue.createElementVNode("text", { class: "order-column" }, "Date")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.recentOrders, (order) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "order-item",
                    key: order.id,
                    onClick: ($event) => $options.showOrderDetails(order)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "order-column" },
                      vue.toDisplayString(order.id),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "order-column" },
                      "RM " + vue.toDisplayString(order.total),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "order-column" },
                      vue.toDisplayString(order.date),
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createCommentVNode(" Order Details Popup "),
          $data.showPopup ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "order-popup"
          }, [
            vue.createElementVNode("view", { class: "popup-content" }, [
              vue.createElementVNode("text", { class: "popup-title" }, "Order Details"),
              vue.createElementVNode("view", { class: "popup-info" }, [
                vue.createElementVNode("text", null, [
                  vue.createElementVNode("strong", null, "Order ID:"),
                  vue.createTextVNode(
                    " " + vue.toDisplayString($data.selectedOrder.id),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createTextVNode(),
                vue.createElementVNode("br"),
                vue.createElementVNode("text", null, [
                  vue.createElementVNode("strong", null, "Details:"),
                  vue.createTextVNode(
                    " " + vue.toDisplayString($data.selectedOrder.details),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("br"),
                vue.createElementVNode("text", null, [
                  vue.createElementVNode("strong", null, "Amount:"),
                  vue.createTextVNode(
                    " RM " + vue.toDisplayString($data.selectedOrder.total),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("br"),
                vue.createElementVNode("text", null, [
                  vue.createElementVNode("strong", null, "Date:"),
                  vue.createTextVNode(
                    " " + vue.toDisplayString($data.selectedOrder.date),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("br")
              ]),
              vue.createElementVNode("button", {
                class: "popup-close-btn",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.closePopup && $options.closePopup(...args))
              }, "Close")
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const PagesTabbarHomeHome = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-9edee214"], ["__file", "/Users/appnicorn/Desktop/UniApp/Commission/pages/tabbar/Home/home.vue"]]);
  const _sfc_main$2 = {
    components: { NavBar },
    data() {
      return {
        isWideScreen: true,
        logoSrc: "/static/zero_logo.png",
        // Correct path to logo image
        activeTab: "wallet",
        currentBalance: 2550.15,
        showModal: false,
        selectedTransaction: {},
        recentTransactions: [
          { id: "532", reference: "Withdrawal", amount: 200, date: "28/4/24 13:11" },
          { id: "513", reference: "Commission Deposit", amount: 118.73, date: "28/4/24 15:00" },
          { id: "508", reference: "Commission Deposit", amount: 154.22, date: "28/4/24 10:00" },
          { id: "506", reference: "Commission Deposit", amount: 232.77, date: "29/4/24 11:30" },
          { id: "499", reference: "Withdrawal", amount: 500, date: "16/2/24 23:30" }
        ],
        showWithdrawModal: false,
        withdrawalAmount: "",
        withdrawStatus: "",
        withdrawMessage: "",
        withdrawableBalance: "2000",
        // CSV Export
        showCSVModal: false,
        startDate: "",
        endDate: "",
        csvRecord: [],
        // Wallet Settings
        showSettingsModal: false,
        bankName: "",
        bankAccNo: "",
        // Password Prompt (optional)
        passwordPrompt: false,
        passwordInput: ""
      };
    },
    onShow() {
      this.activeTab = "wallet";
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
          case "Withdraw Money":
            this.showWithdrawModal = true;
            break;
          case "Export CSV":
            this.showCSVModal = true;
            break;
          case "Transaction History":
            uni.navigateTo({ url: "/pages/wallet/transaction-history" });
            break;
          case "Wallet Settings":
            this.showSettingsModal = true;
            break;
          default:
            uni.showToast({ title: `Unknown action: ${action}`, icon: "none" });
        }
      },
      async printCSV() {
        var _a;
        try {
          const username = uni.getStorageSync("username");
          const res = await uni.request({
            url: "http://localhost/commission/backend/database/wallet.php",
            method: "POST",
            data: {
              username,
              action: "downloadCSV",
              startDate: this.startDate,
              endDate: this.endDate
            }
          });
          if ((_a = res.data) == null ? void 0 : _a.csvRecord) {
            this.csvRecord = res.data.csvRecord;
            this.exportCSVToDevice();
          }
        } catch (err) {
          formatAppLog("error", "at pages/tabbar/Wallet/wallet.vue:243", err);
          uni.showToast({ title: "CSV export failed", icon: "none" });
        }
      },
      exportCSVToDevice() {
        const headers = ["id", "type", "amount", "description", "date"];
        let csvContent = headers.join(",") + "\n";
        this.csvRecord.forEach((row) => {
          csvContent += Object.values(row).join(",") + "\n";
        });
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Transaction_History.csv";
        anchor.click();
        URL.revokeObjectURL(url);
        this.showCSVModal = false;
      },
      async updateWalletSettings() {
        try {
          const username = uni.getStorageSync("username");
          await uni.request({
            url: "http://localhost/commission/backend/database/wallet.php",
            method: "POST",
            data: {
              username,
              action: "update",
              bankName: this.bankName,
              bankNo: this.bankAccNo
            }
          });
          uni.showToast({ title: "Updated!", icon: "success" });
          this.showSettingsModal = false;
        } catch (err) {
          formatAppLog("error", "at pages/tabbar/Wallet/wallet.vue:280", err);
          uni.showToast({ title: "Update failed", icon: "none" });
        }
      },
      home() {
        uni.switchTab({
          url: "/pages/tabbar/Home/home"
          // Tabbar page
        });
      },
      checkScreen() {
        if (typeof window !== "undefined") {
          this.isWideScreen = window.innerWidth >= 768;
        } else {
          uni.getSystemInfo({
            success: (res) => {
              const isMobile = res.platform === "ios" || res.platform === "android";
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
          orders: "/pages/tabbar/Order/order"
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NavBar = vue.resolveComponent("NavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" Web Top Nav "),
      $data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "web-nav"
      }, [
        vue.createElementVNode("view", { class: "nav-bar" }, [
          vue.createElementVNode("img", {
            onClick: _cache[0] || (_cache[0] = ($event) => $options.home()),
            src: _imports_0,
            alt: "Logo",
            class: "mobile-logo"
          }),
          vue.createElementVNode("view", { class: "nav-buttons" }, [
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "home" }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.changeTab("home"))
              },
              [
                vue.createTextVNode("Home "),
                vue.createElementVNode("text", { class: "icon" }, "🏠")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "wallet" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => $options.changeTab("wallet"))
              },
              [
                vue.createTextVNode("Wallet "),
                vue.createElementVNode("text", { class: "icon" }, "💳")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "orders" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $options.changeTab("orders"))
              },
              [
                vue.createTextVNode("Orders "),
                vue.createElementVNode("text", { class: "icon" }, "📊")
              ],
              2
              /* CLASS */
            )
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" 📱 Mobile Logo "),
          vue.createElementVNode("view", { class: "mobile-logo-container" }, [
            vue.createCommentVNode(" Use image component for mobile "),
            vue.createElementVNode("image", {
              src: $data.logoSrc,
              class: "mobile-logo",
              mode: "widthFix",
              onError: _cache[4] || (_cache[4] = (...args) => _ctx.handleError && _ctx.handleError(...args))
            }, null, 40, ["src"])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      !$data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "mobile-nav"
      }, [
        vue.createVNode(_component_NavBar, {
          activeTab: $data.activeTab,
          onChangeTab: $options.changeTab
        }, null, 8, ["activeTab", "onChangeTab"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Main Content "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["main-content", { "web-padding": $data.isWideScreen }])
        },
        [
          vue.createCommentVNode(" Wallet Header "),
          vue.createElementVNode("view", { class: "wallet-header" }, [
            vue.createElementVNode(
              "text",
              { class: "wallet-title" },
              "Wallet: RM " + vue.toDisplayString($data.currentBalance),
              1
              /* TEXT */
            ),
            vue.createElementVNode("br"),
            vue.createCommentVNode(' <text class="wallet-subtitle">Withdrawable: RM {{ withdrawableBalance }}</text> ')
          ]),
          vue.createCommentVNode(" Action Buttons "),
          vue.createElementVNode("view", { class: "action-buttons" }, [
            vue.createElementVNode("button", {
              class: "action-btn",
              onClick: _cache[5] || (_cache[5] = ($event) => $options.handleClick("Withdraw Money"))
            }, "💸 Withdraw Money"),
            vue.createElementVNode("button", {
              class: "action-btn",
              onClick: _cache[6] || (_cache[6] = ($event) => $options.handleClick("Export CSV"))
            }, "📊 Export CSV"),
            vue.createElementVNode("button", {
              class: "action-btn",
              onClick: _cache[7] || (_cache[7] = ($event) => $options.handleClick("Transaction History"))
            }, "🗒️ Transaction History"),
            vue.createElementVNode("button", {
              class: "action-btn",
              onClick: _cache[8] || (_cache[8] = ($event) => $options.handleClick("Wallet Settings"))
            }, "⚙️ Wallet Settings")
          ]),
          vue.createCommentVNode(" ✅ Mobile View (MAE-style) "),
          !$data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "recent-transactions"
          }, [
            vue.createElementVNode("text", { class: "transactions-title" }, "Recent Transactions"),
            vue.createElementVNode("view", { class: "transaction-table" }, [
              vue.createElementVNode("view", { class: "transaction-row header" }, [
                vue.createElementVNode("text", { class: "order-column" }, "ID"),
                vue.createElementVNode("text", { class: "order-column" }, "Amount (RM)"),
                vue.createElementVNode("text", { class: "order-column" }, "Date")
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.recentTransactions, (transaction) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "transaction-row",
                    key: transaction.id,
                    onClick: ($event) => $options.openDetails(transaction)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "order-column" },
                      vue.toDisplayString(transaction.id),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "order-column" },
                      vue.toDisplayString(transaction.amount.toFixed(2)),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "order-column" },
                      vue.toDisplayString(transaction.date),
                      1
                      /* TEXT */
                    )
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" ✅ Web View (Full Table) "),
              vue.createElementVNode("view", { class: "recent-transactions" }, [
                vue.createElementVNode("text", { class: "transactions-title" }, "Recent Transactions"),
                vue.createElementVNode("view", { class: "transaction-table" }, [
                  vue.createElementVNode("view", { class: "transaction-row header" }, [
                    vue.createElementVNode("text", { class: "cell id" }, "ID"),
                    vue.createElementVNode("text", { class: "cell" }, "Reference"),
                    vue.createElementVNode("text", { class: "cell amount" }, "Amount (RM)"),
                    vue.createElementVNode("text", { class: "cell date" }, "Date")
                  ]),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.recentTransactions, (transaction) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "transaction-row",
                        key: transaction.id
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "cell id" },
                          vue.toDisplayString(transaction.id),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "cell" },
                          vue.toDisplayString(transaction.reference),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "cell amount" },
                          vue.toDisplayString(transaction.amount.toFixed(2)),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "cell date" },
                          vue.toDisplayString(transaction.date),
                          1
                          /* TEXT */
                        )
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          ))
        ],
        2
        /* CLASS */
      ),
      vue.createCommentVNode(" Modal: Transaction Details "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 3,
        class: "modal-overlay",
        onClick: _cache[10] || (_cache[10] = vue.withModifiers((...args) => $options.closeDetails && $options.closeDetails(...args), ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "Transaction Details"),
          vue.createElementVNode("view", { class: "modal-body" }, [
            vue.createElementVNode("text", null, [
              vue.createElementVNode("strong", null, "ID:"),
              vue.createTextVNode(
                " " + vue.toDisplayString($data.selectedTransaction.id),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("text", null, [
              vue.createElementVNode("strong", null, "Reference:"),
              vue.createTextVNode(
                " " + vue.toDisplayString($data.selectedTransaction.reference),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("text", null, [
              vue.createElementVNode("strong", null, "Amount:"),
              vue.createTextVNode(
                " RM " + vue.toDisplayString($data.selectedTransaction.amount),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("text", null, [
              vue.createElementVNode("strong", null, "Date:"),
              vue.createTextVNode(
                " " + vue.toDisplayString($data.selectedTransaction.date),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("button", {
            class: "close-btn",
            onClick: _cache[9] || (_cache[9] = (...args) => $options.closeDetails && $options.closeDetails(...args))
          }, "Close")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Mobile Bottom Nav "),
      !$data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 4,
        class: "mobile-nav"
      }, [
        vue.createVNode(_component_NavBar, {
          activeTab: $data.activeTab,
          onChangeTab: $options.changeTab
        }, null, 8, ["activeTab", "onChangeTab"])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Withdraw Modal "),
      $data.showWithdrawModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 5,
        class: "modal-overlay",
        onClick: _cache[16] || (_cache[16] = vue.withModifiers(($event) => $data.showWithdrawModal = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "Withdraw Money"),
          vue.createElementVNode(
            "text",
            { class: "modal-subtext" },
            "Balance available: RM " + vue.toDisplayString($data.withdrawableBalance),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "quick-amount-buttons" }, [
            vue.createElementVNode("button", {
              class: "amount-button",
              onClick: _cache[11] || (_cache[11] = ($event) => $data.withdrawalAmount = "10.00")
            }, "RM10"),
            vue.createElementVNode("button", {
              class: "amount-button",
              onClick: _cache[12] || (_cache[12] = ($event) => $data.withdrawalAmount = "50.00")
            }, "RM50"),
            vue.createElementVNode("button", {
              class: "amount-button",
              onClick: _cache[13] || (_cache[13] = ($event) => $data.withdrawalAmount = "100.00")
            }, "RM100")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => $data.withdrawalAmount = $event),
              placeholder: "Enter amount",
              class: "input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.withdrawalAmount]
          ]),
          vue.createElementVNode("view", { class: "bank-info" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-subtext" },
              "Bank: " + vue.toDisplayString($data.bankName),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "text",
              { class: "modal-subtext" },
              "Account No: " + vue.toDisplayString($data.bankAccNo),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("button", {
            class: "close-btn",
            onClick: _cache[15] || (_cache[15] = (...args) => _ctx.validateWithdraw && _ctx.validateWithdraw(...args))
          }, "Proceed to Withdraw")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Password Prompt "),
      $data.passwordPrompt ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 6,
        class: "modal-overlay",
        onClick: _cache[19] || (_cache[19] = vue.withModifiers(($event) => $data.passwordPrompt = false, ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("text", { class: "modal-title" }, "Enter Password"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "password",
              "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.passwordInput = $event),
              class: "input"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.passwordInput]
          ]),
          vue.createElementVNode("button", {
            class: "close-btn",
            onClick: _cache[18] || (_cache[18] = (...args) => _ctx.confirmWithdraw && _ctx.confirmWithdraw(...args))
          }, "Confirm")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" Status Message "),
      $data.withdrawMessage ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 7,
        class: "modal-overlay",
        onClick: _cache[21] || (_cache[21] = vue.withModifiers(($event) => $data.withdrawMessage = "", ["self"]))
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "text",
            { class: "modal-title" },
            vue.toDisplayString($data.withdrawStatus),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($data.withdrawMessage),
            1
            /* TEXT */
          ),
          vue.createElementVNode("button", {
            class: "close-btn",
            onClick: _cache[20] || (_cache[20] = ($event) => $data.withdrawMessage = "")
          }, "Close")
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesTabbarWalletWallet = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-6b27e877"], ["__file", "/Users/appnicorn/Desktop/UniApp/Commission/pages/tabbar/Wallet/wallet.vue"]]);
  const _sfc_main$1 = {
    components: { NavBar },
    data() {
      return {
        isWideScreen: true,
        logoSrc: "/static/zero_logo.png",
        // Correct path to logo image
        activeTab: "orders",
        items: [],
        search: "",
        searchedOrders: [],
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        pagedOrders: [],
        showModal: false,
        selectedOrder: null
      };
    },
    mounted() {
      this.checkScreen();
      uni.onWindowResize(this.checkScreen);
      this.loadMockData();
    },
    checkScreen() {
      uni.getSystemInfo({
        success: (res) => {
          this.isWideScreen = res.windowWidth >= 768;
        }
      });
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.checkScreen);
    },
    onShow() {
      this.activeTab = "orders";
    },
    methods: {
      home() {
        uni.switchTab({
          url: "/pages/tabbar/Home/home"
        });
      },
      checkScreen() {
        if (typeof window !== "undefined") {
          this.isWideScreen = window.innerWidth >= 768;
        } else {
          uni.getSystemInfo({
            success: (res) => {
              const isMobile = res.platform === "ios" || res.platform === "android";
              this.isWideScreen = !isMobile;
            }
          });
        }
      },
      handleError() {
        formatAppLog("error", "at pages/tabbar/Order/order.vue:259", "Failed to load logo image");
      },
      changeTab(tab) {
        this.activeTab = tab;
        const routes = {
          home: "/pages/tabbar/Home/home",
          wallet: "/pages/tabbar/Wallet/wallet",
          orders: "/pages/tabbar/Order/order"
        };
        uni.switchTab({ url: routes[tab] || "/" });
      },
      fetchOrders() {
        uni.request({
          url: "http://localhost:8000/orders.php",
          method: "GET",
          success: (res) => {
            formatAppLog("log", "at pages/tabbar/Order/order.vue:275", "API Success:", res.data);
            if (res.statusCode === 200 && Array.isArray(res.data)) {
              this.items = res.data;
              this.searchedOrders = [...this.items];
              this.totalPages = Math.ceil(this.searchedOrders.length / this.pageSize);
              this.updatePagedOrders();
            } else {
              formatAppLog("error", "at pages/tabbar/Order/order.vue:282", "Invalid response structure");
              this.loadMockData();
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/tabbar/Order/order.vue:287", "API Error:", err);
            this.loadMockData();
          }
        });
      },
      loadMockData() {
        formatAppLog("log", "at pages/tabbar/Order/order.vue:293", "Loading mock data...");
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
              { order_item_name: "Product B", item_price: 80 }
            ]
          },
          {
            order_id: "ORD002",
            order_date: "2025-04-12",
            customer: "Jane Smith",
            status: "Pending",
            total_amount: 299.5,
            commission: 29.95,
            items: [
              { order_item_name: "Product C", item_price: 299.5 }
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
              { order_item_name: "Product D", item_price: 45.5 },
              { order_item_name: "Product E", item_price: 44.25 }
            ]
          },
          {
            order_id: "ORD004",
            order_date: "2025-04-08",
            customer: "Sarah Williams",
            status: "Cancelled",
            total_amount: 199,
            commission: 0,
            items: [
              { order_item_name: "Product F", item_price: 199 }
            ]
          },
          {
            order_id: "ORD004",
            order_date: "2025-04-08",
            customer: "Sarah Williams",
            status: "Cancelled",
            total_amount: 199,
            commission: 0,
            items: [
              { order_item_name: "Product F", item_price: 199 }
            ]
          },
          {
            order_id: "ORD004",
            order_date: "2025-04-08",
            customer: "Sarah Williams",
            status: "Cancelled",
            total_amount: 199,
            commission: 0,
            items: [
              { order_item_name: "Product F", item_price: 199 }
            ]
          },
          {
            order_id: "ORD004",
            order_date: "2025-04-08",
            customer: "Sarah Williams",
            status: "Cancelled",
            total_amount: 199,
            commission: 0,
            items: [
              { order_item_name: "Product F", item_price: 199 }
            ]
          }
        ];
        this.applyFilters();
      },
      applyFilters() {
        const term = this.search.trim().toLowerCase();
        if (!this.items || this.items.length === 0) {
          this.searchedOrders = [];
          this.pagedOrders = [];
          this.totalPages = 1;
          this.currentPage = 1;
          return;
        }
        this.searchedOrders = term ? this.items.filter((order) => order.order_id.toLowerCase().includes(term)) : [...this.items];
        this.totalPages = Math.ceil(this.searchedOrders.length / this.pageSize);
        this.currentPage = 1;
        this.updatePagedOrders();
      },
      updatePagedOrders() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.pagedOrders = this.searchedOrders.slice(startIndex, startIndex + this.pageSize);
      },
      changePage(page) {
        if (page < 1 || page > this.totalPages)
          return;
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
          icon: "success"
        });
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      },
      formatDate(dateString) {
        if (!dateString)
          return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-MY", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      },
      getStatusClass(status) {
        if (!status)
          return "status-unknown";
        switch (status.toLowerCase()) {
          case "complete":
            return "status-complete";
          case "pending":
            return "status-pending";
          case "cancelled":
            return "status-cancelled";
          case "processing":
            return "status-processing";
          default:
            return "status-unknown";
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_NavBar = vue.resolveComponent("NavBar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" Top Nav Bar for Web (Logo + Horizontal Menu) "),
      $data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "web-nav"
      }, [
        vue.createElementVNode("view", { class: "nav-bar" }, [
          vue.createElementVNode("img", {
            onClick: _cache[0] || (_cache[0] = ($event) => $options.home()),
            src: _imports_0,
            alt: "Logo",
            class: "mobile-logo"
          }),
          vue.createElementVNode("view", { class: "nav-buttons" }, [
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "home" }]),
                onClick: _cache[1] || (_cache[1] = ($event) => $options.changeTab("home"))
              },
              [
                vue.createTextVNode("Home "),
                vue.createElementVNode("text", { class: "icon" }, "🏠")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "wallet" }]),
                onClick: _cache[2] || (_cache[2] = ($event) => $options.changeTab("wallet"))
              },
              [
                vue.createTextVNode("Wallet "),
                vue.createElementVNode("text", { class: "icon" }, "💳")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["nav-btn", { active: $data.activeTab === "orders" }]),
                onClick: _cache[3] || (_cache[3] = ($event) => $options.changeTab("orders"))
              },
              [
                vue.createTextVNode("Orders "),
                vue.createElementVNode("text", { class: "icon" }, "📊")
              ],
              2
              /* CLASS */
            )
          ])
        ])
      ])) : (vue.openBlock(), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        [
          vue.createCommentVNode(" Mobile Logo "),
          vue.createElementVNode("view", { class: "mobile-logo-container" }, [
            vue.createCommentVNode(" Use image component for mobile "),
            vue.createElementVNode("image", {
              src: $data.logoSrc,
              class: "mobile-logo",
              mode: "widthFix",
              onError: _cache[4] || (_cache[4] = (...args) => $options.handleError && $options.handleError(...args))
            }, null, 40, ["src"])
          ])
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      vue.createCommentVNode(" Main Content "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["main-content", { "web-padding": $data.isWideScreen }])
        },
        [
          vue.createCommentVNode(" Search and Filter "),
          vue.createCommentVNode(" Search and Filter (Separate for Web & Mobile) "),
          $data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "search-filter-container"
          }, [
            vue.createElementVNode("view", { class: "search-input-wrapper web-search" }, [
              vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.search = $event),
                  placeholder: "Search Order ID",
                  onInput: _cache[6] || (_cache[6] = (...args) => $options.applyFilters && $options.applyFilters(...args)),
                  class: "search-input"
                },
                null,
                544
                /* NEED_HYDRATION, NEED_PATCH */
              ), [
                [vue.vModelText, $data.search]
              ])
            ])
          ])) : (vue.openBlock(), vue.createElementBlock(
            vue.Fragment,
            { key: 1 },
            [
              vue.createCommentVNode(" 📱 Mobile Search Bar "),
              vue.createElementVNode("view", { class: "search-filter-container" }, [
                vue.createElementVNode("view", { class: "search-input-wrapper mobile-search" }, [
                  vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
                  vue.withDirectives(vue.createElementVNode(
                    "input",
                    {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $data.search = $event),
                      placeholder: "Search Order ID",
                      onInput: _cache[8] || (_cache[8] = (...args) => $options.applyFilters && $options.applyFilters(...args)),
                      class: "search-input"
                    },
                    null,
                    544
                    /* NEED_HYDRATION, NEED_PATCH */
                  ), [
                    [vue.vModelText, $data.search]
                  ])
                ])
              ])
            ],
            2112
            /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
          )),
          vue.createCommentVNode(" Orders Card "),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("view", { class: "card-header" }, [
              vue.createElementVNode("text", { class: "card-title" }, "Order List"),
              vue.createElementVNode(
                "text",
                { class: "order-count" },
                vue.toDisplayString($data.searchedOrders.length) + " orders",
                1
                /* TEXT */
              )
            ]),
            vue.createCommentVNode(" Table for Desktop / Cards for Mobile "),
            vue.createElementVNode("view", { class: "table-container" }, [
              vue.createCommentVNode(" Table Header (Desktop Only) "),
              $data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "table-header"
              }, [
                vue.createElementVNode("text", { class: "table-header-cell" }, "Order ID"),
                vue.createElementVNode("text", { class: "table-header-cell" }, "Date"),
                vue.createElementVNode("text", { class: "table-header-cell" }, "Customer"),
                vue.createElementVNode("text", { class: "table-header-cell" }, "Status")
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "table-body" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.pagedOrders, (order) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: order.order_id,
                      onClick: ($event) => $options.openModal(order),
                      class: vue.normalizeClass(["table-row", { "highlight": order.status === "Complete", "mobile-card": !$data.isWideScreen }])
                    }, [
                      $data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "table-row-desktop"
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "table-cell order-id" },
                          vue.toDisplayString(order.order_id),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "table-cell" },
                          vue.toDisplayString($options.formatDate(order.order_date)),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode(
                          "text",
                          { class: "table-cell" },
                          vue.toDisplayString(order.customer || "-"),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "table-cell status-cell" }, [
                          vue.createElementVNode(
                            "view",
                            {
                              class: vue.normalizeClass(["status-badge", $options.getStatusClass(order.status)])
                            },
                            vue.toDisplayString(order.status || "Unknown"),
                            3
                            /* TEXT, CLASS */
                          )
                        ])
                      ])) : (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "mobile-card-content"
                      }, [
                        vue.createElementVNode("view", { class: "mobile-card-row mobile-card-header" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "order-id" },
                            "#" + vue.toDisplayString(order.order_id),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "view",
                            {
                              class: vue.normalizeClass(["status-badge", $options.getStatusClass(order.status)])
                            },
                            vue.toDisplayString(order.status || "Unknown"),
                            3
                            /* TEXT, CLASS */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "mobile-card-row" }, [
                          vue.createElementVNode("text", { class: "mobile-card-label" }, "Date:"),
                          vue.createElementVNode(
                            "text",
                            { class: "mobile-card-value" },
                            vue.toDisplayString($options.formatDate(order.order_date)),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "mobile-card-row" }, [
                          vue.createElementVNode("text", { class: "mobile-card-label" }, "Customer:"),
                          vue.createElementVNode(
                            "text",
                            { class: "mobile-card-value" },
                            vue.toDisplayString(order.customer || "-"),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "mobile-card-row" }, [
                          vue.createElementVNode("text", { class: "mobile-card-label" }, "Total:"),
                          vue.createElementVNode(
                            "text",
                            { class: "mobile-card-value" },
                            "RM" + vue.toDisplayString(order.total_amount ? order.total_amount.toFixed(2) : "0.00"),
                            1
                            /* TEXT */
                          )
                        ])
                      ]))
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ]),
            vue.createCommentVNode(" Empty State "),
            $data.pagedOrders.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "empty-state"
            }, [
              vue.createElementVNode("text", { class: "empty-text" }, "No orders found matching your search")
            ])) : vue.createCommentVNode("v-if", true)
          ]),
          vue.createCommentVNode(" Pagination "),
          vue.createElementVNode("view", { class: "pagination" }, [
            vue.createElementVNode("button", {
              class: "pagination-btn",
              onClick: _cache[9] || (_cache[9] = ($event) => $options.changePage($data.currentPage - 1)),
              disabled: $data.currentPage === 1
            }, [
              vue.createElementVNode("text", { class: "pagination-icon" }, "◀")
            ], 8, ["disabled"]),
            vue.createElementVNode(
              "text",
              { class: "page-info" },
              "Page " + vue.toDisplayString($data.currentPage) + " of " + vue.toDisplayString($data.totalPages),
              1
              /* TEXT */
            ),
            vue.createElementVNode("button", {
              class: "pagination-btn",
              onClick: _cache[10] || (_cache[10] = ($event) => $options.changePage($data.currentPage + 1)),
              disabled: $data.currentPage === $data.totalPages
            }, [
              vue.createElementVNode("text", { class: "pagination-icon" }, "▶")
            ], 8, ["disabled"])
          ]),
          vue.createCommentVNode(" Modal "),
          $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "modal-backdrop",
            onClick: _cache[14] || (_cache[14] = (...args) => $options.closeModal && $options.closeModal(...args))
          }, [
            vue.createElementVNode("view", {
              class: "modal-content",
              onClick: _cache[13] || (_cache[13] = vue.withModifiers(() => {
              }, ["stop"]))
            }, [
              vue.createElementVNode("view", { class: "modal-header" }, [
                vue.createElementVNode("text", { class: "modal-title" }, "Order Details"),
                vue.createElementVNode("button", {
                  class: "close-btn",
                  onClick: _cache[11] || (_cache[11] = (...args) => $options.closeModal && $options.closeModal(...args))
                }, "×")
              ]),
              vue.createElementVNode("view", { class: "modal-body" }, [
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "Order ID:"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    "#" + vue.toDisplayString($data.selectedOrder.order_id),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "Order Date:"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString($options.formatDate($data.selectedOrder.order_date)),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "Customer:"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString($data.selectedOrder.customer || "-"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "detail-row" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "Status:"),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["status-badge modal-status", $options.getStatusClass($data.selectedOrder.status)])
                    },
                    vue.toDisplayString($data.selectedOrder.status || "Unknown"),
                    3
                    /* TEXT, CLASS */
                  )
                ]),
                vue.createElementVNode("view", { class: "items-section" }, [
                  vue.createElementVNode("text", { class: "section-title" }, "Order Items:"),
                  vue.createElementVNode("view", { class: "item-list" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.selectedOrder.items, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: index,
                          class: "item-row"
                        }, [
                          vue.createElementVNode(
                            "text",
                            { class: "item-name" },
                            vue.toDisplayString(item.order_item_name),
                            1
                            /* TEXT */
                          ),
                          vue.createElementVNode(
                            "text",
                            { class: "item-price" },
                            "RM" + vue.toDisplayString(parseFloat(item.item_price).toFixed(2)),
                            1
                            /* TEXT */
                          )
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ]),
                vue.createElementVNode("view", { class: "financial-details" }, [
                  vue.createElementVNode("view", { class: "detail-row total-row" }, [
                    vue.createElementVNode("text", { class: "detail-label" }, "Total:"),
                    vue.createElementVNode(
                      "text",
                      { class: "detail-value total-amount" },
                      "RM" + vue.toDisplayString(parseFloat($data.selectedOrder.total_amount).toFixed(2)),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "detail-row commission-row" }, [
                    vue.createElementVNode("text", { class: "detail-label" }, "Commission:"),
                    vue.createElementVNode(
                      "text",
                      { class: "detail-value" },
                      "RM" + vue.toDisplayString(parseFloat($data.selectedOrder.commission || 0).toFixed(2)),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ]),
              vue.createElementVNode("view", { class: "modal-footer" }, [
                vue.createElementVNode("button", {
                  class: "action-btn cancel-btn",
                  onClick: _cache[12] || (_cache[12] = (...args) => $options.closeModal && $options.closeModal(...args))
                }, "Close"),
                vue.createCommentVNode(' <button class="action-btn primary-btn" @click="processOrder">Process Order</button> ')
              ])
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      vue.createCommentVNode(" Mobile Bottom Nav "),
      !$data.isWideScreen ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "mobile-nav"
      }, [
        vue.createVNode(_component_NavBar, {
          activeTab: $data.activeTab,
          onChangeTab: $options.changeTab
        }, null, 8, ["activeTab", "onChangeTab"])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesTabbarOrderOrder = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-fdbdf1ad"], ["__file", "/Users/appnicorn/Desktop/UniApp/Commission/pages/tabbar/Order/order.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/tabbar/Home/home", PagesTabbarHomeHome);
  __definePage("pages/tabbar/Wallet/wallet", PagesTabbarWalletWallet);
  __definePage("pages/tabbar/Order/order", PagesTabbarOrderOrder);
  const _sfc_main = {
    onLaunch() {
      const token = uni.getStorageSync("authToken");
      if (!token) {
        uni.redirectTo({
          url: "/pages/login/login"
        });
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/appnicorn/Desktop/UniApp/Commission/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
