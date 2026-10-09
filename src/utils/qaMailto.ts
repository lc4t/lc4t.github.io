import { QA } from "@config";

// 投稿邮件正文模板。引导读者留下联系方式、选择是否公开署名、给出展示昵称。
// 提问者邮箱只会留在收件人自己的邮件客户端与我的收件箱里。
const BODY_TEMPLATE = [
  "（麻烦保留下面几行，方便我回复、拟标题；一封信聊一个问题就好）",
  "",
  "一句话概括你想问的：",
  "联系方式（邮箱或其他，不会公开）：",
  "公开时是否署名（是 / 否）：",
  "公开展示用的昵称：",
  "",
  "———",
  "",
  "展开说说：",
  "",
].join("\n");

/**
 * 生成投稿用的 mailto: 链接。未配置收件邮箱时返回 null，页面据此回退为纯文案。
 */
export const qaMailtoHref = (subject = "读者来信"): string | null => {
  const to = QA.submitEmail?.trim();
  if (!to) return null;

  const enc = encodeURIComponent;
  const fullSubject = [QA.subjectPrefix, subject].filter(Boolean).join(" ");
  return `mailto:${to}?subject=${enc(fullSubject)}&body=${enc(BODY_TEMPLATE)}`;
};

export default qaMailtoHref;
