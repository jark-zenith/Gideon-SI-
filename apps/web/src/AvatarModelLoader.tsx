import { useEffect, useRef, useState, type ChangeEvent } from "react";

type ModelViewerElement = HTMLElement & { src: string; cameraControls: boolean; autoRotate: boolean };

export default function AvatarModelLoader() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [modelUrl, setModelUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hostRef.current || !modelUrl) return;
    const viewer = document.createElement("model-viewer") as ModelViewerElement;
    viewer.src = modelUrl;
    viewer.setAttribute("camera-controls", "");
    viewer.setAttribute("auto-rotate", "");
    viewer.setAttribute("rotation-per-second", "12deg");
    viewer.setAttribute("interaction-prompt", "auto");
    viewer.setAttribute("loading", "eager");
    viewer.setAttribute("shadow-intensity", "0.8");
    viewer.setAttribute("exposure", "1.1");
    viewer.setAttribute("alt", "GIDEON custom 3D avatar model preview");
    viewer.style.width = "100%";
    viewer.style.height = "100%";
    viewer.style.minHeight = "280px";
    viewer.style.background = "radial-gradient(ellipse at center, rgba(18,111,155,.22), rgba(3,7,17,.2) 65%)";
    hostRef.current.replaceChildren(viewer);
    return () => { viewer.remove(); };
  }, [modelUrl]);

  function loadModel(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    if (!/\.glb$/i.test(file.name) && file.type !== "model/gltf-binary") {
      setError("Choose a .glb 3D model. A photograph cannot be rendered as a true 3D face model by this viewer.");
      event.currentTarget.value = "";
      return;
    }
    if (file.size > 40 * 1024 * 1024) {
      setError("The model must be smaller than 40 MB for this browser preview.");
      event.currentTarget.value = "";
      return;
    }
    setError("");
    setFileName(file.name);
    setModelUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
  }

  return <section className="avatar-model-panel" aria-label="Custom 3D avatar">
    <div className="avatar-model-heading"><div><span className="eyebrow"><span /> AVATAR WORKSHOP</span><h2>Personalized 3D presence</h2><p>Load a GLB model to preview it in the holographic workspace. The selected file stays in this browser session.</p></div><label className="model-upload-button">LOAD 3D MODEL<input type="file" accept=".glb,model/gltf-binary" onChange={loadModel} /></label></div>
    <div className={modelUrl ? "avatar-model-viewer loaded" : "avatar-model-viewer"}>{modelUrl ? <div ref={hostRef} className="model-viewer-host" /> : <div className="model-empty-state"><div className="model-wireframe" aria-hidden="true"><span /><i /><b /></div><strong>Custom face model required</strong><span>Import a .glb file to preview a real 3D avatar here.</span></div>}</div>
    <div className="avatar-model-footer"><span>{fileName ? "MODEL LOADED · " + fileName : "AWAITING PERSONALIZED MODEL"}</span><span>LOCAL PREVIEW · NO FILE UPLOAD</span></div>
    {error && <p className="model-error" role="alert">{error}</p>}
  </section>;
}
