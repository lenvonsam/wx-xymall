<template lang="pug">
.ball(:animation="ballAnimate", v-if="animateShow")
  //- div
    //- div(v-for="ball in balls")
    //-   //- 用了两种方式的动画,css和js钩子
    //-   transition(name="drop", @before-enter="beforeDrop", @enter="dropping", @after-enter="afterDrop")
    //-     //- 外层动画
    //-     .ball(v-show="ball.show", :style="{right:ballRight + 'px', 'transform': 'translate3d(0,'+ball.y+'px,0)'}")
    //-       //- 内层动画
    //-       .inner.inner-hook(:style="{'transform': 'translate3d('+ball.x+'px,0,0)'}")
</template>

<script>
export default {
  props: {
    value: {
      required: true
    },
    cb: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      ballAnimate: '',
      obj: null,
      animateShow: false,
      balls: [
        {
          show: false,
          x: 0,
          y: 0
        },
        {
          show: false,
          x: 0,
          y: 0
        },
        {
          show: false,
          x: 0,
          y: 0
        },
        {
          show: false,
          x: 0,
          y: 0
        },
        {
          show: false,
          x: 0,
          y: 0
        }
      ],
      dropBalls: [],
      ballRight: ''
    }
  },
  watch: {
    value: {
      handler (newVal, oldVal) {
        // if (newVal) this.drop(newVal.touches[0])
        if (newVal) {
          debugger
          const me = this
          this.animateShow = true
          setTimeout(function () {
            me.animation.rotate(180).step().scale(2).step()
            me.billAnimate = me.animation.export()
          }, 1000)
        }
      },
      deep: true
    }
  },
  beforeMount () {
    if (!this.animation) {
      var obj = mpvue.createAnimation({
        duration: 1000,
        delay: 100
      })
      this.animation = obj
    }
  },
  mounted () {
    this.ballRight = ((this.screenWidth * 2) + this.screenWidth) / 8
    console.log('billRight:>>' + this.billRight)
  },
  methods: {
    addToShopCart (event) {
      this.drop(event.touches[0])
    },
    drop (el) {
      // 触发一次事件就会将所有小球进行遍历
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) { // 将false的小球放到dropBalls
          ball.show = true
          ball.el = el // 设置小球的el属性为一个dom对象
          this.dropBalls.push(ball)
          return
        }
      }
    },

    beforeDrop (el) { // 这个方法的执行是因为这是一个vue的监听事件
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el // 获取小球的相对于视口的位移(小球高度)
          let x = this.screenWidth - rect.clientX + 30
          let y = -(this.screenHeight - rect.clientY - 35) // 负数,因为是从上往下的的方向
          ball.x = x
          ball.y = y
          // el.style.display = '' // 清空display
          // el.style.webkitTransform = `translate3d(0,${y}px,0)`
          // el.style.transform = `translate3d(0,${y}px,0)`
          // 处理内层动画
          // let inner = el.getElementsByClassName('inner-hook')[0] // 使用inner-hook类来单纯被js操作
          // inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          // inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },

    dropping (el, done) { // 这个方法的执行是因为这是一个vue的监听事件
      /* eslint-disable no-unused-vars */
      console.log(el)
      console.log('droping')
      // let rf = el.offsetHeight // 触发重绘html
      // this.$nextTick(() => { // 让动画效果异步执行,提高性能
      //   el.style.webkitTransform = 'translate3d(0,0,0)'
      //   el.style.transform = 'translate3d(0,0,0)'
      // 处理内层动画
      // let inner = el.getElementsByClassName('inner-hook')[0] // 使用inner-hook类来单纯被js操作
      // inner.style.webkitTransform = 'translate3d(0,0,0)'
      // inner.style.transform = 'translate3d(0,0,0)'
      // el.addEventListener('transitionend', done) // Vue为了知道过渡的完成，必须设置相应的事件监听器。
      // })
    },

    afterDrop (el) { // 这个方法的执行是因为这是一个vue的监听事件
      let ball = this.dropBalls.shift() // 完成一次动画就删除一个dropBalls的小球
      console.log('afterDrop')
      if (ball) {
        ball.show = false
        // el.style.display = 'none' // 隐藏小球
        this.cb()
      }
    }
  }
}
</script>

<style lang="stylus", scoped>
.ball
  position fixed
  width 30px
  height 30px
  right 100px
  bottom 30px
  z-index 200
  background red
  transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
  .inner
    width 30px
    height 30px
    border-radius 50%
    // background-image url('http://xymobile.xingyun361.com/logo.png')
    background red
    background-size cover
    background-position center
    transition all 0.6s linear
</style>
