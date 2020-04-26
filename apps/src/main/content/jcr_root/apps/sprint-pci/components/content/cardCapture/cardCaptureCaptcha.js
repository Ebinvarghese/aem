'use strict';
use(function() {
  var captchaSitekey = sling.getService(Packages.com.sprint.common.services.CaptchaKeyConfig);
  var captchakey = captchaSitekey.getCaptchavalues();
  return {
    captchakey: captchakey
  };
});
