/** Headline keyword highlight: escape HTML, then turn **word** into <span class="hl">word</span>. */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const hl = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
/** same text without the markers, for <title> and meta tags */
export const plain = (s: string) => s.replace(/\*\*/g, '');
