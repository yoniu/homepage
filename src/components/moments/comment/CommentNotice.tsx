interface CommentNoticeProps {
  title: string;
  hint: string;
}

export default function CommentNotice({ title, hint }: CommentNoticeProps) {
  return (
    <div className="comment-placeholder">
      <div className="comment-placeholder__title">{title}</div>
      <div className="comment-placeholder__hint">{hint}</div>
    </div>
  );
}
