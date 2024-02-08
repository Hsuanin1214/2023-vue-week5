// import Loading from "vue-loading-overlay";
// import "vue-loading-overlay/dist/css/index.css";
const app = Vue.createApp({
  data() {
    return {
      products: [],
      url: "https://ec-course-api.hexschool.io/v2",
      path: "hsuanin-vue2024",
      selectedProduct: [],
      productModal: null,
      carts: [],
      //   isLoading: false,
      //   fullPage: true,
    };
  },
  methods: {
    getProduct() {
      let getProductUrl = `${this.url}/api/${this.path}/products`;
      axios
        .get(getProductUrl)
        .then((res) => {
          this.products = res.data.products;
          console.log(this.products);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    async showProductDetail(product) {
      //   this.isLoading = true;
      this.selectedProduct = product || null;
      console.log(this.selectedProduct);
      this.isLoading = true;
      //   setTimeout(() => {
      //     this.isLoading = false;
      //   }, 5000);
      this.openModal();
    },
    // doAjax() {
    //   this.isLoading = true;
    //   // simulate AJAX
    //   setTimeout(() => {
    //     this.isLoading = false;
    //   }, 5000);
    // },
    // onCancel() {
    //   console.log("User cancelled the loader.");
    // },
    openModal() {
      this.productModal.show();
    },
    closeModal() {
      this.productModal.hide();
    },
    
    getCart() {
      let getCartUrl = `${this.url}/api/${this.path}/carts`;
      axios
        .get(getCartUrl)
        .then((res) => {
          this.carts = res.data.products;
          console.log(this.carts);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    closeCart() {},
  },
  mounted() {
    this.getProduct();
    this.productModal = new bootstrap.Modal(this.$refs.productDetailModal);
  },
});
app.mount("#app");
