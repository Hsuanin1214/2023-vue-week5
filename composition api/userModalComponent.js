const { ref, onMounted,watch } = Vue;
export default {
  props: ["selectedProduct", "status", "addToCart"],
  setup(props) {
    const productModal = ref(null);
    // Step 1: 創建一個 ref 來保存 Bootstrap Modal 的實例
    const modalInstance = ref(null);
    const qty = ref(1);
    const openModal = () => {
      if (modalInstance.value) {
        modalInstance.value.show();
      }
    };
    const closeModal = () => {
      modalInstance.value.hide();
    };
    onMounted(() => {
      if (productModal.value) {
        modalInstance.value = new bootstrap.Modal(productModal.value, {
          keyboard: false,
          backdrop: "static",
        });
      }
    });
    watch(
      () => props.selectedProduct,
      (newVal) => {
        //監聽外面傳進來的值，可以使用watch，而非mounted
        qty.value = 1;
      }
    );
    return {
      productModal,
      qty,
      openModal,
      closeModal,
    };
  },
  template: "#userProductModal",
};
