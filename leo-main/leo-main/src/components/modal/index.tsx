import { ReactNode, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { TbX } from 'react-icons/tb';

const ModalContainer = ({
  isOpen,
  onClose,
  backdropCloseEnabled = true,
  styles,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  backdropCloseEnabled?: boolean;
  styles?: string;
  children: ReactNode;
}) => {
  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (backdropCloseEnabled) {
      const handleOutsideClick = (e: MouseEvent) => {
        if (
          e.target &&
          e.target instanceof Element &&
          e.target.classList.contains('modal-overlay')
        ) {
          closeModal();
        }
      };

      if (isOpen) {
        document.addEventListener('click', handleOutsideClick);
      }

      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [backdropCloseEnabled, closeModal, isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-start py-10 justify-center z-50 modal-overlay overflow-y-auto">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className={classNames('p-4 rounded-lg z-50', styles)}>
            <div className="justify-end items-center flex">
              <span
                className="text-xl cursor-pointer pb-4"
                onClick={closeModal}>
                <TbX />
              </span>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
