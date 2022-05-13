<template>
  <div class="not-found">
    <div class="box">
      <img src="@/assets/img/notFound404.png" alt="">
      <div>未找到该页面</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'notFound',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}

}
</script>

<style lang='less' scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #e5e5e5;
  .box {
    div {
      text-align: center;
      font-size: 20px;
      margin-top: 20px;
    }
  }
}
</style>
