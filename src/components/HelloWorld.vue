<script setup lang="ts">
import { ref } from 'vue'
import { data, id2name } from '../words'
import { message } from 'ant-design-vue';
import { getTodayEng } from '../api'

import { onMounted } from 'vue';

const todayEng = ref(null)

onMounted(()=>{
    getTodayEng().then(res => {
      todayEng.value = res.data[0]
    })
})



import {
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined,
  EditFilled,
  AudioOutlined,
  ReadOutlined
} from '@ant-design/icons-vue';

import type { MenuProps } from 'ant-design-vue';

const base_id = ref("diji")

const list_id = ref(-1)
const input_word = ref("")
const carousel = ref(null)
const w_idx_in_list = ref(0)
const current_word = ref(null)
const audio_link = ref(null)
const audio = ref(null)
const show_menu = ref(true)
const read_mode = ref(false)
const only_eng = ref(false)
const show_eng = ref(false)

const handleClick: MenuProps['onClick'] = e => {
  // console.log('click', e);
  base_id.value = e.keyPath[0]
  list_id.value = e.keyPath[1]
  w_idx_in_list.value = 0

  current_word.value = data[base_id.value]["data"][list_id.value][w_idx_in_list.value]
  audio_link.value = current_word.value.soundUrl
  console.log(data[base_id.value]["data"][list_id.value])
};

const titleClick = (e: Event) => {
  console.log('titleClick', e);
};

const prev_ = ()=>{
  show_eng.value=false;
  if(carousel.value) carousel.value.prev()
}

const next_ = ()=>{
  show_eng.value=false;
  if(carousel.value) carousel.value.next()
  // console.log(carousel.value)
}

const carousel_change = (idx: number)=>{
  w_idx_in_list.value = idx
  current_word.value = data[base_id.value]["data"][list_id.value][w_idx_in_list.value]
  audio_link.value = ('soundUrl' in current_word.value)?current_word.value.soundUrl:""
  // console.log(w_idx_in_list.value)
}

const check_eng = ()=>{
  if(input_word.value.trim() == current_word.value.english.trim()){
    message.success('Right!');
    next_()
    input_word.value = ""
  }else{
    message.error('Wrong!');
    showModal()
  }
}

const visible = ref<boolean>(false);

const showModal = () => {
    audio.value.play()
    console.log(audio_link.value)
    visible.value = true;
};

const handleOk = (e: MouseEvent) => {
  // console.log(e);
  visible.value = false;
  
};


</script>

<template>
  <div class="logo" @click="show_menu=!show_menu">
  </div>
  <div class="right-tool">
    {{read_mode?"Read Mode":"Test Mode"}} | <a-switch v-model:checked="read_mode" />
    <div v-if="read_mode">
      {{only_eng?"English Only":"Full Explains"}} | <a-switch v-model:checked="only_eng" />
    </div>
  </div>
  <a-menu
    id="left_menu"
    :class="show_menu?'show':''"
    mode="inline"
    :openKeys="['diji','1532714808107905025']"
    theme="dark"
    @click="handleClick"
  >
    <a-sub-menu @titleClick="titleClick" v-for="list,key in data" :key="key">
      <template #icon>
        <unordered-list-outlined />
      </template>
      <template #title>{{id2name[key]}}</template>
      <a-menu-item v-for="sublist in list['info']" :key="sublist.id">{{sublist.name}}</a-menu-item>
    </a-sub-menu>
    <!-- <a-sub-menu key="dengding" @titleClick="titleClick">
      <template #icon>
        <unordered-list-outlined />
      </template>
      <template #title>登顶词</template>
      <a-menu-item v-for="list in data['dengding']['info']" :key="list.id">{{list.name}}</a-menu-item>
    </a-sub-menu> -->
  </a-menu>
  
  <div
  :class="show_menu?'right':'right full'"
  v-if="list_id==-1"
  >
    <a-carousel>
      <div class="item">
        <div class="top">
          <div style="font-size:1.2rem;line-height:2rem;" v-if="todayEng">{{todayEng.word}}</div>
          <div style="font-size:1rem;line-height:1rem;" v-if="todayEng">Definition: {{todayEng.definition}}</div>
          <edit-filled/>  请选择单词列表
        </div>
      </div>
    </a-carousel>
  </div>

  <div :class="show_menu?'right':'right full'"
  v-else>
    <a-carousel
    :class="(read_mode?'read-mode ':'') + (only_eng&&!show_eng?'only-eng':'')"
    :key="base_id + list_id"
    ref="carousel"
    :dots="true"
    :afterChange="carousel_change"
    >
      <div class="item" v-for="w in data[base_id]['data'][list_id]" :key="w.id">
        <div class="top" @click="showModal()">{{w.chinese}}</div>
        <div class="modal"  @click="show_eng=true">
          <p class="eng" style="font-size:1.4rem;font-weight:bold;" v-if="w.english">{{w.english}}</p>
          <p v-if="w.sound">{{w.sound}}</p>
          <p class="f" v-if="w.chinese">{{w.chinese}}</p>
          <p v-if="w.exampleSentence"><span class="tip">Example</span>{{w.exampleSentence}}</p>
          <p class="f" v-if="w.derived"><span class="tip">derived</span>{{w.derived}}</p>
          <p class="f" v-if="w.memory"><span class="tip">memory</span>{{w.memory}}</p>
          <p class="f" v-if="w.synonymous"><span class="tip">synonymous</span>{{w.synonymous}}</p>
          <p class="f" v-if="w.antisense"><span class="tip">antisense</span>{{w.antisense}}</p>
          <p class="f" v-if="w.similarWords"><span class="tip">similar</span>{{w.similarWords}}</p>
        </div>
      </div>
    </a-carousel>

    <div>
      <div class="input" v-if="!read_mode">
        <a-input @keyup.enter="check_eng" class="input_box" v-model:value="input_word" placeholder="input" />
      </div>
      <div class="input"  style="bottom:50px;" v-else>
        <!-- <a-button><audio-outlined /></a-button> -->
        <a-button ghost="true" shape="circle" size="large" @click="audio.play()">
          <audio-outlined />
        </a-button>
      </div>

      <a-row class="bottom" justify="space-around">
      <a-col :span="6">
        <a-button ghost="true" size="large" @click="prev_()">
          <LeftOutlined /> 上一个
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button ghost="true" size="large" @click="next_()">
          下一个 <RightOutlined />
        </a-button>
      </a-col>
    </a-row>
    </div>
    <audio ref="audio" :src="audio_link"></audio>
    <a-modal 
    class="modal" 
    v-model:visible="visible" 
    :closable="false" 
    @ok="handleOk" 
    :footer="null" 
    :width="420" 
    :bodyStyle="{background:'#333',color: 'white'}"
    :maskStyle="{backdropFilter: 'blur(10px)'}"
    >
      
      <p style="font-size:1.2rem;font-weight:bold;" v-if="current_word.english">{{current_word.english}}</p>
      <p v-if="current_word.sound">{{current_word.sound}}</p>
      <p v-if="current_word.chinese">{{current_word.chinese}}</p>
      <p v-if="current_word.exampleSentence"><span class="tip">Example</span>{{current_word.exampleSentence}}</p>
      <p v-if="current_word.derived"><span class="tip">derived</span>{{current_word.derived}}</p>
      <p v-if="current_word.memory"><span class="tip">memory</span>{{current_word.memory}}</p>
      <p v-if="current_word.synonymous"><span class="tip">synonymous</span>{{current_word.synonymous}}</p>
      <p v-if="current_word.antisense"><span class="tip">antisense</span>{{current_word.antisense}}</p>
      <p v-if="current_word.similarWords"><span class="tip">similar</span>{{current_word.similarWords}}</p>
    </a-modal>
    
  </div>
  
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.logo{
  position: absolute;
  top:10px;
  left:20px;
  height:50px;
  line-height: 50px;
  z-index: 11;
  color: white;
  font-weight: bold;
  background-image: url('/logo/web_hi_res_512.png');
  width:200px;
  background-size: contain;
  background-repeat: no-repeat;
}
.logo::after{
  content: "| Xiaohao Liu";
  text-indent: 0px;
  display: block;
}
#left_menu {
  position: absolute;
  top:60px;
  left:-300px;
  border-radius: 10px;
  z-index: 10;
  width: 256px;
  transition: ease .2s;
}
#left_menu.show{
  left:10px;
}

.right {
  position: fixed;
  top:0px;
  left:0px;
  height: 100vh;
  box-sizing: border-box;
  padding-left: 250px;
  padding-right: 0px;
  width: 100vw;
  background: black;
  transition: ease .2s;
  /* overflow-y: scroll; */
}
.right.full{
  padding-left: 125px;
  padding-right: 125px;
}
/* .ant-carousel{
  width: 50%;
} */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 100vh;
  line-height: 100vh;
  background: black;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

.item{
  overflow: hidden;
  vertical-align: middle !important;
  margin-top:-100px;
}
.item .modal{
  height: 400px;
  font-size:1.2rem;
  width: 520px;
  margin: auto;
  display: none;
}
.item .modal p{
  text-align: justify;
  line-height: 30px;
  color:white;
  transition: ease .2s;
  opacity:1;
}

.only-eng .item .f{
  opacity:0;
}
.only-eng .item .eng{
  font-size: 2rem !important;
}

.read-mode .item .top{
  display:none;
}
.read-mode .item .modal{
  display:block;
}
.top{
  font-size: 2rem;
  width: 100%;
  line-height: 100px;
  height:400px;
  text-align: center;
  color:white;
  font-weight: bold;
  /* height: 200px; */
}
.input{
  position: absolute;
  bottom: 300px;
  left:0px;
  box-sizing: border-box;
  padding-left: 250px;
  width: 100vw;
  /* width:100%; */
  height: 200px;
  line-height: 200px;
  transition: ease .2s;
  /* background: red; */
}
.right.full .input{
  padding-left: 0px;
}
.input_box{
  width: 200px;
  /* border-radius: 20px; */
  text-align: center;
  border:0px;
  background: transparent;
  border-bottom: 2px solid white;
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  /* background: blue; */
}

.bottom{
  position: absolute;
  bottom: 50px;
  left:0px;
  box-sizing: border-box;
  padding-left: 250px;
  width: 100vw;
  width: 100%;
  transition: ease .2s;
}
.right.full .bottom{
  padding-left: 0px;
}

.tip{
  margin-right:10px;
  padding: 0px 5px;
  border-radius:4px;
  background: #1890ff;
  color: white;
}

.right-tool{
  position: fixed;
  top:10px;
  width: 200px;
  text-align: right;
  right:10px;
  height:50px;
  line-height: 40px;
  z-index: 11;
  color: white;
}

@media screen and (max-width: 700px) {
  .right {
    padding-left:0px;
  }
  .right.full{
  padding-left: 0px;
  padding-right: 0px;
}
  .input{
    padding-left:0px;
  }
  .bottom{
    padding-left:0px;
  }
  .item .modal{
    width: calc(100% - 40px) !important;
  }

}
</style>
