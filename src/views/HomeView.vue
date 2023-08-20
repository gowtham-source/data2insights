<template>
  <div class="home">
    <Notification :msgs="notifications" />
    <div class="sidebar"></div>
    <div class="main">
      <div class="output">
        <div class="welcome" v-if="messages.length == 0 && fileUploaded">
          <h1>Welcome!</h1>
          <h3>Here are some commands you can try</h3>
          <p>What is this data about?</p>
          <p>What is the average of the employee salary?</p>
          <p>What is the maximum mark obtained?</p>
        </div>
        <div v-if="fileUploaded" class="messages">
          <div
            v-for="msg in messages"
            :key="msg.time"
            class="msg"
            :class="msg.sender"
          >
            <p v-if="msg.image === false">
              <span class="text">{{ msg.text.replaceAll(";", "\n") }}</span>
              <!-- <span class="time">{{ msg.time }}</span> -->
            </p>
            <p v-else-if="msg.image === true">
              <!-- <span class="text">{{ msg.text }}</span> -->
              <img :src="msg.text" alt="" />
              <!-- <span class="time">{{ msg.time }}</span> -->
            </p>
          </div>

          <div class="msg typing" v-if="pauseInput">
            <p>
              <span class="text"><span class="loader"></span></span>
              <!-- <span class="time">10:00</span> -->
            </p>
          </div>
        </div>
        <div v-else class="upload">
          <h3>Upload a file to start chatting</h3>
          <div class="file-upload">
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="checkFile"
            />
            <box-icon
              name="upload"
              color="white"
              @click="uploadFile"
            ></box-icon>
          </div>
        </div>
      </div>
      <div class="input" v-if="fileUploaded">
        <input
          type="text"
          v-model="input"
          @keyup.enter="sendMessage"
          :disabled="pauseInput"
        />
        <div class="icon">
          <box-icon
            type="solid"
            name="message-square-add"
            color="#2ebdff"
          ></box-icon>
        </div>
        <button @click="sendMessage" v-if="input.length">
          <box-icon type="solid" name="send" color="#2ebdff"></box-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Notification from "../components/Notification.vue";

const messages = ref([]);
const input = ref("");
const pauseInput = ref(false);
const fileUploaded = ref(false);
const fileInput = ref(null);
const file = ref(null);
const notifications = ref([]);

const uploadFile = () => {
  fileInput.value.click();
  console.log(fileInput.value);
};

const checkFile = async (e) => {
  fileUploaded.value = true;
  file.value = e.target.files[0];

  const fileData = new FormData();
  fileData.append("file", file.value);

  let res = await fetch("http://localhost:5000/uploadFile", {
    method: "POST",
    body: fileData,
  });

  if (await res) {
    let data = await res.json();
    console.log(data);

    if (data.status == "200") {
      notifications.value.push("File uploaded successfully");
      fileUploaded.value = true;
    } else {
      notifications.value.push("Error uploading file");
    }
  }
};

const sendMessage = async () => {
  let time = new Date().toLocaleTimeString().split(":");
  // remove seconds
  time.pop();
  time = time.join(":");
  let message = {
    sender: "user",
    text: input.value,
    time: time,
    image: false,
  };
  messages.value.push(message);
  input.value = "";

  pauseInput.value = true;

  let data = {
    message: message.text,
  };

  let res = await fetch("http://localhost:5000/getInference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (await res) {
    let conttype = await res.headers.get("content-type");

    if (conttype.includes("application/json")) {
      let data = await res.json();
      console.log(data);
      let response = {
        sender: "bot",
        text: await data.message,
        time: time,
        image: false,
      };
      messages.value.push(response);
    } else {
      let data = await res.blob();
      var imgElement = document.createElement("img");
      var src = URL.createObjectURL(data);

      console.log(data);
      let response = {
        sender: "bot",
        text: src,
        time: time,
        image: true,
      };
      messages.value.push(response);
    }
  }
  pauseInput.value = false;
};
</script>

<style lang="scss" scoped>
// $base-color: #141414;

.welcome {
  position: absolute;
  z-index: 10;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  height: 400px;
  width: 300px;

  color: white;

  left: 50%;
  top: 50%;

  transform: translate(-50%, -50%);

  p {
    text-align: left;
    background: #2e2e2e;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    width: 100%;
  }
}

.home {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;

  background: #141414;

  .sidebar {
    height: 100%;
    width: 100px;
    background: #1e1e1e;
  }

  .main {
    height: 100%;
    width: calc(100% - 120px);
    flex-direction: column;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .output {
    height: calc(100% - 100px);
    width: calc(100% - 50px);
    border-radius: 25px;
    // background: #252525;
    color: white;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .upload {
      height: 100%;
      width: 100%;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .file-upload {
        height: 250px;
        width: 250px;
        margin: 20px;
        background: #1e1e1e;
        border-radius: 30px;

        display: flex;
        justify-content: center;
        align-items: center;

        transition: 0.3s;

        &:hover {
          background: #2ebdff;
        }

        box-icon {
          height: 150px;
          width: 150px;
        }
      }
    }

    .messages {
      width: 100%;
      height: 100%;
      max-width: 800px;

      // display: flex;
      // justify-content: flex-end;
      flex-direction: column;
      align-items: flex-end;

      overflow-y: scroll;

      // hide scrollbar
      &::-webkit-scrollbar {
        display: none;
      }

      // background: #d6d6d6;
    }

    .msg {
      min-height: 40px;
      min-width: 50px;
      width: fit-content;

      background: #2ebdff;
      border-radius: 5px 20px 20px 20px;

      display: flex;
      justify-content: center;
      align-items: center;

      position: relative;

      margin: 10px;
      text-align: left;
      // margin-left: auto;
      p {
        margin: 0;
        padding: 0 10px;
        position: relative;
        text-align: left;
        width: calc(100% - 20px);
        .text {
          width: 100%;
          text-align: left;
        }
        .time {
          position: absolute;
          top: -10px;
          right: 0px;
          font-size: 12px;

          width: 40px;

          height: 20px;
          background: #2ebdff;

          border-radius: 5px;

          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .typing,
    .bot {
      align-self: flex-start;
      border-radius: 0;
      background: #2e2e2e;
      color: white;
      min-height: 40px;
      overflow: hidden;
      width: calc(100% - 10px);
      border-radius: 10px;
      p {
        min-height: 10px;
        overflow: hidden;
        // width: 70px;
        padding: 10px;
        .text {
          width: 100%;
          height: auto;
          // height: 400px;
          // display: flex;
          // justify-content: center;
          // align-items: center;
          word-wrap: break-word;
        }
        .time {
          right: calc(100% - 40px);
        }
      }
    }
    .typing {
      p {
        width: 70px;
        .text {
          width: 100%;
          height: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 100%;
    max-width: 800px;
    input {
      height: 46px;
      border-radius: 25px;
      outline: none;
      border: none;

      padding: 0 50px;

      color: white;
      border: 1px solid #d6d6d655;
      background: #252525;
      width: calc(100%);
    }

    .icon {
      position: absolute;
      left: 5px;
      top: 5px;
      box-sizing: border-box;
      padding: 5px;
      border-radius: 25px;
      height: 40px;
      width: 40px;

      display: flex;
      justify-content: center;
      align-items: center;

      background: #2ebdff00;
      color: #2ebdff;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: none;
      outline: none;

      border-radius: 25px;
      height: 40px;
      width: 40px;

      background: #2ebdff00;
      color: #2ebdff;
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
}
</style>
