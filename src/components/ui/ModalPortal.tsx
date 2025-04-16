import reactDom from 'react-dom';
type Props = {
  children: React.ReactNode;
}

export default function ModalPortal({children}:Props) {
  // 서버에선 해주지 않기 위해?
  if (typeof window === 'undefined') {
    return null;
  }

  const node = document.getElementById('portal') as Element;
  return reactDom.createPortal(children, node);
}