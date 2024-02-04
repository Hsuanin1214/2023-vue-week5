const app =Vue.createApp({
    data(){
        return{
            products:[],
            url:'https://ec-course-api.hexschool.io/v2',
            path:'hsuanin-vue2024',
            selectedProduct:[],
        }
    },
    methods: {
        getProduct(){
            let getProductUrl = `${this.url}/api/${this.path}/products`;
            axios.get(getProductUrl)
                .then(res=>{
                    this.products = res.data.products;
                    console.log(this.products);
                }).catch((error)=>{
                    alert(error.response.data.message);
                    console.dir(error)
                })
        },
        showProductDetail(product){
            this.selectedProduct = product || null;
            console.log(this.selectedProduct)
        }
    },
    mounted() {
        this.getProduct();
    },
})
app.mount('#app')