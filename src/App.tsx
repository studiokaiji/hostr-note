import { useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "./components/Editor";
import { H1 } from "./components/H1";
import {
  nip19,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  UnsignedEvent,
  getSignature,
  relayInit,
  Event,
} from "nostr-tools";
import { Button } from "./components/Button";
import { Link } from "./components/Link";
import { TextField } from "./components/TextField";

const PRIVATE_KEY_NAME = "hostr-note-app-private-key";

const relay = relayInit("wss://r.hostr.cc");

function App() {
  const [dTagId, setDTagId] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const url = useMemo(() => {
    if (event) {
      return `https://h.hostr.cc/p/${event.pubkey}/d/${event.tags[0][1]}`;
    }
    return "";
  }, [event]);

  const privateKey = useRef("");
  const [publicKey, setPublicKey] = useState("");
  const npub = useMemo(
    () => (publicKey ? nip19.npubEncode(publicKey) : ""),
    [publicKey]
  );

  const [status, setStatus] = useState<
    "idle" | "fetching" | "publishing" | "success" | "failed"
  >("idle");

  useEffect(() => {
    relay.connect();

    const localPriKey = localStorage.getItem(PRIVATE_KEY_NAME);
    const priKey = localPriKey ? localPriKey : generatePrivateKey();
    if (localPriKey !== priKey) {
      localStorage.setItem(PRIVATE_KEY_NAME, priKey);
    }
    privateKey.current = priKey;
    const pubKey = getPublicKey(priKey);
    setPublicKey(pubKey);
  }, []);

  const importNote = async () => {
    setEvent(null);
    setStatus("fetching");
    const event = await relay.get({
      authors: [publicKey],
      kinds: [35392],
      "#d": [dTagId],
    });
    if (event) {
      setEvent(event);
    }
    setStatus("idle");
  };

  const publish = (html: string) => {
    setStatus("publishing");

    const timestamp = Math.floor(Date.now() / 1000);

    const unsigned: UnsignedEvent = {
      pubkey: publicKey,
      content: html,
      kind: 35392,
      tags: [["d", String(timestamp)]],
      created_at: timestamp,
    };

    const id = getEventHash(unsigned);
    const sig = getSignature(unsigned, privateKey.current);

    const event = { ...unsigned, id, sig };

    relay
      .publish(event)
      .then(() => {
        setStatus("success");
        setEvent(event);
        setDTagId(event.tags[0][1]);
      })
      .catch(() => setStatus("failed"))
      .finally(() => {
        setTimeout(() => setStatus("idle"), 3000);
      });
  };

  return (
    <div className="p-8 md:py-16 space-y-8 max-w-4xl mx-auto">
      <H1>📝 Hostr Note App</H1>
      <p className="font-medium text-lg">
        A test app for posting notes on Hostr with web hosting on Nostr. Only
        you can edit it.
      </p>
      <p>🗝 Your Public Key: {npub}</p>
      <div className="flex flex-col">
        <TextField
          label="Exist Note ID (d tag)"
          value={dTagId}
          readOnly={status !== "idle" || !!event}
          onChange={(e) => setDTagId(e.target.value)}
        />
        <div>
          <Button
            variant="outlined"
            onClick={importNote}
            size="small"
            disabled={status !== "idle" || !!event}
          >
            Import
          </Button>
        </div>
      </div>
      <Editor
        onRequestPublish={publish}
        readOnly={
          status === "fetching" ||
          (status === "idle" && !!event && event?.pubkey !== publicKey)
        }
        baseHtml={event?.content}
        publishing={status === "publishing"}
      />
      {status !== "idle" && <p>{`Status: ${status}`}</p>}
      {url && (
        <p>
          URL: <Link href="url">{url}</Link>
        </p>
      )}
    </div>
  );
}

export default App;
