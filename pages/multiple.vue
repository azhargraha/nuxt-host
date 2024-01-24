<template>
  <main class="h-screen overflow-hidden flex">
    <iframe
      :src="targetOrigin"
      frameborder="0"
      class="h-full flex-1"
      ref="reactPDFPreview"
    />

    <aside class="flex-[.4] border-l border-l-gray-100">
      <div
        v-if="!fileURLs || fileURLs.length === 0"
        class="flex flex-col justify-center items-center gap-4 h-full"
      >
        <div class="px-1 pt-6 pb-0 bg-sky-100 rounded-2xl w-fit">
          <img
            src="~/static/daftar-file.svg"
            alt="Daftar file icon"
            height="116px"
            width="116px"
          />
        </div>

        <h1 class="text-sm font-bold leading-6 text-[#616161]">
          Anda belum mengunggah file.
        </h1>
        <p class="text-center text-sm leading-6 text-[#9E9E9E]">
          Drop file di sini atau tekan tombol di bawah ini
          <span class="block">(file .pdf maksimal 10GB)</span>
        </p>

        <label
          for="file"
          class="bg-blue-500 border border-blue-600 text-white rounded-md py-[10px] px-4 text-center text-sm font-bold leading-[18px] w-fit cursor-pointer flex items-center"
        >
          <img
            src="~/static/upload.svg"
            alt="Upload icon"
            height="20px"
            width="20px"
          />
          <span class="px-2">Upload file</span>
          <input
            class="hidden opacity-0"
            type="file"
            name="file"
            id="file"
            @change="handleFileChange"
            accept="application/pdf"
            multiple
          />
        </label>
      </div>

      <div v-else class="flex flex-col w-full">
        <div
          v-for="(_, index) in fileURLs"
          :key="index"
          :class="{
            'px-6 py-4 flex': true,
            'border-l border-sky-500 bg-gradient-to-r from-sky-100 to-white':
              selectedFileIdx === index,
          }"
        >
          <p
            :class="{
              'text-sm leading-6 mr-4': true,
              'text-sky-500': selectedFileIdx === index,
            }"
          >
            {{ index + 1 }}.
          </p>

          <div class="flex-1">
            <p
              class="text-sm leading-6 mb-1 cursor-pointer"
              @click="changeSelectedFile(index)"
            >
              Document {{ index + 1 }} Title.pdf
            </p>
            <p class="text-xs text-gray-500">15 MB - Sel, 9 Jan 2024. 10.30</p>
          </div>

          <div class="ml-4">
            <button
              class="bg-blue-500 border border-blue-600 rounded-full p-2 mr-2"
            >
              <img
                src="~/static/upload.svg"
                alt="Upload icon"
                height="20px"
                width="20px"
              />
            </button>

            <button
              class="bg-white border border-gray-200 rounded-full p-2"
              @click="deleteFile(index)"
            >
              <img
                src="~/static/delete.svg"
                alt="Upload icon"
                height="20px"
                width="20px"
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<script>
import {
  POST_MESSAGE_BASE_URL,
  POST_MESSAGE_SOURCE_TITLE,
} from "~/constants/postMessage";

export default {
  data() {
    return {
      fileURLs: null,
      targetOrigin: `${POST_MESSAGE_BASE_URL}/multiple`,
      selectedFileIdx: -1,
    };
  },
  methods: {
    changeSelectedFile(idx) {
      this.selectedFileIdx = idx;
    },
    deleteFile(idx) {
      if (!this.fileURLs) return;
      
      this.fileURLs = this.fileURLs.filter((_, i) => idx !== i);
      this.selectedFileIdx = 0;
    },
    handleFileChange(event) {
      const selectedFiles = event.target.files;

      if (selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.readFileContents(selectedFiles[i]);
        }

        this.selectedFileIdx = 0;
      }
    },
    readFileContents(file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.fileURLs = [...(this.fileURLs ?? []), reader.result];
      };

      reader.readAsDataURL(file);
    },
    sendMessage(file) {
      const iframeWindow = this.$refs.reactPDFPreview.contentWindow;

      if (iframeWindow) {
        iframeWindow.postMessage(
          {
            source: POST_MESSAGE_SOURCE_TITLE,
            data: {
              file,
            },
          },
          this.targetOrigin
        );
      }
    },
  },
  watch: {
    fileURLs(val) {
      if (val) {
        this.sendMessage(val[this.selectedFileIdx]);
      } else {
        this.sendMessage(null);
      }
    },
    selectedFileIdx(val) {
      if (val >= 0 && this.fileURLs?.length >= 0) {
        this.sendMessage(this.fileURLs[this.selectedFileIdx]);
      } else {
        this.sendMessage(null);
      }
    },
  },
};
</script>
