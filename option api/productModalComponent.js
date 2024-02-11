export default{
    data(){
        return{
            
        }
    },
    template:`<div
    class="modal fade"
    ref="productDetailModal"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{selectedProduct.title}}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <!-- <img :src="selectedProduct.imageUrl" alt="" class="img-fuild" /> -->
            </div>
            <div class="col-sm-6">
              <span class="badge rounded-pill bg-primary"
                >{{selectedProduct.category}}</span
              >
              <p>產品描述: {{selectedProduct.description}}</p>
              <p>商品內容:{{selectedProduct.content}}</p>
              <del>原價 : {{selectedProduct.origin_price}}</del>
              <p>現在只要 : {{selectedProduct.price}}</p>
              <input type="text" />
              <button type="button" class="btn btn-primary"
              @click="addToCart(selectedProduct.id)">
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
    methods:{

    }
}