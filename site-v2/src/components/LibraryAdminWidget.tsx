import { Lock, MessageCircle } from 'lucide-react';
import { useState } from 'react';

type Props = {
  imageSrc?: string;
};

export default function LibraryAdminWidget({ imageSrc }: Props) {
  const [showImage, setShowImage] = useState(Boolean(imageSrc));

  return (
    <aside className="admin-widget" aria-label="图书馆管理员">
      <div className="admin-avatar" aria-hidden="true">
        {imageSrc && showImage ? (
          <img src={imageSrc} alt="" onError={() => setShowImage(false)} />
        ) : (
          <span>管</span>
        )}
      </div>
      <div className="admin-bubble">
        <strong>管理员值班中</strong>
        <p>账号和 Agent 对话模块会放在后续版本。</p>
        <span className="disabled-action">
          <Lock size={14} aria-hidden="true" />
          <MessageCircle size={14} aria-hidden="true" />
          暂未开放
        </span>
      </div>
    </aside>
  );
}
