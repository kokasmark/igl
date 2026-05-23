import Peer from "peerjs";
import type { DataConnection } from "peerjs";
import { useEffect, useRef } from "react";
import type { IMatch } from "../types/Game";

type SyncMessage =
    | { __newPeer: string }
    | IMatch;

export function useSync(
    match: IMatch,
    onReceive: (match: IMatch) => void,
    onConnectionChange?: (count: number) => void
) {
    const peerRef = useRef<Peer | null>(null);
    const connsRef = useRef<DataConnection[]>([]);
    const isHostRef = useRef(false);
    const isRemote = useRef(false);
    const matchRef = useRef(match);

    useEffect(() => { matchRef.current = match; }, [match]);

    const code = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    };

    const broadcast = (data: SyncMessage) => {
        connsRef.current.forEach(conn => {
            if (conn.open) conn.send(data);
        });
    };

    const addConn = (conn: DataConnection) => {
        conn.on("data", (data) => {
            const msg = data as SyncMessage;

            if ("__newPeer" in msg) {
                const newConn = peerRef.current!.connect(msg.__newPeer);
                newConn.on("open", () => addConn(newConn));
                return;
            }

            isRemote.current = true;
            onReceive(msg);
        });

        conn.on("close", () => {
            connsRef.current = connsRef.current.filter(c => c !== conn);
        });

        conn.on("error", () => {
            connsRef.current = connsRef.current.filter(c => c !== conn);
        });

        connsRef.current.push(conn);
    };

    const host = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const peer = new Peer(code());
            peerRef.current = peer;
            isHostRef.current = true;

            peer.on("open", id => resolve(id));
            peer.on("error", (err) => {
            if (err.type === "unavailable-id") {
                peerRef.current?.destroy();
                host().then(resolve).catch(reject);
            } else {
                reject(err);
            }
            });

            peer.on("connection", conn => {
                conn.on("open", () => {
                    connsRef.current.forEach(existing => {
                        if (existing.open) existing.send({ __newPeer: conn.peer });
                    });

                    addConn(conn);

                    conn.send(matchRef.current);
                });
            });
        });
    };

    const join = (roomCode: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const peer = new Peer();
            peerRef.current = peer;
            isHostRef.current = false;

            peer.on("error", reject);

            peer.on("open", () => {
                const conn = peer.connect(roomCode);

                conn.on("open", () => {
                    addConn(conn);
                    resolve();
                });

                conn.on("error", reject);
            });

            peer.on("connection", conn => {
                conn.on("open", () => addConn(conn));
            });
        });
    };

    const destroy = () => {
        connsRef.current.forEach(c => c.close());
        connsRef.current = [];
        peerRef.current?.destroy();
        peerRef.current = null;
    };

    useEffect(() => {
        if (isRemote.current) {
            isRemote.current = false;
            return;
        }
        broadcast(match);
    }, [match]);

    useEffect(() => {
        return () => destroy();
    }, []);

    return { host, join, destroy };
}