// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/NakanishiYuri/Desktop/vue/vue-tree-sample_ts/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/NakanishiYuri/Desktop/vue/vue-tree-sample_ts/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/NakanishiYuri/Desktop/vue/vue-tree-sample_ts/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { quasar } from "file:///C:/Users/NakanishiYuri/Desktop/vue/vue-tree-sample_ts/node_modules/@quasar/vite-plugin/src/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/NakanishiYuri/Desktop/vue/vue-tree-sample_ts/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    quasar({
      sassVariables: "src/css/quasar-variables.sass"
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxOYWthbmlzaGlZdXJpXFxcXERlc2t0b3BcXFxcdnVlXFxcXHZ1ZS10cmVlLXNhbXBsZV90c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcTmFrYW5pc2hpWXVyaVxcXFxEZXNrdG9wXFxcXHZ1ZVxcXFx2dWUtdHJlZS1zYW1wbGVfdHNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL05ha2FuaXNoaVl1cmkvRGVza3RvcC92dWUvdnVlLXRyZWUtc2FtcGxlX3RzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbmltcG9ydCB7IHF1YXNhciwgdHJhbnNmb3JtQXNzZXRVcmxzIH0gZnJvbSAnQHF1YXNhci92aXRlLXBsdWdpbidcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgdnVlSnN4KCksXG4gICAgcXVhc2FyKHtcbiAgICAgIHNhc3NWYXJpYWJsZXM6ICdzcmMvY3NzL3F1YXNhci12YXJpYWJsZXMuc2FzcydcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLGVBQWUsV0FBVztBQUVoWSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMsY0FBa0M7QUFMa0wsSUFBTSwyQ0FBMkM7QUFPOVEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLElBQ2pCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
