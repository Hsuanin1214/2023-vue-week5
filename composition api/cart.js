
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
import {ref,onMounted,watch} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

const userModal = {
  props:['selectedProduct','status','addToCart'],
  setup(props){
    const productModal = ref(null);
    const qty =ref(1);
    function openModal(){
      productModal.value.show();
    }
    function closeModal(){
      productModal.value.hide();
    }
    onMounted(()=>{
      productModal.value = new bootstrap.Modal(this.$refs.productModal, {
        keyboard: false,
        backdrop: 'static'
      });
    })
    watch(()=>props.selectedProduct,(newVal) => { //監聽外面傳進來的值，可以使用watch，而非mounted
      qty.value = 1;
    })
    return {
      productModal,qty,openModal,closeModal
    }
  },
  template:'#userProductModal',
}

const app = Vue.createApp({
  setup() {
    const products = ref([]);
    const url = ref("https://ec-course-api.hexschool.io/v2");
    const path = ref("hsuanin-vue2024");
    const selectedProduct = ref([]);
    // productModal: null,
    const carts = ref({});
    const status =ref({
      addCartLoading:'',
      cartQtyLoading:''
    });
    const form = ref({
      user:{
        name:'',
        email: '',
        tel: '',
        address: '',
      },
      message:''
    })
    onMounted(() => {
      getProduct();
      getCart();
    });
    function getProduct() {
      let getProductUrl = `${url.value}/api/${path.value}/products/all`;
      axios
        .get(getProductUrl)
        .then((res) => {
          products.value = res.data.products;
          console.log(products.value);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    async function showProductDetail(product) {
      // this.showMoreStatus.showMoreLoading = product.id;
      //   this.isLoading = true;
      selectedProduct.value = product || null;
      console.log(selectedProduct.value);
      isLoading.value = true;
      this.$refs.userModal.openModal();
    }
    function addToCart(product_id , qty=1) {
      const order = {
        product_id,
        qty,
      };
      console.log(order)
      let postCartUrl = `${url.value}/api/${path.value}/cart`;
      status.value.addCartLoading = product_id;
      axios
        .post(postCartUrl,{data:order})
        .then((res) => {
          console.log(res);
          status.value.addCartLoading = '';
          this.$refs.userModal.closeModal();
          getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    function changeCartQty(item , qty=1) {
      const order = {
        product_id:item.product_id,
        qty,
      };
      let postCartUrl = `${url.value}/api/${path.value}/cart/${item.id}`;
      status.value.cartQtyLoading = item.id;
      // console.log(order,postCartUrl)

      axios
        .put(postCartUrl,{data:order})
        .then((res) => {
          console.log(res);
          status.value.cartQtyLoading = '';
          // this.$refs.userModal.closeModal();
          getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    function getCart() {
      let getCartUrl = `${url.value}/api/${path.value}/cart`;
      axios
        .get(getCartUrl)
        .then((res) => {
          carts.value = res.data.data;
          console.log(carts.value);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    function removeCartItem(id){
      let deleteCartUrl = `${url.value}/api/${path.value}/cart/${id}`;
      status.value.cartQtyLoading = id;
      console.log(id);
      axios
        .delete(deleteCartUrl)
        .then((res) => {
          console.log(res);
          status.value.cartQtyLoading = '';
          // this.$refs.userModal.closeModal();
          getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    function removeAllCart(){
      let deleteCartsUrl = `${url.value}/api/${path.value}/carts`;
      console.log(deleteCartsUrl);
      axios
        .delete(deleteCartsUrl)
        .then((res) => {
          console.log(res);
          getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    function isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    }
    function addOrder(){
      let addOrderUrl = `${url.value}/api/${path.value}/order`;
      let order = form.value;
      console.log(addOrderUrl,order);
      axios
        .post(addOrderUrl,{ data: order })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.$refs.form.resetForm();
          getCart();
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.dir(error);
        });
    }
    return {
      products,url,path,selectedProduct,carts,status,form,getProduct,showProductDetail,addToCart,changeCartQty,getCart,removeCartItem,removeAllCart,isPhone,addOrder
    }
  },
  components:{
    userModal,
  },
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field); //input，selector
app.component('ErrorMessage', VeeValidate.ErrorMessage);//錯誤回饋
app.mount("#app");
