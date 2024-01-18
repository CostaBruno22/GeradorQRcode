var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById("backgroundAudio");
    var audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(audioContext.destination);

    document.body.addEventListener("click", function () {
      audioContext.resume().then(function () {
        console.log("Áudio iniciado após interação do usuário.");
      });
      document.body.removeEventListener("click", this);
    });

    const download = document.querySelector(".download");
    const dark = document.querySelector(".dark");
    const light = document.querySelector(".light");
    const qrText = document.querySelector(".qr-text");
    const sizes = document.querySelector(".sizes");
    const shareBtn = document.querySelector(".share-btn");
    const qrContainer = document.querySelector("#qr-code");

    dark.addEventListener("input", handleDarkColor);
    light.addEventListener("input", handleLightColor);
    qrText.addEventListener("input", handleQRText); // Correção aqui
    sizes.addEventListener("input", handleSize); // Alterado de 'change' para 'input'
    shareBtn.addEventListener("click", handleShare);

    const defaultUrl = "https://www.youtube.com/channel/UCwqDiiEhnnqOOWL1JdoFmNQ";
    let colorLight = "#F8F4EC",
      colorDark = "#3D3B40",
      text = defaultUrl,
      size = 300;

    function handleDarkColor(e) {
      colorDark = e.target.value;
      generateQRCode();
    }

    function handleLightColor(e) {
      colorLight = e.target.value;
      generateQRCode();
    }

    function handleQRText(e) {
      const value = e.target.value;
      text = value;
      if (!value) {
        text = defaultUrl;
      }
      generateQRCode();
    }

    function handleSize(e) {
      size = e.target.value;
      generateQRCode();
    }

    async function generateQRCode() {
      qrContainer.innerHTML = "";
      new QRCode("qr-code", {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
      });
      download.href = await resolveDataUrl();
    }

    async function handleShare() {
      setTimeout(async () => {
        try {
          const base64url = await resolveDataUrl();
          const blob = await (await fetch(base64url)).blob();
          const file = new File([blob], "QRcode.png", {
            type: blob.type,
          });
          await navigator.share({
            files: [file],
            title: text,
          });
        } catch (error) {
          alert("Seu navegador não tem suporte a esta tecnologia.");
        }
      }, 100);
    }

    function resolveDataUrl() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const img = document.querySelector("#qr-code img");
          if (img.currentSrc) {
            resolve(img.currentSrc);
            return;
          }
          const canvas = document.querySelector("canvas");
          resolve(canvas.toDataURL());
        }, 50);
      });
    }