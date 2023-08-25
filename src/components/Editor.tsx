import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Editor.css";
import { useEffect } from "react";
import { Button } from "./Button";

let quill: Quill;

type EditorProps = {
  onRequestPublish: (html: string) => void;
  baseHtml?: string;
  readOnly?: boolean;
  publishing?: boolean;
};

export const Editor = ({
  onRequestPublish,
  baseHtml,
  publishing,
  readOnly,
}: EditorProps) => {
  const publish = () => {
    onRequestPublish(quill.root.innerHTML);
  };

  useEffect(() => {
    if (baseHtml?.length) {
      quill.root.innerHTML = baseHtml;
    }
  }, [baseHtml]);

  useEffect(() => {
    quill = new Quill("#quill-editor", {
      theme: "snow",
      readOnly,
    });
    return () => {
      // get surrounding
      const elem = document.getElementById("quill-editor-surrounding");

      if (elem) {
        while (elem.hasChildNodes()) {
          elem.removeChild(elem.firstChild!);
        }

        // create new empty div
        const node = document.createElement("div");

        // change id
        node.id = "quill-editor";

        // add
        elem.append(node);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div id="quill-editor-surrounding" className="space-y-4">
        <div id="quill-editor" className="h-40"></div>
      </div>
      <div className="space-x-2 flex justify-end">
        <Button onClick={publish} disabled={publishing}>
          Publish
        </Button>
      </div>
    </div>
  );
};
