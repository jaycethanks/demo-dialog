<template>
  <v-app>
    <v-navigation-drawer image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg" theme="dark" permanent>
      <template v-slot:prepend>
        <div class="pa-2">
          <v-btn block @click="handleClick">
            Show Dialog1
          </v-btn>
        </div>
      </template>
      <v-list nav>
        <v-list-item v-for="i in 9" :key="i">
          <div class="pa-2">
            <v-btn @click="handleClick"> Show Dialog List{{ i }}</v-btn>
          </div>
        </v-list-item>

      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Show Dialog2
          </v-btn>
        </div>
      </template>

    </v-navigation-drawer>
    <v-main>
      <v-app-bar location="top">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="handleClick"> Show Dialog top</v-btn>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-app-bar location="bottom">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="handleClick"> Show Dialog bottom</v-btn>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-card class="h-100">
        <iframe src="/iframe.html" class="w-100 h-100"></iframe>
      </v-card>
    </v-main>


     <!-- v-model 控制modal -->
    <DynamicDialog v-model="dialog" :target="target" >
      <v-card class="mx-auto border-primary border-md border-opacity-100" max-width="400">
        <v-img class="align-end text-white" height="200" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover>
          <v-card-title>Top 10 Australian beaches</v-card-title>
        </v-img>
        <v-card-subtitle class="pt-4">
          Number 10
        </v-card-subtitle>
        <v-card-text>
          <div>Whitehaven Beach</div>
          <div>Whitsunday Island, Whitsunday Islands</div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="orange" text="Share"></v-btn>
          <v-btn color="orange" text="Explore"></v-btn>
        </v-card-actions>
      </v-card>
    </DynamicDialog>

    <!-- 全局监听 Iframe 点击事件 modal -->
    <DynamicDialog listenIframe>
      <v-card class="mx-auto text-white" color="#26c6da" max-width="400" prepend-icon="mdi-twitter" title="Twitter">
        <template v-slot:prepend>
          <v-icon size="x-large"></v-icon>
        </template>

        <v-card-text class="text-h5 py-2">
          "Turns out semicolon-less style is easier and safer in TS because most gotcha edge cases are type invalid as
          well."
        </v-card-text>

        <v-card-actions>
          <v-list-item class="w-100">
            <template v-slot:prepend>
              <v-avatar color="grey-darken-3"
                image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"></v-avatar>
            </template>

            <v-list-item-title>Evan You</v-list-item-title>

            <v-list-item-subtitle>Vue Creator</v-list-item-subtitle>

            <template v-slot:append>
              <div class="justify-self-end">
                <v-icon class="me-1" icon="mdi-heart"></v-icon>
                <span class="subheading me-2">256</span>
                <span class="me-1">·</span>
                <v-icon class="me-1" icon="mdi-share-variant"></v-icon>
                <span class="subheading">45</span>
              </div>
            </template>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </DynamicDialog>
  </v-app>
</template>

<script setup lang="ts">
import DynamicDialog from "@/components/DynamicDialog/index.vue"

import { ref } from "vue"

const dialog = ref(false)

const target = ref()

const handleClick = (event: Event) => {
  target.value = event.target
  dialog.value = true
}
</script>
