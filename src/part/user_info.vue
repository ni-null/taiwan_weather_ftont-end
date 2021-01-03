<template>
  <transition name="fade">
    <div>

      <div class="user_info_nav">
        <div class="user_info_nav_items" @click="chamge_password_box">
          <img :src="require('../img/svg/key.svg')" />
          <p>修改密碼</p>
        </div>
        <div class="line"></div>
        <div class="user_info_nav_items" @click="telegram_box">
          <img :src="require('../img/svg/telegram.svg')" />
          <p>Telegram</p>
        </div>
      </div>


      <transition name="fade">
        <div v-show="show=='telegram_box' " class="telegram_box">
          <h2> Telegram綁定狀態</h2>


          <div class="telegtam_item_box">

            <div class="telegram_item">

              <div v-show="bind_code">

                <div class="item_status">

                  <img :src="require('../img/svg/sad.svg')" />
                  <p class="bind_status"> {{bind_status}} </p>
                  <img :src="require('../img/svg/refresh.svg')" id="update" @click="get_telegtam_status" />
                </div>


                <div class="item_user">
                  <p> 打開機器人輸入綁定碼</p>

                  <div class="bind_box">
                    <p> {{bind_code}}</p>
                    <button @click.stop.prevent="copyTestingCode">
                      <img :src="require('../img/svg/copy.svg')" />
                    </button>

                  </div>
                  <div class="notice_box">
                    <transition name="fade_long" mode="out-in">
                      <div v-show="notice" class="notice"> {{notice_text}} </div>
                    </transition>
                  </div>

                  <input type="hidden" id="testing-code" :value="bind_code">

                </div>

              </div>


              <div v-show="bind_user">


                <div class="item_status">
                  <img :src="require('../img/svg/tick.svg')" />
                  <p class="bind_status"> {{bind_status}} </p>
                </div>

                <div class="item_user"> 用戶名 『{{bind_user}} 』</div>


              </div>
            </div>




            <div class="telegram_item">

              <img :src="require('../img/qr-code.png')" />


            </div>

          </div>


        </div>
      </transition>
      <transition name="fade">
        <div v-show="show=='change_password_box' " class="change_password_box">
          <h2> 修改密碼</h2>

          <div class="change_password_box_item_box ">

            <div class="password_item">
              <p> 舊密碼 </p>
              <input type="text" v-model="user_passowrd_old" placeholder="Old Password">
            </div>

            <div class="password_item">
              <p>新密碼 </p>
              <input type="text" v-model="user_passowrd_new" placeholder="NEW Password">
            </div>

            <div class="password_item">
              <p>確認新密碼</p>
              <input type="text" v-model="user_passowrd_new_check" placeholder="NEW Password Check">
            </div>

            <button class="change_button" @click="send_change"> 修改密碼 </button>

          </div>



          {{send_change_result}}

        </div>
      </transition>

    </div>

  </transition>


</template>

<script>
  import md5 from 'md5'

  const city_list = require('../json/citys_list.json')[2][0]


  import {
    setup
  } from 'axios-cache-adapter'

  const axios_cache = setup({
    cache: {
      maxAge: 0
    }
  })


  export default {
    data() {
      return {
        user_passowrd_old: null,
        user_passowrd_new: null,
        user_passowrd_new_check: null,
        send_change_result: null,
        show: 'telegram_box',

        //teleram 
        bind_status: '未綁定',
        bind_code: false,
        bind_user: false,
        notice: false,
        notice_text: null


      }
    },

    methods: {


      //修改密碼

      send_change: async function () {



        const re = /^[\d|a-zA-Z]+$/

        if (this.user_passowrd_old == null || this.user_passowrd_new == null || this.user_passowrd_new_check == null)
          this.send_change_result = "輸入為空"
        else if (!re.test(this.user_name) && !re.test(this.user_passowrd)) this.send_change_result = "帳號或密碼格式錯誤"
        else if (this.user_passowrd_new.length < 5) this.send_change_result = "密碼長度太短，需大於五"
        else if (this.user_passowrd_new != this.user_passowrd_new_check) this.send_change_result = "兩次密碼不一致"

        else {

          const response = await this.axios.post(this.api_url + "/account/change_password", {
            user_passowrd_old: md5(this.user_passowrd_old),
            user_passowrd_new: md5(this.user_passowrd_new),
          })

          if (response.data) {
            console.log(response.data)
            if (response.data == 'login_fail') this.delete_login()
            else this.send_change_result = '修改成功'
          } else this.send_change_result = '修改失敗，請在試一次'
        }



      },

      //登出
      delete_login: function () {
        this.$cookies.remove('user')
        this.$router.push({
          path: '/'
        })

      },

      //按鈕切換
      telegram_box: function () {
        this.show = 'telegram_box'
      },

      chamge_password_box: function () {
        this.show = 'change_password_box'
      },

      //獲取telegram綁定


      get_telegtam_status: async function () {


        let result = await axios_cache.get(this.api_url + "/account/telegram", {
          maxAge: 0
        })


        result = result.data.split(':')

        if (result[0] == 'bind_code') {
          this.bind_status = '未綁定'
          this.bind_code = result[1]
          this.bind_user = false

        } else {
          this.bind_status = '已綁定'
          this.bind_user = result[1]
          this.bind_code = false
        }



      },


      //複製文字
      copyTestingCode: function () {
        const testingCodeToCopy = document.querySelector('#testing-code')
        testingCodeToCopy.setAttribute('type', 'text') // 不是 hidden 才能複製
        testingCodeToCopy.select()

        try {
          var successful = document.execCommand('copy');
          var msg = successful ? 'successful' : 'unsuccessful';
          this.notice_text = "已複製綁定碼"
          this.copy_notice()
        } catch (err) {
          this.notice_text = "複製失敗"
          this.copy_notice()

        }

        /* unselect the range */
        testingCodeToCopy.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      },


      //複製提示


      copy_notice: function () {

        this.notice = true


        setTimeout(() => this.notice = false, 3000)

      }



    },
    inject: ["api_url"],
    mounted() {

      this.get_telegtam_status()

    }
  }
</script>