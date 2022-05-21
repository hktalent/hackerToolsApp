<template>
  <div class="poc-markdown">
    <div class="detail">
      <div class="content">
        <div class="markdown-body">
          <div v-html="content"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import markDown from '@/assets/md/test.md'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'
const marked = require('marked')

export default {
  name: 'pocMarkdown',
  components: { },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      content: ''
    }
  },
  computed: {
  },
  watch: {},
  created () {
    this.content = marked.parseInline(markDown)
  },
  mounted () { },
  methods: {}
}
</script>

<style lang='less' scoped>
.headerLisk {
  padding: 0 20px;
  font-weight: 400;
  line-height: 20px;
  color: #333333;
  background: #f7f7f7ff;
  border-bottom: 1px solid #eee;
  height: 60px;
  position: relative;
  .iconfont {
    position: absolute;
    left: 6%;
    top: 50%;
    transform: translateY(-50%);
    font-size: 35px;
    margin-left: 20px;
  }
  .rightAbsulute {
    i {
      color: #999999;
    }
    &:hover {
      i {
        color: #000;
      }
    }
    font-size: 14px;
    color: #333333;
    font-weight: 500;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
}
.content {
  max-height: calc(100vh - 60px);
  overflow: auto;
  padding: 0 20px;
}
.hljs-name {
  color: #22863a;
}

.hljs-attr {
  color: #6f42c1;
}

.hljs-keyword {
  color: red;
}

.hljs-string {
  color: #032f62;
}
</style>
