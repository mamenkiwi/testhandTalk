
    // const intTexto = document.getElementById('ipt')
    const coreElem = document.getElementById('core')
    const fileselect = document.getElementById('fileselect')

    const subtitleOptions = {"color":"#000000",
            "font-family": "Arial",
            "font-size": "1.5rem",
            "top": "1rem"};

    let core;
    let initAttempts = 0;

    // function initializeCore() {
    //   core = undefined;
    //   coreElem.innerHTML = ""
    //   core = new HTCore({
    //     parentElement: coreElem,
    //     width: 500,
    //     height: 800,
    //     avatar: androidJSBridge.attrs.avatar,
    //     debug: androidJSBridge.attrs.debugMode,
    //     fpsLimit: androidJSBridge.attrs.fpsLimit,
    //     useGouradShading: true
    //   });

    //   return core.load(true, (progress) => {
    //       androidJSBridge.callbacks.onProgressChange(progress);
    //   });
    // }

    function launchCore() {
      ++initAttempts;

      console.info(`Launching Core Attempt #${  initAttempts}`);

      initializeCore().then(() => {
        if (core.loadStatus === "LOADED") {
          androidJSBridge.callbacks.onReady();
          core.setCameraPosition()
          core.setSubtitleOptions(subtitleOptions);
        }
      }).catch(err => {
        console.error(err);
        if (initAttempts < 3) {
          launchCore();
        }
      })
    }

    /* Launch Core */
    launchCore();
    /* ........... */

    function setSpeed(speed) {
      core.setSpeed(speed);
    }

    function setFOV(fov) {
      core.fov(fov);
      currentFov = fov;
    }

    function setRotation(rotation) {
      core.setRotation(rotation);
    }

    function changeAvatar(avatarName) {
      core.changeAvatar(avatarName);
      androidJSBridge.callbacks.onAvatarChanged(avatarName);
    }

    function resize(widthPx, heightPx) {
      core.resize(widthPx, heightPx)
    }

    function setBackgroundColor(color) {
      core.setBackgroundColor(color)
    }

    function stopAllSigns() {
      core.stop()
    }

    function signApp(text, apiEndPoint, signLanguageId, oralLanguageId, playImmediately, showSubtitle) {
      const repeatable = true;

      core.signApp(text, apiEndPoint, signLanguageId, oralLanguageId, "app", playImmediately, showSubtitle, repeatable, {
        onDownloaded (animationCodes) {
          androidJSBridge.callbacks.onDownloaded(animationCodes.join("$"));
        },
        onSignalized () {
          androidJSBridge.callbacks.onSignalized()
        },
        onCanceled () {
          androidJSBridge.callbacks.onCanceled()
        },
        onError () {
          androidJSBridge.callbacks.onError()
        }
      })
    }

    function repeat() {
      core.repeat({
        onDownloaded () {
          androidJSBridge.callbacks.onDownloaded()
        },
        onSignalized () {
          androidJSBridge.callbacks.onSignalized()
        },
        onCanceled () {
          androidJSBridge.callbacks.onCanceled()
        },
        onError () {
          androidJSBridge.callbacks.onError()
        }
      })
    }

    function signAnimationCodeArray(codeArr, repeatable) {
      const playImmediately = true;

      core.signAnimationCodes(codeArr, playImmediately, repeatable, {
        onDownloaded () {
          androidJSBridge.callbacks.onDownloaded()
        },
        onSignalized () {
          androidJSBridge.callbacks.onSignalized()
        },
        onCanceled () {
          androidJSBridge.callbacks.onCanceled()
        },
        onError () {
          androidJSBridge.callbacks.onError()
        }
      })
    }

    

    function signAnimationCode(animationCode) {
      const playImmediately = true;
      const repeatable = false;
      core.signAnimationCodes([animationCode, "@repouso"], playImmediately, repeatable, {
        onDownloaded () {
          androidJSBridge.callbacks.onDownloaded()
        },
        onSignalized () {
          androidJSBridge.callbacks.onSignalized()
        },
        onCanceled () {
          androidJSBridge.callbacks.onCanceled()
        },
        onError () {
          androidJSBridge.callbacks.onError()
        }
      })
    }

    function applyCustomization(customization) {
      androidJSBridge.callbacks.onCustomizationStarted()
      core.applyCustomization(customization, () => {
        core.signAnimationCode(animations.surprise)
      })
    }

    function loadImage(imageUrl, callback) {
      const img = new Image();
      img.onload = callback;

      img.src = imageUrl;
      if (img.complete) img.onload();
    }

    function applyBackground(imageUrl) {
        if (imageUrl === "default") {
            core.setBackgroundColor("#e8e6e8",1);
            androidJSBridge.callbacks.onBackgroundApplied();
        } else {
            core.setBackgroundColor("",0);

            loadImage(imageUrl, function() {
              const bg = document.getElementById("core-content");
              bg.style.backgroundImage = `url(${imageUrl})`
              androidJSBridge.callbacks.onBackgroundApplied();
            });
        }
    }

    function applySubtitleColor(subtitleColor) {
        subtitleOptions.color = subtitleColor === "default" ? "#000000" : subtitleColor;
        core.setSubtitleOptions(subtitleOptions);
    }

    function enterStore() {
        cancelOnTouch = false;
        core.setCameraPosition({y:3, z:0.5}, 1)
        core.signAnimationCodes(["@repouso2"])
    }

    function exitStore() {
        cancelOnTouch = true;
        core.setCameraPosition()
        core.stop()
    }

  