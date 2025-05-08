import { useState, useEffect } from "react";

const InstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };

  useEffect(() => {
    // Provjera za iOS uređaje
    setIsIOSDevice(isIOS());

    const handleBeforeInstallPrompt = (event) => {
      console.log("beforeinstallprompt event fired");
      if (isIOS()) return; // Ne obrađuj događaj na iOS-u
      event.preventDefault(); // Spriječite zadano ponašanje
      setInstallPromptEvent(event); // Spremite događaj
      console.log("installPromptEvent saved"); // Provjera
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (installPromptEvent) {
      console.log("installPromptEvent is set, triggering prompt");
      if (window.matchMedia("(display-mode: standalone)").matches) {
        console.log("App is already installed");
        return;
      }

      setTimeout(() => {
        console.log("Triggering install prompt");
        installPromptEvent.prompt(); // Prikažite prompt
        installPromptEvent.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
          setInstallPromptEvent(null); // Resetirajte događaj
        });
      }, 3000); // Odmak od 3 sekunde
    }
  }, [installPromptEvent]); // Pokreće se kada se `installPromptEvent` promijeni

  if (isIOSDevice) {
    // Prikaz fallback opcije za iOS
    return (
      <div style={{ padding: "10px", background: "lightyellow", textAlign: "center" }}>
        <p>
          To install this app, tap the <strong>Share</strong> button and select <strong>Add to Home Screen</strong>.
        </p>
      </div>
    );
  }

  return null; // Nema potrebe za prikazivanjem UI-a na drugim uređajima
};

export default InstallPrompt;
