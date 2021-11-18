
<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    //         <template>
    //     <div>
    //         <i v-if="icon.includes('el-icon')" class="sub-el-icon" :class="[icon]"></i>
    //         <svg-icon v-else :icon-class="icon"></svg-icon>
    //         <span v-if="title" slot='title'>{{title}}</span>
    //     </div>
    // </template>
    return {
      vnodes: []
    }
  },
  render(createElement, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
