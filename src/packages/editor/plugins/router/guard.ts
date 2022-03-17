import { Router } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // 进度条样式

class Guard {
  private beforeEach(router: Router) {
    router.beforeEach(() => {
      NProgress.start(); // start progress bar
      return true;
    });
  }
  private afterEach(router: Router) {
    router.afterEach(() => {
      NProgress.done(); // finish progress bar
    });
  }
  public run(router: Router) {
    this.beforeEach(router);
    this.afterEach(router);
  }
}

export const guard = new Guard();
