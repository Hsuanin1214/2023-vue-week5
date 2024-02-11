
//vee-validate 全部引入
// Object.keys(VeeValidateRules).forEach(rule => {
//   if (rule !== 'default') {
//     VeeValidate.defineRule(rule, VeeValidateRules[rule]);
//   }
// });
//引入自己需要的
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const userModal = {
  props:['selectedProduct','status','addToCart'],
  data(){
    return {
      productModal:null,
      qty:1,
    }
  },
  watch:{ //監聽外面傳進來的值，可以使用watch，而非mounted
    selectedProduct(){
      this.qty=1;
    }
  },
  template:'#userProductModal',
  methods:{
    openModal(){
      this.productModal.show();
    },
    closeModal(){
      this.productModal.hide();
    }
  },
  mounted(){
    this.productModal = new bootstrap.Modal(this.$refs.productModal, {
      keyboard: false,
      backdrop: 'static'
    });
  }
}
const app = Vue.createApp({
  data() {
    return {
      products: [],
      url: "https://ec-course-api.hexschool.io/v2",
      path: "hsuanin-vue2024",
      selectedProduct: [],
      // productModal: null,
      carts: {},
      status:{
        addCartLoading:'',
        cartQtyLoading:''
      },
      form:{
        user:{
          name:'',
          email: '',
          tel: '',
          address: '',
        },
        message:''
      }
    };
  },
  methods: {
    getProduct() {
      let getProductUrl = `${this.url}/api/${this.path}/products/all`;
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
      // this.showMoreStatus.showMoreLoading = product.id;
      //   this.isLoading = true;
      this.selectedProduct = product || null;
      console.log(this.selectedProduct);
      this.isLoading = true;
      this.$refs.userModal.openModal();
      //   setTimeout(() => {
      //     this.isLoading = false;
      //   }, 5000);
      // this.openModal();
    },
    addToCart(product_id , qty=1) {
      const order = {
        product_id,
        qty,
      };
      console.log(order)
      let postCartUrl = `${this.url}/api/${this.path}/cart`;
      this.status.addCartLoading = product_id;
      axios
        .post(postCartUrl,{data:order})
        .then((res) => {
          console.log(res);
          this.status.addCartLoading = '';
          this.$refs.userModal.closeModal();
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    changeCartQty(item , qty=1) {
      const order = {
        product_id:item.product_id,
        qty,
      };
      let postCartUrl = `${this.url}/api/${this.path}/cart/${item.id}`;
      this.status.cartQtyLoading = item.id;
      // console.log(order,postCartUrl)

      axios
        .put(postCartUrl,{data:order})
        .then((res) => {
          console.log(res);
          this.status.cartQtyLoading = '';
          // this.$refs.userModal.closeModal();
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    getCart() {
      let getCartUrl = `${this.url}/api/${this.path}/cart`;
      axios
        .get(getCartUrl)
        .then((res) => {
          this.carts = res.data.data;
          console.log(this.carts);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    removeCartItem(id){
      let deleteCartUrl = `${this.url}/api/${this.path}/cart/${id}`;
      this.status.cartQtyLoading = id;
      console.log(id);
      axios
        .delete(deleteCartUrl)
        .then((res) => {
          console.log(res);
          this.status.cartQtyLoading = '';
          // this.$refs.userModal.closeModal();
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    removeAllCart(){
      let deleteCartsUrl = `${this.url}/api/${this.path}/carts`;
      console.log(deleteCartsUrl);
      axios
        .delete(deleteCartsUrl)
        .then((res) => {
          console.log(res);
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    addOrder(){
      let addOrderUrl = `${this.url}/api/${this.path}/order`;
      let order = this.form;
      console.log(addOrderUrl,order);
      axios
        .post(addOrderUrl,{ data: order })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
  },
  components:{
    userModal,
  },
  mounted() {
    this.getProduct();
    this.getCart();
    // this.productModal = new bootstrap.Modal(this.$refs.productModal);
  },
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field); //input，selector
app.component('ErrorMessage', VeeValidate.ErrorMessage);//錯誤回饋
app.mount("#app");
