import { createContext, useContext, useState, type ReactNode } from "react";

type ModalContextType = {
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode | null>(null);

  const openModal = (node: ReactNode) => setContent(node);
  const closeModal = () => setContent(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {content && (
        <div
          className="fixed inset-0 flex items-center bg-red-100 justify-center z-50 w-screen h-screen z-101"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div onClick={e => e.stopPropagation()}>
            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};